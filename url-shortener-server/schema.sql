CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL CHECK (LENGTH(original_url) <= 2048),
  short_code VARCHAR(16) UNIQUE NOT NULL,
  secret_code UUID UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stats (
  id SERIAL PRIMARY KEY,
  secret_code UUID NOT NULL REFERENCES urls(secret_code) ON DELETE CASCADE,
  ip_address VARCHAR(45) NOT NULL,
  visit_date DATE NOT NULL,
  visit_count INTEGER NOT NULL DEFAULT 1,
  UNIQUE (secret_code, ip_address, visit_date)
);