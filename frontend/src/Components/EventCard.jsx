import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const EventCard = (props) => {
  let { eventName, venue, date, eventId } = props.event;
  let month = moment(date)
    .format('MMM')
    .toUpperCase();
  let day = moment(date).format('DD');
  let time = moment(date).format('h:mm A');

  return (
    <div className='EventCard'>
      <div className='card-inner'>
        <div className='date-box'>
          <p>{month}</p>
          <p>{day}</p>
        </div>
        <div className='info-box'>
          <Link to={`/events/${eventId}`}>
            <h4>{eventName}</h4>
          </Link>
          <p>
            <span>{time}</span> &bull; <span>{venue}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
