const getGithubAccessToken = require("../db/getGithubAccessToken");

const getUserGithubToken = async (req, res) => {
  const userid = req.params.userid;

  try {
    const user = await getGithubAccessToken(userid);

    if (!user) {
      return res.status(404).json({
        message: "User not found",});  }

    if (!user.github_access_token) {
      return res.status(404).json({
        message: "GitHub access token not found", });}

    return res.status(200).json({
      github_access_token: user.github_access_token,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      message: "Failed to fetch GitHub access token",
    });
  }
};

module.exports = getUserGithubToken;
