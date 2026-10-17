const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "./../../.env"),
});

const pool = require("../connections");

const createTestResultsTable = `
  CREATE TABLE IF NOT EXISTS test_results (
    id SERIAL PRIMARY KEY,
    test_case_id INTEGER NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    status VARCHAR(100) NOT NULL,
    logs JSONB DEFAULT '[]'::jsonb,
    error_message TEXT,
    executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;

const createTestResultsIndex = `
  CREATE INDEX IF NOT EXISTS idx_test_results_test_case
  ON test_results (test_case_id);
`;

async function main() {
  try {
    await pool.query(createTestResultsTable);
    await pool.query(createTestResultsIndex);
    console.log("test_results table and index created successfully.");
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
