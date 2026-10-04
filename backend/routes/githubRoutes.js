const express = require("express");
const { startGithubOAuth } = require("../../controllers/githubController");

const router = express.Router();

router.get("/", startGithubOAuth);

module.exports = router;
