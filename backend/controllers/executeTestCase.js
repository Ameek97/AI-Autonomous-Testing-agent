const pool = require("../db/connections")
const axios = require("axios")
const { GoogleGenAI } = require("@google/genai");
const { Browserbase } = require("@browserbasehq/sdk");
const { chromium } = require("playwright-core");
// the backend will recieve the tesetcase ids that are to be executed, along with the target domain and global instrcution to give to llm
// we will recieve those ids and fetch them from the database

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,});


// provided a testcase, fetch its target files from github
const fetchGithubFiles = async (testcase, githubToken) => {
  
  const files = []; // store tqhe fetched files here
  const owner = testcase.repo_owner;   // these params are used to make api req to git
  const repoName = testcase.repo_name;
  const branch = testcase.branch || "main";
  const targetFiles = testcase.target_files || [];  // fetch content of each target file

  for (const path of targetFiles) {
    try {

      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repoName}/contents/${path}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github+json",},} );




      const data =  response.data;

      if (data.content) {
        const content = Buffer.from(data.content, "base64").toString("utf-8"); // the data we recieve from git is in base64 format, so we have to decode it to utf-8 

        files.push({
          path,
          content: content.slice(0, 5000), });
      }
    } catch (err) {
      console.error(`Error fetching ${path}:`, err.message); }  }

  return files;
};








const executeTestCase = async (req, res) => {
 try {
const {testCaseIds, target_domain, global_instruction} = req.body

  const testcases = [];

  // 1) fetch the testcases from the database 
  for (const id of testCaseIds) {
    const result = await pool.query(
    "SELECT * FROM test_cases WHERE id = $1",
    [id] );

  if (result.rows.length > 0) {
    testcases.push(result.rows[0]);} }



    
 // 2) fetch the actual code of these testcases from the github, each testcase has file mentioned 
 //    in testcase table, the target files for each testcase is present which we fetch
    const result = await pool.query(
  "SELECT github_access_token FROM users WHERE id = $1",
  [req.user.id]
);

const githubToken = result.rows[0]?.github_access_token;
const testcaseFiles = [];

      for (const testcase of testcases) {
        const files = await fetchGithubFiles(testcase, githubToken);  // fetch the files for this code

        testcaseFiles.push({
          testCaseId: testcase.id,
          files,});     }



 // 3) now pass the testcases to the llm along with the target domain and global instruction to generate the test script for each
    const generatedScripts = [];

      for (const item of testcaseFiles) {
        const testcase = testcases.find(
          (tc) => tc.id === item.testCaseId);

        if (!testcase) continue;

        const repoContext = item.files
          .map((file) => `File: ${file.path}\n${file.content}`)
          .join("\n\n");

        const prompt = `
      You are an expert software QA engineer.

      Generate a Playwright test script for the following test case.

      Base URL: ${target_domain}
      Global instructions: ${global_instruction}

      Test case title: ${testcase.title}
      Description: ${testcase.description}
      Target route: ${testcase.target_route || "/"}
      Expected result: ${testcase.expected_result}

      Source code files:
      ${repoContext}

      Requirements:
      - Use the provided page object.
      - Do not import modules or launch a browser.
      - Assert the expected result with a Playwright expect() call.
      - Include the expected result text in that assertion, and throw if it is not met.
      - Return only executable JavaScript code.
      `;



        const result = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
        });

        let script = result.text;

        if (!script) {
          throw new Error(
            `Gemini returned an empty script for test case ${testcase.id}`
          );
        }

        // Remove Markdown code fences if Gemini includes them
        script = script
          .replace(/^```(?:javascript|js)?\s*/i, "")
          .replace(/\s*```$/, "")
          .trim();

        generatedScripts.push({
          testCaseId: testcase.id,
          expectedResult: testcase.expected_result,
          script,
        });
      }

      console.log(generatedScripts);

     
const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY,
});

let session;
let browser;
const results = [];

try {
  session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID,
  });

  browser = await chromium.connectOverCDP(
    session.connectUrl
  );
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  // run the generated scripts and store the outcome in result array
  for (const item of generatedScripts) {
    const logs = [];

    try {
      const AsyncFunction = Object.getPrototypeOf(
        async function () {}
      ).constructor;

      const runScript = new AsyncFunction(
        "page",
        "console",
        item.script
      );

      await runScript(
        page,
        {
          log: (...args) => logs.push(args.join(" ")),
          error: (...args) => logs.push(args.join(" ")),
          warn: (...args) => logs.push(args.join(" ")),
        }
      );

      const expectedResult = item.expectedResult || "";
      const assertsExpectedResult =
        expectedResult.length > 0 &&
        item.script.includes(expectedResult) &&
        /expect\s*\(|assert\s*\(|\bthrow\b|\.to(?:Be|Contain|Have|Equal|Match)\b/.test(item.script);

      if (assertsExpectedResult) {
        results.push({
          testCaseId: item.testCaseId,
          status: "passed",
          logs,
        });
      } else {
        results.push({
          testCaseId: item.testCaseId,
          status: "failed",
          logs,
          error: "Generated script does not assert the expected result",
        });
      }
    } catch (err) { // if error, it means it failed
      results.push({
        testCaseId: item.testCaseId,
        status: "failed",
        logs,
        error: err.message,
      });
    }
  }
} finally {

  try {
    if (browser) {
      await browser.close(); }
  } catch (error) {
    console.error(error.message);}

  try {
    if (session) {
      await bb.sessions.update(session.id, {
        status: "REQUEST_RELEASE",}); }

      } catch (error) { console.error(error.message); }



  try {
    for (const result of results) {
      await pool.query(
        `INSERT INTO test_results (
          test_case_id, status, logs, error_message, executed_at)
        VALUES ($1, $2, $3::jsonb, $4, NOW())`,
        [
          result.testCaseId,
          result.status,
          JSON.stringify(result.logs),
          result.error || null,
        ]
      );
    }
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to save test results");
  }
}


   return res.status(200).json({
    message: "Test execution completed",
    results,
});

 } catch (error) {
   console.error(error.message);

   const message = error.message === "Failed to save test results"
     ? "Failed to save test results"
     : "Failed to execute test cases";

   return res.status(500).json({ message });
 }

};

module.exports = executeTestCase;
