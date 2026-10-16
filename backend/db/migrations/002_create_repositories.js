const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path : path.resolve(__dirname,"./../../.env")
})

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,});

const fn = async () => {
  
   const qr = `
      CREATE TABLE repositories (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        github_id BIGINT NOT NULL,
        name TEXT NOT NULL,
        full_name TEXT NOT NULL,
        private BOOLEAN NOT NULL,
        html_url TEXT NOT NULL,
        description TEXT,
        updated_at TIMESTAMPTZ NOT NULL,
        language TEXT,
        default_branch TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        CONSTRAINT repositories_user_id_github_id_key
          UNIQUE (user_id, github_id),
        CONSTRAINT repositories_user_id_fkey
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `;
  
  try {
   
    await pool.query(qr);  // pg library handles the db reponse amd determines if it were an err
    console.log("Repositories table created successfully.");

  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    await pool.end();
  }
};

fn();