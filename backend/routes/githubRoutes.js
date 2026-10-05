const express = require("express");
const {
  startGithubOAuth,
  githubCallback,
  getGithubRepositories,
} = require("../controllers/githubController");

const router = express.Router();

router.get("/", startGithubOAuth);
router.get("/callback", githubCallback);
router.get("/repos", getGithubRepositories);

module.exports = router;
