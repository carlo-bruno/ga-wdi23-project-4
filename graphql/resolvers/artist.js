// resolver to query Songkick api.
// will accept a search query
// then will display array of artists
// we can then save certain artist, watchArtist
// unwatchArtist
const axios = require('axios');
require('dotenv').config();

const User = require('../../models/user');
const Artist = require('../../models/artist');

module.exports = {
  searchArtist: (args) => {
    return axios
      .get(
        `https://api.songkick.com/api/3.0/search/artists.json?apikey=${
          process.env.SONGKICK_API
        }&query=${args.search}`
      )
      .then((data) => {
        return data.data.resultsPage.results.artist;
      })
      .then((artists) => {
        console.log('before map', artists);
        let arr = artists.map((artist) => {
          return {
            artistId: artist.id,
            artistName: artist.displayName
          };
        });
        console.log(arr);
        return arr;
      });
  },
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
