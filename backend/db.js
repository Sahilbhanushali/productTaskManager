const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "productmanagercrud",
});

connection.connect((err) => {
  if (err) {
    console.error(" DB Connection Failed:", err);
  } else {
    console.log(" Connected to MySQL DB");
  }
});

module.exports = connection;
