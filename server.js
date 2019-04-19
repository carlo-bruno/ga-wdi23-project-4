const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 3001;

const isAuth = require('./middleware/is-auth');
const graphQLSchema = require('./graphql/schema/schema');
const graphQLResolvers = require('./graphql/resolvers/index');
// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + '/frontend/build'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

// Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  // @ts-ignore
  console.log(`✳️  Connected to MongoDB at ${db.host}:${db.port}`);
});
db.on('error', (err) => {
  console.log(`Database error: ${err}`);
});

// app.get('/', (req, res) => {
//   res.send('Working 🔥');
// });

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: false, //
  })
);

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/frontend/build/index.html');
});

app.listen(port, () => {
  console.log(`🔥 Listening on port ${port}...`);
});
