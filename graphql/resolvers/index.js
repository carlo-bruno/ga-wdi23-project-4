const authResolver = require('./auth');

const RootResolver = {
  ...authResolver
};

module.exports = RootResolver;
