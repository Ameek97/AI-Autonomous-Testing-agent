const pool = require("../db/connections")
const axios = require("axios")
const { GoogleGenAI } = require("@google/genai");
// the backend will recieve the tesetcase ids that are to be executed, along with the target domain and global instrcution to give to llm
// we will recieve those ids and fetch them from the database


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



      if (!response.ok) {
        console.error(`Failed to fetch ${path}: ${response.status}`);
        continue; }

      const data =  response.json();

      if (data.content) {
        const content = Buffer.from(data.content, "base64").toString("utf-8");

        files.push({
          path,
          content: content.slice(0, 5000), });
      }
    } catch (err) {
      console.error(`Error fetching ${path}:`, err.message); }  }

  return files;
};








const executeTestCase = async (req, res) => {
 
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
    const githubToken = req.cookies.github_access_token;
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
          (tc) => tc.id === item.testCaseId
        );

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
      - Return only executable JavaScript code.
      `;

        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
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
          script,
        });
      }

      console.log(generatedScripts);

     


};

module.exports = executeTestCase;
