const pool = require("../db/connections");

// No authentication middleware, session, or user lookup is implemented.
// The request body is not a source for the user id.
const getAuthenticatedUserId = () => null;





const saveRepository = async (req, res) => {
  const userId = getAuthenticatedUserId(req);

  if (userId == null) {
    return res.status(401).json({
      message: "Authenticated user is required",
    });
  }

  const repository = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO repositories (
         github_id, name, full_name, private, html_url,
         description, updated_at, language, default_branch, user_id
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (user_id, github_id) DO UPDATE SET
         name = EXCLUDED.name,
         full_name = EXCLUDED.full_name,
         private = EXCLUDED.private,
         html_url = EXCLUDED.html_url,
         description = EXCLUDED.description,
         updated_at = EXCLUDED.updated_at,
         language = EXCLUDED.language,
         default_branch = EXCLUDED.default_branch
       RETURNING id, github_id, name, full_name, private, html_url,
                 description, updated_at, language, default_branch, user_id,
                 (xmax = 0) AS inserted`,
      [
        repository.id,
        repository.name,
        repository.full_name,
        repository.private,
        repository.html_url,
        repository.description,
        repository.updated_at,
        repository.language,
        repository.default_branch,
        userId,
      ]
    );

    const row = result.rows[0];
    const created = row.inserted === true;
    delete row.inserted;

    return res.status(created ? 201 : 200).json(row);
  } catch (error) {
    console.error(error.message);

    if (error.code === "23503") {
      return res.status(400).json({
        message: "User not found",
      });
    }

    return res.status(500).json({
      message: "Failed to save repository",
    });
  }
};

module.exports = saveRepository;
