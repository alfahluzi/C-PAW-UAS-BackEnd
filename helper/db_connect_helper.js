const mysql = require("mysql");
var pool = mysql.createPool({
  host: "baj1ixzy01yq8ipybmtd-mysql.services.clever-cloud.com",
  user: "um5ziela2njct0vz",
  password: "iE7rRoqP8Ogo6vd3N6om",
  database: "baj1ixzy01yq8ipybmtd",
});

function db_disconnect() {
  pool.getConnection((err, conn) => {
    if (conn.release()) return true;
    return false;
  });
}

function db_testConnection(callback) {
  return pool.getConnection((err, conn) => {
    res = { status: "unknow" };
    if (err) res = { error: err };
    res = { status: "connected" };
    callback(res);
  });
}

/**
 * @function db_query - Function to access database and using query
 * @param {string} query - Put your query here
 * @param {function} callback function to get callback (err, rows) => {}
 */
function db_query(query, callback) {
  executeQuery(query, (err, rows) => {
    if (!err) {
      callback(null, rows);
    } else {
      callback(err, null);
    }
  });
}

function executeQuery(query, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      return callback("Get Connection Error. Error:" + err, null);
    } else if (connection) {
      connection.query(query, (err, rows, fields) => {
        connection.release();
        if (err) {
          return callback("Err. " + err, null);
        }
        return callback(null, rows);
      });
    } else {
      return callback(true, "No Connection");
    }
  });
}
module.exports = { pool, db_disconnect, db_query, db_testConnection };
