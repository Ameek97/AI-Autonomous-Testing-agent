const pool = require("../db/connections");

const getdbRepositories = async (req, res) => {
  try {
  
    const userId = req.user.id;

    const result = await pool.query(
    "SELECT * FROM repositories WHERE user_id = $1",
    [userId]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to fetch repository:", error.message);
    return res.status(500).json({
      message: "Failed to fetch repository",
    });
  }
};

module.exports = getdbRepositories;