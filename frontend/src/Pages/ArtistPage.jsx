import React, { Component } from 'react';

class ArtistPage extends Component {
  constructor(props) {
    super(props);
    this.queryArtist = React.createRef();
    this.state = {
      filter: 'all',
      artists: [],
    };
  }

  handleQueryArtist = () => {
    const search = this.queryArtist.current.value;
    console.log(search);

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
        console.log(resData.data);
        this.setState({ artists: resData.data.searchArtist });
      });
  };

  render() {
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
          <button onClick={this.handleQueryArtist}>Search</button>
        </header>
        {/*
        // 
        
        // 
        */}
      </div>
    );
  }
}

export default ArtistPage;
