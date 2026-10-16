const express = require("express");
const {
  startGithubOAuth,
  githubCallback,
  getGithubRepositories,
} = require("../controllers/githubController");
const generateTests = require("../controllers/generateTests");

const router = express.Router();

router.get("/", startGithubOAuth);
router.get("/callback", githubCallback);
router.get("/repos", getGithubRepositories);
router.post("/generate-tests", generateTests);



module.exports = router;
