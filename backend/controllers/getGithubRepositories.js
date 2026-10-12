const axios = require("axios");

const getGithubRepositories = async (req, res) => {

  try{

const response = await axios.get("https://api.github.com/user/repos", {
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
    Accept: "application/vnd.github+json",
  },
});
console.log("hello");


const repos = response.data.map((repo) => {
  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    private: repo.private,
    html_url: repo.html_url,
    description: repo.description,
    updated_at: repo.updated_at,
    language: repo.language,
    default_branch: repo.default_branch,
    owner : repo.owner.login
  };
});
     console.log(response);
     console.log( repos )
    res.json( repos );

  } 
   catch (error) {
        console.log(error);
        console.error(error.message);
        res.status(500).json({
            message: "Failed to fetch GitHub repositories",
        });
    }
}

module.exports = getGithubRepositories;