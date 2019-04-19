import React from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

import MiniCard from '../Components/MiniCard';
import { ReactComponent as Back } from '../images/chevron-left-solid.svg';
import { ReactComponent as Heart } from '../images/heart-solid.svg';
import { ReactComponent as HeartBreak } from '../images/heart-broken-solid.svg';

const ArtistShow = (props) => {
  let content = <Redirect to='/artists' />;
  let isSaved = false;
  let showArtist = null;
  if (props.artists.length || props.saved.length) {
    showArtist =
      props.saved.find((artist) => {
        isSaved = true;
        return (
          artist.artistId === parseInt(props.match.params.artistId)
        );
      }) ||
      props.artists.find((artist) => {
        isSaved = false;
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
  console.log('isSaved', isSaved);
  console.log(showArtist);

  let heart;
  if (!isSaved) {
    heart = (
      <button
        onClick={() =>
          props.watchArtist(
            showArtist.artistId,
            showArtist.artistName
          )
        }
        style={
          !props.userId
            ? { pointerEvents: 'none', color: '#ccc' }
            : { color: '#5f3193' }
        }>
        <Heart />
      </button>
    );
  } else {
    heart = (
      <button
        onClick={() => {
          props.unwatchArtist(showArtist._id);
          props.history.goBack();
        }}
        style={
          !props.userId
            ? { pointerEvents: 'none', color: '#ccc' }
            : { color: '#5f3193' }
        }>
        <HeartBreak />
      </button>
    );
  }

  return (
    <div className='ArtistShow'>
      <header>
        <span
          onClick={() => props.history.goBack()}
          className='back-btn'>
          <Back />
        </span>
        {heart}
      </header>
      {content}
    </div>
  );
};

export default ArtistShow;
