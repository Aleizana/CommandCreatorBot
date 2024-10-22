const { initDatabase } = require("./database");

const db = initDatabase();

// CREATE
const createCommand = (creatorId, name, description, actionType, callback) => {
  const sql =
    "INSERT INTO commands (name, description, actionType, creatorId) VALUES (?, ?, ?, ?)";
  db.run(sql, [name, description, actionType, creatorId], function (err) {
    callback(err, { id: this.lastID });
  });
};

// READ
const readCommands = (callback) => {
  const sql = "SELECT * FROM commands";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return callback(err, null);
    } else {
      // rows is an array of command objects
      callback(null, rows);
    }
  });
};

// UPDATE
const updateCommand = (id, name, description, callback) => {
  const sql = "UPDATE commands SET name = ?, description = ? WHERE id = ?";
  db.run(sql, [name, description, id], callback);
};

// DELETE
const deleteCommand = (id, callback) => {
  const sql = "DELETE FROM commands WHERE id = ?";
  db.run(sql, id, callback);
};

module.exports = { createCommand, readCommands, updateCommand, deleteCommand };
