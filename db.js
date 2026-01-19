const mysql = require("mysql2");


const pool = mysql.createPool({
  connectionLimit: 10,
  host: "ltnya0pnki2ck9w8.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
  user: "o22oiac8jp4a0dw9",
  password: "ko4lh4ad1wlncdwm",
  database: "gigwx6tnzj7haptc",
  waitForConnections: true,
  queueLimit: 0,
});

// Test opzionale (una sola volta)
pool.getConnection((err, conn) => {
  if (err) {
    console.error("❌ Errore MySQL:", err);
  } else {
    console.log("✅ Pool MySQL pronto");
    conn.release();
  }
});

module.exports = pool;

