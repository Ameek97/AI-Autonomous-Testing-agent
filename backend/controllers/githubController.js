function startGithubOAuth(req, res) {
  res.status(501).json({
    message: "GitHub OAuth is not implemented yet",
  });
}

module.exports = {
  startGithubOAuth,
};
