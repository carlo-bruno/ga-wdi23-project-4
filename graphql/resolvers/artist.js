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
  return artistsArr;
};

const getEvents = (artist) => {
  return axios
    .get(
      `https://api.songkick.com/api/3.0/artists/${
        artist.id
      }/calendar.json?apikey=${process.env.SONGKICK_API}`
    )
    .then((data) => {
      return data.data.resultsPage.results.event;
    })
    .then((events) => {
      if (events) {
        let eventsArr = events.map((event) => {
          let idx = event.displayName.indexOf(' at ');
          return {
            eventId: event.id,
            eventName: event.displayName.slice(0, idx),
            type: event.type,
            date: event.start.datetime || event.start.date,
            venue: event.venue.displayName,
            metroArea: event.venue.metroArea.displayName,
            lat: event.location.lat,
            lng: event.location.lng,
            performance: getArtists.bind(this, event),
          };
        });
        return eventsArr;
      }
      return [];
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
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    let saveId = req.body.variables.artistId;
    return axios
      .get(
        `https://api.songkick.com/api/3.0/search/artists.json?apikey=${
          process.env.SONGKICK_API
        }&query=${req.body.variables.artistName}`
      )
      .then((data) => {
        return data.data.resultsPage.results.artist;
      })
      .then((artists) => {
        let saveArtist = artists.find((artist) => {
          return artist.id === saveId;
        });
        return saveArtist;
      })
      .then((saveArtist) => {
        return User.findById(req.userId).then((user) => {
          return Artist.findOne({ artistId: saveId }).then(
            (found) => {
              let artistToWatch;
              if (found) {
                artistToWatch = found;
              } else {
                artistToWatch = new Artist({
                  artistId: saveArtist.id,
                  artistName: saveArtist.displayName,
                  onTourUntil: saveArtist.onTourUntil,
                  events: getEvents.bind(this, saveArtist),
                });
                artistToWatch.save();
              }
              user.watchlist.push(artistToWatch);
              user.save();
              return true;
            }
          );
        });
      });
  },
  unwatchArtist: (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    User.findById(req.userId)
      .populate('watchlist')
      .exec((err, user) => {
        user.watchlist.pull(args.id);
        user.save();
      });
    return true;
  },
};
