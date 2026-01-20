import sqlite3 from "sqlite3";

const db = new sqlite3.Database("movies.db", (err) => {
  if (err) console.error("DB connection failed:", err.message);
  else console.log("SQLite DB connected");
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_input TEXT NOT NULL,
      recommended_movies TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;
