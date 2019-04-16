const { buildSchema } = require('graphql');

//? Artist.billing not sure yet

module.exports = buildSchema(`
  type Artist {
    _id: ID
    artistId: Int
    artistName: String
  }

  type User {
    _id: ID!
    email: String!
    password: String
    watchlist: [Artist]
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type RootQuery {
    users: [User]
    user(id: ID): User
    login(email: String!, password: String!): AuthData
    searchArtist(search: String): [Artist]
  }

  type RootMutation {
    createUser(userInput: UserInput): User
    watchArtist(artistId: Int, artistName: String): Artist
    unwatchArtist(id: ID): Artist
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }

`);
