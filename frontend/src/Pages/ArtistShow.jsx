import React, { Component } from 'react';

class ArtistShow extends Component {
  render() {
    console.log(this.props.match.params);

    // query backend for event
    return (
      <div className='ArtistShow'>
        <header>
          <span onClick={() => this.props.history.goBack()}>
            &larr;
          </span>
        </header>
        <h2>HEEEEEYYYYoooo ARTIST</h2>
      </div>
    );
  }
}

export default ArtistShow;
