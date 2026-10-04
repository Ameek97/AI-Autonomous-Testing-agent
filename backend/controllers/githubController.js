const axios = require("axios");
const crypto = require("crypto");

const { saveAccessToken } = require("../models/githubModel");

const startGithubOAuth = (req, res) => {
  const stateValue = crypto.randomBytes(32).toString("hex");

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: "http://localhost:5000/api/github/callback",
    scope: "repo read:user",
    state: stateValue,
  });

  res.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
};

const githubCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;

    const result = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = result.data.access_token;

    // Temporary for now
    const userId = "temporary-user-id";

    await saveAccessToken(userId, accessToken);

    res.redirect("http://localhost:5173/workspace");  } 
  
  
  catch (error) {
    console.error(error);

    res.status(500).json({
      message: "GitHub OAuth failed",
    });
  }
};

module.exports = {
  startGithubOAuth,
  githubCallback,
};