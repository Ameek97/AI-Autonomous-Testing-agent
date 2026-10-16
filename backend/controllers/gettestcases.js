const pool = require("../db/connections");

const gettestcases = async (req, res) => {
  try {
    const repoid = req.params.repoid;
    const userid = 1;

    const result = await pool.query(
      `SELECT * FROM test_cases
       WHERE repo_id = $1 AND user_id = $2`,
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