const dotenv = require("dotenv");
const path = require("path");

dotenv.config(
  {
    path : path.resolve(__dirname, "./../../.env")
  }
);

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const fn = async () => {
  const qr = `
    CREATE TABLE users (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      github_id BIGINT UNIQUE,
      username TEXT NOT NULL,
      email TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  try {
    await pool.query(qr);
    console.log("Users table created successfully.");
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    await pool.end();
  }
};

fn();
