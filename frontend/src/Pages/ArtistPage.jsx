import React, { Component } from 'react';
import ArtistCard from '../Components/ArtistCard';
import LoadArtist from '../Components/LoadArtists';

class ArtistPage extends Component {
  constructor(props) {
    super(props);
    this.queryArtist = React.createRef();
    this.state = {
      filter: 'all',
    };
  }

  changeFilter = (filter) => {
    this.setState({ filter });
  };

  render() {
    let display =
      this.state.filter === 'all'
        ? this.props.artists
        : this.props.saved;
    let cards = display.map((artist, i) => {
      return <ArtistCard key={i} artist={artist} />;
    });
    return (
      <div className='ArtistPage'>
        <header>
          <input
            type='text'
            name='queryMetro'
            id='queryMetro'
            ref={this.queryArtist}
            placeholder='Search for Artist'
          />
          <button
            onClick={() =>
              this.props.handleQueryArtist(
                this.queryArtist.current.value
              )
            }>
            Artist
          </button>
        </header>

        <div className='artists-filters'>
          <div
            className={`filter ${
              this.state.filter === 'all' ? 'active' : ''
            }`}
            onClick={() => this.changeFilter('all')}>
            ALL{' '}
            <span className='artists-count'>
              {this.props.artists.length}
            </span>{' '}
          </div>
          <div
            className={`filter ${
              this.state.filter === 'saved' ? 'active' : ''
            }`}
            onClick={() => this.changeFilter('saved')}
            style={
              !this.props.userId
                ? { pointerEvents: 'none', color: '#cccc' }
                : {}
            }>
            SAVED{' '}
            <span className='artists-count'>
              {this.props.saved.length}
            </span>
          </div>
        </div>

        <section className='artists-collection'>
          {!cards.length && <LoadArtist />}
          {cards}
        </section>
      </div>
    );
  }
}

export default ArtistPage;
