const express = require("express");
const cors = require("cors");
require("dotenv").config();

const githubRoutes = require("./routes/githubRoutes");
const repositoryRoutes = require("./routes/repositoryRoutes");
const testcaseRoutes = require("./routes/testcaseRoutes");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/github", githubRoutes);
app.use("/api/repositories", repositoryRoutes);
app.use("/api/testcase/", testcaseRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
