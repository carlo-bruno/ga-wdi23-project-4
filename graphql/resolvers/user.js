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
      console.log(users);
      return users;
    }),
  user: (args) =>
    User.findOne({ id: args.userId }).then((user) => {
      return {
        ...user._doc,
        password: null,
        watchlist: getWatchlist.bind(this, user._doc.watchlist)
      };
    }),
  watchArtist: (args, req) => {
    //! use req.userId when ready to use auth
    // if (!req.isAuth) {
    //   throw new Error('Unauthenticated!');
    // }
    User.findById('5cb4c844787e27dc8f170775').then((user) => {
      let artistToWatch = new Artist({
        artistId: args.artistId,
        artistName: args.artistName
      });
      artistToWatch.save();
      user.watchlist.push(artistToWatch);
      user.save();
    });
  }
};
