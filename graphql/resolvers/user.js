const User = require('../../models/user');
const Artist = require('../../models/artist');
const axios = require('axios');

const getArtists = (event) => {
  const artistsArr = event.performance.map((artist) => {
    return { artistId: artist.id, artistName: artist.displayName };
  });
  return artistsArr;
};

const getEvents = (artist) => {
  return axios
    .get(
      `https://api.songkick.com/api/3.0/artists/${artist}/calendar.json?apikey=${
        process.env.SONGKICK_API
      }`
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

const getWatchlist = (watchlistIds) => {
  return Artist.find({
    _id: { $in: watchlistIds },
  }).then((result) => {
    return result.map((artist) => {
      return {
        ...artist._doc,
        events: getEvents.bind(this, artist.artistId),
      };
    });
  });
};

module.exports = {
  user: ({ userId }) =>
    User.findOne({ id: userId }).then((user) => {
      return {
        ...user._doc,
        password: null,
        watchlist: getWatchlist.bind(this, user._doc.watchlist),
      };
    }),
};
