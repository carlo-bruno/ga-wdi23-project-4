const axios = require('axios');
require('dotenv').config();

// https://api.songkick.com/api/3.0/search/locations.json?query={search_query}&apikey={your_api_key}
// https://api.songkick.com/api/3.0/metro_areas/{metro_area_id}/calendar.json?apikey={your_api_key}
const getArtists = (event) => {
  const artistsArr = event.performance.map((artist) => {
    return { artistId: artist.id, artistName: artist.displayName };
  });
  return artistsArr;
};

module.exports = {
  metroEvents: (args) => {
    return axios
      .get(
        `https://api.songkick.com/api/3.0/search/locations.json?apikey=${
          process.env.SONGKICK_API
        }&query=${args.metro}`
      )
      .then((data) => {
        return data.data.resultsPage.results.location[0].metroArea.id;
      })
      .then((metroId) => {
        return axios
          .get(
            `https://api.songkick.com/api/3.0/metro_areas/${metroId}/calendar.json?apikey=${
              process.env.SONGKICK_API
            }`
          )
          .then((data) => {
            return data.data.resultsPage.results.event;
          })
          .then((events) => {
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
          });
      });
  },
};
