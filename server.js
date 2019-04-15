const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
});

const db = mongoose.connection;
db.once('open', () => {
  // @ts-ignore
  console.log(`Connected to MongoDB at ${db.host}:${db.port}`);
});
db.on('error', (err) => {
  console.log(`Database error: ${err}`);
});

//

app.listen(port, () => {
  console.log(`🔥Listening on port ${port}...`);
});
