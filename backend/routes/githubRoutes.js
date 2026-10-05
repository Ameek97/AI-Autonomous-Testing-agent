const express = require("express");
const {
  startGithubOAuth,
  githubCallback,
} = require("../controllers/githubController");

const router = express.Router();

router.get("/", startGithubOAuth);
router.get("/callback", githubCallback);

module.exports = router;
