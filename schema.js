const {buildSchema} = require('graphql');

const schema = buildSchema(`
    type User{
    id: Int 
    nome: String
    punteggio: Int
    curr_date: String
    }

    type Query{
    classifica: [User]
    }

    type Mutation {

    addUser(
    nome: String!,
    punteggio: Int!,
    curr_date: String!
    ):User

    deleteEntry(id: Int!): Int
    }
    `);

    module.exports = schema