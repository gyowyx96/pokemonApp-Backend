const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const schema = require("./schema");
const basicAuth = require("express-basic-auth");
const db = require("./db");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: ['https://pokemon-finder-v20-i2f7zpu7l-gyowyx96s-projects.vercel.app/score'],
  credentials: true
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

app.use(
  "/graphql",
  authMiddleware,
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = 3306;
app.listen(PORT, () => {
  console.log(`🚀 Server GraphQL attivo su http://localhost:${PORT}/graphql`);
  console.log("📊 Interfaccia GraphiQL disponibile per testare le query");
});
