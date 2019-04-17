import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const ArtistCard = (props) => {
  let { artistName, artistId, onTourUntil } = props.artist;
  let tourEnd = moment(onTourUntil).format('MMMM Do YYYY');
  return (
    <div className='ArtistCard'>
      <div className='card-inner'>
        <Link to={`/artists/${artistId}`}>
          <h3>{artistName}</h3>
        </Link>
        {onTourUntil ? (
          <h4>On Tour Until: {tourEnd} </h4>
        ) : (
          <h4>Currently not on tour.</h4>
        )}
      </div>
    </div>
  );
};

export default ArtistCard;
