const pool = require("../db/connections");

const updateRepository = async (req, res) => {
  const repositoryId = req.params.repositoryId;
  const { target_domain, global_instruction } = req.body;

  if (target_domain == null || String(target_domain).trim() === "") {
    return res.status(400).json({
      message: "Target domain is required",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE repositories
       SET target_domain = $1,
           global_instruction = $2
       WHERE id = $3
       RETURNING id, target_domain, global_instruction`,
      [target_domain, global_instruction ?? null, repositoryId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      message: "Failed to update repository",
    });
  }
};

module.exports = updateRepository;
