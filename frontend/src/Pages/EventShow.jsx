import React from 'react';
import moment from 'moment';
import MiniCard from '../Components/MiniCard';
import { Redirect } from 'react-router-dom';

const EventShow = (props) => {
  let content = <Redirect to='/events' />;
  let showEvent = null;
  if (props.events.length) {
    showEvent = props.events.find((event) => {
      return event.eventId === parseInt(props.match.params.eventId);
    });

    let { eventName, type, date, venue, performance } = showEvent;

    let day = moment(date).format('dddd, MMMM D, YYYY');
    let fromNow = moment(date).fromNow();
    let time = moment(date).format('h:mm A');

    let cards = performance.map((artist, i) => {
      return (
        <MiniCard key={i}>
          <h3>{artist.artistName}</h3>
        </MiniCard>
      );
    });

    content = (
      <section>
        <div className='title-box'>
          <h2>{eventName}</h2>
        </div>

        <div className='date-box'>
          <div>
            <p>{day}</p>
            <p>{fromNow}</p>
            <p>Time: {time}</p>
          </div>
        </div>

        <div className='location-box'>
          <div>
            <p>{venue}</p>
            <p>{type}</p>
          </div>
        </div>

        <div className='performance-box'>
          <h3>Performances by:</h3>
          <div className='card-collection'>{cards}</div>
        </div>
      </section>
    );
  }

  return (
    <div className='EventShow'>
      <header>
        <span onClick={() => props.history.goBack()}>&larr;</span>
      </header>
      {content}
    </div>
  );
};

export default EventShow;
