import React from 'react';
import moment from 'moment';
import MiniCard from '../Components/MiniCard';
import { Redirect } from 'react-router-dom';

const ArtistShow = (props) => {
  let content = <Redirect to='/artists' />;
  let showArtist = null;
  if (props.artists.length) {
    showArtist = props.artists.find((artist) => {
      return (
        artist.artistId === parseInt(props.match.params.artistId)
      );
    });

    let { artistName, onTourUntil, events } = showArtist;

    let tourEnd = moment(onTourUntil).format('MMMM Do YYYY');

    let cards = events.map((event, i) => {
      let day = moment(event.date).format('MMM D, YYYY');
      return (
        <MiniCard key={i}>
          <div className='artist'>
            <h3>{event.eventName}</h3>
            <h4>
              {event.metroArea} &ndash; {day}
            </h4>
          </div>
        </MiniCard>
      );
    });

    content = (
      <section>
        <div className='title-box'>
          <h2>{artistName}</h2>
          {onTourUntil ? (
            <h4>On Tour Until: {tourEnd} </h4>
          ) : (
            <h4>Currently not on tour.</h4>
          )}
        </div>

        <div className='events-box'>
          <h3>Upcoming events:</h3>
          <div className='card-collection'>{cards}</div>
        </div>
      </section>
    );
  }

  return (
    <div className='ArtistShow'>
      <header>
        <span onClick={() => props.history.goBack()}>&larr;</span>
        <button
          onClick={() =>
            props.watchArtist(props.match.params.artistId)
          }>
          SAVE
        </button>
      </header>
      {content}
    </div>
  );
};

export default ArtistShow;
