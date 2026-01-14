const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "ltnya0pnki2ck9w8.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
  user: "o22oiac8jp4a0dw9",
  password: "ko4lh4ad1wlncdwm",
  database: "gigwx6tnzj7haptc",
});
connection.connect((err) => {
  if (err) {
    console.error("❌ Errore MySQL:", err);
  } else {
    console.log("✅ Connesso a MySQL con successo");
  }
});

module.exports = connection;
