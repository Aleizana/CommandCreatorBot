const sqlite3 = require("sqlite3").verbose();
const dbName = "myDatabase.db";

let db;

// Function to initialize the database
const initDatabase = (callback) => {
  if (!db) {
    // Ensure we don't reinitialize if it's already done
    db = new sqlite3.Database(dbName, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Connected to the Database!");
      }
    });

    db.serialize(() => {
      // Create server table
      db.run(
        "CREATE TABLE IF NOT EXISTS server (id INTEGER PRIMARY KEY AUTOINCREMENT, serverId INTEGER NOT NULL UNIQUE)",
        (err) => {
          if (err) {
            console.error("Error creating server table:", err.message);
          } else {
            console.log("Server table created or already exists.");
          }
        }
      );
      // Create roles table
      db.run(
        "CREATE TABLE IF NOT EXISTS role (id INTEGER PRIMARY KEY AUTOINCREMENT, serverId INTEGER NOT NULL, roleId INTEGER NOT NULL UNIQUE, label TEXT NOT NULL)",
        (err) => {
          if (err) {
            console.error("Error creating role table:", err.message);
          } else {
            console.log("Role table created or already exists.");
          }
        }
      );
      // Create commands table
      db.run(
        "CREATE TABLE IF NOT EXISTS commands (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, description TEXT NOT NULL, actionType INTEGER NOT NULL, creatorId TEXT NOT NULL)",
        (err) => {
          if (err) {
            console.error("Error creating commands table:", err.message);
          } else {
            console.log("Commands table created or already exists.");
          }
        }
      );
    });
  }
  if (callback) callback();
  return db; // Return the initialized db
};

const closeDatabase = (callback) => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
      if (callback) callback();
    }
  });
};

module.exports = { initDatabase, closeDatabase };

// ALL OTHER COMMANDS GO HERE
