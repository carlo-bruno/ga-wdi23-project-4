const authResolver = require('./auth');
const userResolver = require('./user');

const RootResolver = {
  ...authResolver,
  ...userResolver
};

module.exports = RootResolver;
