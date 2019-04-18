// resolver to query Songkick api.
// will accept a search query
// then will display array of artists
// we can then save certain artist, watchArtist
// unwatchArtist
const axios = require('axios');
require('dotenv').config();

const User = require('../../models/user');
const Artist = require('../../models/artist');

const getArtists = (event) => {
  const artistsArr = event.performance.map((artist) => {
    return { artistId: artist.id, artistName: artist.displayName };
  });
  // console.log(artistsArr);
  return artistsArr;
};

const getEvents = (artist) => {
  // https://api.songkick.com/api/3.0/artists/{artist_id}/calendar.json?apikey={your_api_key}
  return axios
    .get(
      `https://api.songkick.com/api/3.0/artists/${
        artist.id
      }/calendar.json?apikey=${process.env.SONGKICK_API}
  `
    )
    .then((data) => {
      // console.log('EYYYY', data.data.resultsPage.results.event);
      return data.data.resultsPage.results.event;
    })
    .then((events) => {
      let eventsArr = events.map((event) => {
        return {
          eventId: event.id,
          eventName: event.displayName,
          type: event.type,
          date: event.start.datetime || event.start.date,
          venue: event.venue.displayName,
          lat: event.location.lat,
          lng: event.location.lng,
          performance: getArtists.bind(this, event),
        };
      });
      return eventsArr;
    });
};

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
        let arr = artists.map((artist) => {
          // console.log(artist);
          return {
            artistId: artist.id,
            artistName: artist.displayName,
            onTourUntil: artist.onTourUntil,
            events: getEvents.bind(this, artist),
          };
        });
        return arr;
      });
  },
  watchArtist: (args, req) => {
    //! use req.userId when ready to use auth
    // if (!req.isAuth) {
    //   throw new Error('Unauthenticated!');
    // }
    // fix duplicate push on subdoc
    return User.findById('5cb60661dc54c006e1e8234a').then((user) => {
      return Artist.findOne({ artistId: args.artistId }).then(
        (found) => {
          let artistToWatch;
          if (found) {
            artistToWatch = found;
          } else {
            artistToWatch = new Artist({
              artistId: args.artistId,
              artistName: args.artistName,
            });
          }
          artistToWatch.save();
          if (user.watchlist.includes(artistToWatch.id)) {
            console.log('already Watching');
          }
          user.watchlist.push(artistToWatch);
          user.save();
          return artistToWatch;
        }
      );
    });
  },
  unwatchArtist: (args, req) => {
    // again, use req.userId
    User.findById('5cb60661dc54c006e1e8234a')
      .populate('watchlist')
      .exec((err, user) => {
        console.log('before', user);
        user.watchlist.pull(args.id);
        console.log('after', user);
        user.save();
      });
  },
};
