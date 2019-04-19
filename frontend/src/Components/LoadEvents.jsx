import React from 'react';
import { ReactComponent as Ticket } from '../images/ticket.svg';

const Loading = (props) => {
  return (
    <div className='LoadEvents'>
      <div className='inner'>
        <Ticket />
      </div>
    </div>
  );
};

export default Loading;
