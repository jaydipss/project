const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jaydip123@",
  database: "eshop-db",
  multipleStatements: true,
});
exports.connection = connection;
connection.connect((err) => {
  if (!err) {
    console.log("connect sqldb");
  } else {
    console.log(err);
  }
});
module.exports = connection;
