const pool = require("../db/connections");

// No authentication middleware, session, or user lookup is implemented.
// The request body is not a source for the user id.
const getAuthenticatedUserId = () => null;

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim() !== "";

const parseRepository = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: { message: "Invalid repository", fields: ["body"] } };
  }

  const fields = [];

  let githubId = body.id;
  if (typeof githubId === "string" && /^[0-9]+$/.test(githubId)) {
    githubId = Number(githubId);
  }
  if (!Number.isSafeInteger(githubId) || githubId <= 0) {
    fields.push("id");
  }

  const name = isNonEmptyString(body.name) ? body.name.trim() : "";
  if (!name) fields.push("name");

  const fullName = isNonEmptyString(body.full_name) ? body.full_name.trim() : "";
  if (!fullName) fields.push("full_name");

  if (typeof body.private !== "boolean") fields.push("private");

  const htmlUrl = isNonEmptyString(body.html_url) ? body.html_url.trim() : "";
  if (!htmlUrl) fields.push("html_url");

  let description = null;
  if (body.description != null) {
    if (typeof body.description !== "string") fields.push("description");
    else description = body.description;
  }

  let language = null;
  if (body.language != null) {
    if (typeof body.language !== "string") fields.push("language");
    else language = body.language;
  }

  let updatedAt = null;
  if (body.updated_at == null || body.updated_at === "") {
    fields.push("updated_at");
  } else {
    const parsed = new Date(body.updated_at);
    if (Number.isNaN(parsed.getTime())) fields.push("updated_at");
    else updatedAt = parsed.toISOString();
  }

  const defaultBranch = isNonEmptyString(body.default_branch)
    ? body.default_branch.trim()
    : "";
  if (!defaultBranch) fields.push("default_branch");

  if (fields.length > 0) {
    return { error: { message: "Invalid repository", fields } };
  }

  return {
    value: {
      githubId,
      name,
      fullName,
      private: body.private,
      htmlUrl,
      description,
      updatedAt,
      language,
      defaultBranch,
    },
  };
};

const saveRepository = async (req, res) => {
  const repository = parseRepository(req.body);
  if (repository.error) {
    return res.status(400).json(repository.error);
  }

  const userId = getAuthenticatedUserId(req);
  if (userId == null) {
    return res.status(401).json({
      message: "Authenticated user is required",
    });
  }

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
        repository.value.githubId,
        repository.value.name,
        repository.value.fullName,
        repository.value.private,
        repository.value.htmlUrl,
        repository.value.description,
        repository.value.updatedAt,
        repository.value.language,
        repository.value.defaultBranch,
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
