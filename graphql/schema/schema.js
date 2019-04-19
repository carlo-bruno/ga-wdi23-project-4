const { buildSchema } = require('graphql');

//? Artist.billing not sure yet

module.exports = buildSchema(`
type Event {
  eventId: Int
  eventName: String
  type: String
  date: String
  venue: String
  metroArea: String
  lat: Float
  lng: Float
  performance: [Artist]
}

  type Artist {
    _id: ID
    artistId: Int
    artistName: String
    onTourUntil: String
    events: [Event]
  }

  type User {
    _id: ID!
    email: String!
    username: String
    password: String
    watchlist: [Artist]
  }

  type AuthData {
    userId: ID!
    username: String!
    token: String!
    tokenExpiration: Int!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  type RootQuery {
    user(id: ID): User
    login(email: String!, password: String!): AuthData
    searchArtist(search: String): [Artist]
    metroEvents(metro: String): [Event]
  }

  type RootMutation {
    createUser(userInput: UserInput): AuthData
    watchArtist(artistId: Int, artistName: String): Boolean
    unwatchArtist(id: ID): Boolean
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }

`);
