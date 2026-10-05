const axios = require("axios");

const getGithubRepositories = async (req, res) => {

  try{

const response = await axios.get("https://api.github.com/user/repos", {
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
    Accept: "application/vnd.github+json",
  },
});

    res.json(response.data);

  } 
   catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch GitHub repositories",
        });
    }
}

module.exports = getGithubRepositories;