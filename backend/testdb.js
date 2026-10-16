require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    const result = await pool.query("SELECT current_database(), NOW()");
    console.log("Database connected:", result.rows[0]);
  } catch (err) {
    console.error("Database connection failed:", err.message);
  } finally {
    await pool.end();
  }
}

testConnection();