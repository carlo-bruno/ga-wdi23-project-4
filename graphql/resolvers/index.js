const authResolver = require('./auth');
const userResolver = require('./user');
const artistResolver = require('./artist');
const eventResolver = require('./event');

const RootResolver = {
  ...authResolver,
  ...userResolver,
  ...artistResolver,
  ...eventResolver
};

module.exports = RootResolver;
