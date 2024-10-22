const { initDatabase } = require("../database");

const db = initDatabase();

// CREATE
const createServerEntry = (serverId, callback) => {
  const sql = "INSERT INTO server (serverId) VALUES (?)";
  db.run(sql, [serverId], function (err) {
    callback(err, { id: this.lastID });
  });
};

// READ
const readServerEntry = (callback) => {
  const sql = "SELECT * FROM server";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return callback(err, null);
    } else {
      // rows is an array of command objects
      callback(null, rows);
    }
  });
};

// Nothing to do with this yet
// UPDATE
// const updateServerEntry = (serverId, callback) => {
//   const sql = "UPDATE server SET name = ?, description = ? WHERE id = ?";
//   db.run(sql, [serverId], callback);
// };

// DELETE
const deleteServerEntry = (serverId, callback) => {
  const sql = "DELETE FROM server WHERE id = ?";
  db.run(sql, serverId, callback);
};

module.exports = { createServerEntry, readServerEntry, deleteServerEntry };
