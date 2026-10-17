const pool = require("../db/connections");

const gettestcases = async (req, res) => {
  try {
    const repoid = req.params.repoid;
    const userid = req.user.id;

    const result = await pool.query(
      `SELECT test_cases.*
       FROM test_cases
       JOIN repositories ON repositories.id = test_cases.repo_id
       WHERE test_cases.user_id = $2
         AND (
           repositories.id::text = $1
           OR repositories.github_id::text = $1
         )`,
      [repoid, userid]
    );

    console.log(result.rows);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching test cases:", error);
    return res.status(500).json({ error: "Failed to fetch test cases" });
  }
};

module.exports = gettestcases; 