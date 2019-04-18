import React, { Component } from 'react';
import ArtistCard from '../Components/ArtistCard';

class ArtistPage extends Component {
  constructor(props) {
    super(props);
    this.queryArtist = React.createRef();
    this.state = {
      filter: 'all',
      artists: [],
    };
  }

  changeFilter = (filter) => {
    this.setState({ filter });
  };

  handleQueryArtist = () => {
    const search = this.queryArtist.current.value;

    let requestBody = {
      query: `
        query SearchArtist($search: String) {
          searchArtist(search: $search) {
            artistId
            artistName
            onTourUntil
          }
        }
      
      `,
      variables: {
        search: search,
      },
    };

    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({ artists: resData.data.searchArtist });
      });
  };

  render() {
    let cards = this.state.artists.map((artist, i) => {
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
          <button onClick={this.handleQueryArtist}>Artist</button>
        </header>

        <div className='artists-filters'>
          <div
            className={`filter ${
              this.state.filter === 'all' ? 'active' : ''
            }`}
            onClick={() => this.changeFilter('all')}>
            ALL{' '}
            <span className='artists-count'>
              {this.state.artists.length}
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
