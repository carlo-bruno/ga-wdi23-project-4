import React from 'react';
import { ReactComponent as Guitar } from '../images/guitar.svg';

const Loading = (props) => {
  return (
    <div className='LoadArtists'>
      <div className='inner'>
        <Guitar />
      </div>
    </div>
  );
};

export default Loading;
