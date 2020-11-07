-- DROP DATABASE IF EXISTS sample_users_db;
-- CREATE DATABASE sample_users_db;

-- \c sample_users_db;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL UNIQUE,
  password_digest VARCHAR NOT NULL
);
