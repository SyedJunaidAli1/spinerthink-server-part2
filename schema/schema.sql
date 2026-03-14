CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT
);

CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  file_path TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  file_id INTEGER,
  status TEXT,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  job_id INTEGER,
  word_count INTEGER,
  paragraph_count INTEGER,
  keywords TEXT[]
);
