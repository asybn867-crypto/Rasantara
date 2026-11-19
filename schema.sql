PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,password_salt TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'user',created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,token_hash TEXT NOT NULL UNIQUE,expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS complaints(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),subject TEXT NOT NULL,message TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'baru',created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS complaints_created ON complaints(created_at DESC);
CREATE TABLE IF NOT EXISTS comments(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),message TEXT NOT NULL,created_at INTEGER NOT NULL,is_hidden INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS comments_created ON comments(created_at DESC);

CREATE TABLE IF NOT EXISTS login_history(id TEXT PRIMARY KEY,email TEXT NOT NULL,success INTEGER NOT NULL,created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS login_history_created ON login_history(created_at DESC);

CREATE TABLE IF NOT EXISTS recipe_reviews(
 id TEXT PRIMARY KEY,
 recipe_id TEXT NOT NULL,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
 comment TEXT NOT NULL,
 created_at INTEGER NOT NULL,
 UNIQUE(recipe_id,user_id)
);
CREATE INDEX IF NOT EXISTS recipe_reviews_recipe_created ON recipe_reviews(recipe_id,created_at DESC);
