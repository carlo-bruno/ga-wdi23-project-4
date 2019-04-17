import React, { Component } from 'react';

class EventShow extends Component {
  render() {
    console.log(this.props.match.params);

    // query backend for event
    return (
      <div className='EventShow'>
        <header>
          <span onClick={() => this.props.history.goBack()}>
            &larr;
          </span>
        </header>
        <h2>HEEEEEYYYYoooo</h2>
      </div>
    );
  }
}

export default EventShow;
