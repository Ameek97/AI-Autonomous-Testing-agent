const express = require("express");
const { startGithubOAuth } = require("../../controllers/githubController");
const {githubCallback} = require( "./../controllers/githubController")
const router = express.Router();

router.get("/", startGithubOAuth);
router.get("/callback", githubCallback);

module.exports = router;
