CREATE TABLE users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clerk_id TEXT NOT NULL,
  email TEXT NOT NULL,
  github_access_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT users_clerk_id_key UNIQUE (clerk_id)
);
