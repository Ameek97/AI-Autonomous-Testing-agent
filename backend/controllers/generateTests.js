const axios = require("axios");
const pool = require("../db/connections");

// 1) get all the file structure using the get repo tree 
// 2) filter out the usefull files, like having certain extensions
// 3) read the useful files, send api req to github for each file
// 4) get the content of each file, and provide it to gemini along with the instruction prompt 
// 5) get the response from gemini, and save it to the database

const getUserToken = async (userId) => {
  const result = await pool.query(
    `SELECT github_access_token
     FROM users
     WHERE id = $1`,
    [userId]
  );

  return result.rows[0].github_access_token;
};

const getrepo = async (repoId) => {
  const result = await pool.query(
    `SELECT name, full_name, default_branch, user_id
     FROM repositories
     WHERE id = $1`,
    [repoId]);

  const fullName = result.rows[0].full_name;
  const owner = fullName.split("/")[0];

  return {
    owner: owner,
    name: result.rows[0].name,
    branch: result.rows[0].default_branch,
    userId: result.rows[0].user_id,
  };
};

const getrepostructure = async (owner, repo, branch, token) => {
  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",},  } );

  return response.data.tree;};





  const filterRepoTree = (repotree) => {
      const allowedExtensions = [
        ".js", ".jsx", ".ts", ".tsx", ".json", ".md"];

      const ignoredPaths = [
        "node_modules", ".next", "dist", "build",
        ".git", "coverage", "public/",
        "package-lock.json", "yarn.lock", "pnpm-lock.yaml" ];

      return repotree.filter((file) => {
        if (file.type !== "blob") return false;

        if (ignoredPaths.some((path) => file.path.includes(path))) {return false;}

        return allowedExtensions.some((ext) =>
          file.path.endsWith(ext) ); });};






const generateTests = async (req, res) => {
  
  const repo = await getrepo(req.params.repoid); // get the repository from the database 
  const token = await getUserToken(repo.userId); // get the token from the user database 
  
  const repotree = await getrepostructure(repo.owner, repo.name, repo.branch, token); // call the github api to get all the files for this repo
  

  const filteredfiles = filterRepoTree( repotree ); // filter the files 

  
  const files = await Promise.all( // get the content of the filtered files
    filteredfiles.map((file) => getFileContent(repo.owner,repo.name,file.path,repo.branch, token )));



  };

module.exports = generateTests;
