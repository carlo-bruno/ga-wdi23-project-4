import React, { Component } from 'react';
import ArtistCard from '../Components/ArtistCard';

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
    let cards = this.props.artists.map((artist, i) => {
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
            onClick={() => this.changeFilter('saved')}>
            SAVED{' '}
            <span className='artists-count'>
              {/* {this.state.saved.length} */}
            </span>
          </div>
        </div>

        <section className='artists-collection'>{cards}</section>
      </div>
    );
  }
}

export default ArtistPage;
