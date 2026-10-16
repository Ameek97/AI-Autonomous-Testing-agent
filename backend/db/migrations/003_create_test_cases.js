const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "./../../.env"),
});

const pool = require("../connections");

const createTestCasesTable = `
  CREATE TABLE IF NOT EXISTS test_cases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    repo_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    repo_name VARCHAR(255) NOT NULL,
    repo_owner VARCHAR(255) NOT NULL,
    branch VARCHAR(100) DEFAULT 'main',
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    target_route VARCHAR(500),
    target_files JSONB DEFAULT '[]'::jsonb,
    expected_result TEXT,
    browserbase_script TEXT,
    status VARCHAR(100) DEFAULT 'generated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createTestCasesIndex = `
  CREATE INDEX IF NOT EXISTS idx_test_cases_repo_user
  ON test_cases (repo_id, user_id);
`;

async function main() {
  try {
    await pool.query(createTestCasesTable);
    await pool.query(createTestCasesIndex);
    console.log("test_cases table and index created successfully.");
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
