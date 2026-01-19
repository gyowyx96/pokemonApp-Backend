const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const schema = require("./schema");
const basicAuth = require("express-basic-auth");
const db = require("./db");
require("dotenv").config();
const allowed = [
  'http://localhost:4200',
  'https://progetto-finale-pokemon-finder-angu-ten.vercel.app',
  'https://pokemon-finder-angu-ten.vercel.app'

];
const app = express();
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const ok = allowed.some(a => a instanceof RegExp ? a.test(origin) : a === origin);
    cb(null, ok);
  },
  credentials: true,
}));

const authMiddleware = basicAuth({
  users: {
    [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASS,
  },
  challenge: true,
});

const root = {
  //QUERY
  classifica: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM classifica", (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },

  //MUTATION
  addUser: ({ nome, punteggio, curr_date }) => {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO classifica(nome, punteggio, curr_date) VALUES (?, ?, ?)";
      db.query(sql, [nome, punteggio, curr_date], (err, results) => {
        if (err) reject(err);
        resolve({
          id: results.insertId,
          nome,
          punteggio,
          curr_date,
        });
      });
    });
  },

  deleteEntry: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM classifica WHERE id = ?", [id], (err, result) => {
        if (err) reject(err);

        if (result.affectedRows === 0) {
          return reject(new Error("Elemento non trovato"));
        }
        resolve(id);
      });
    });
  },
};

// --- Endpoint GraphQL ---
app.use(
  "/graphql",
  authMiddleware,
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

// --- Root friendly message ---
app.get("/", (req, res) => {
  res.send("🚀 Server GraphQL attivo! Vai su /graphql per usare GraphiQL.");
});

// --- Avvio server solo dopo connessione DB ---
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server GraphQL avviato correttamente");
  console.log(`📡 Porta: ${PORT}`);
  console.log("📊 GraphiQL disponibile su /graphql");
});