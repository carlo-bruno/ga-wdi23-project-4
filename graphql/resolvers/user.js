const User = require('../../models/user');
const Artist = require('../../models/artist');

const getWatchlist = (watchlistIds) => {
  return Artist.find({
    _id: { $in: watchlistIds }
  }).then((result) => {
    return result.map((artist) => {
      return { ...artist._doc };
    });
  });
};

// to test, find all users
// to test, find one user, remove password on query
module.exports = {
  users: User.find()
    .then((users) => {
      return users.map((user) => {
        return {
          ...user._doc,
          password: null,
          watchlist: getWatchlist.bind(this, user._doc.watchlist)
        };
      });
    })
    .then((users) => {
      return users;
    }),
  user: ({ userId }) =>
    User.findOne({ id: userId }).then((user) => {
      return {
        ...user._doc,
        password: null,
        watchlist: getWatchlist.bind(this, user._doc.watchlist)
      };
    })
};
