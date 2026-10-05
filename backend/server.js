const express = require("express");
const cors = require("cors");
require("dotenv").config();

const githubRoutes = require("./routes/githubRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/github", githubRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
