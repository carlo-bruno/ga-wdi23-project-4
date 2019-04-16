const authResolver = require('./auth');
const userResolver = require('./user');
const artistResolver = require('./artist');

const RootResolver = {
  ...authResolver,
  ...userResolver,
  ...artistResolver
};

module.exports = RootResolver;
