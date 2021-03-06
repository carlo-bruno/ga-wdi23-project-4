import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import AuthContext from './context/auth-context';

import Header from './Components/Header';
import MenuBar from './Components/MenuBar';
import LandingPage from './Pages/LandingPage';
import EventsPage from './Pages/EventPage';
import EventShow from './Pages/EventShow';
import ArtistPage from './Pages/ArtistPage';
import ProfilePage from './Pages/ProfilePage';
import ArtistShow from './Pages/ArtistShow';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      userId: null,
      username: null,
      events: [],
      artists: [],
      savedArtist: [],
    };
  }

  login = (token, userId, username, tokenExpiration) => {
    this.setState({ token, userId, username }, () => {
      this.getSavedArtist();
    });
  };

  logout = () => {
    this.setState({
      token: null,
      userId: null,
      savedArtist: [],
    });
  };

  handleQueryMetro = (query) => {
    if (!query) return;

    let requestBody = {
      query: `
        query MetroEvents($metro: String) {
          metroEvents(metro: $metro) {
            eventId
            eventName
            type
            date
            venue
            metroArea
            lat
            lng
            performance {
              _id
              artistId
              artistName
              onTourUntil
            }
          }
        }
      `,
      variables: {
        metro: query,
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
        if (resData.data.metroEvents) {
          this.setState({ events: resData.data.metroEvents });
        }
        return;
      });
  };

  handleQueryArtist = (query) => {
    if (!query) return;

    let requestBody = {
      query: `
        query SearchArtist($search: String) {
          searchArtist(search: $search) {
            artistId
            artistName
            onTourUntil
            events {
              eventId
              eventName
              type
              date
              venue
              metroArea
              lat
              lng
            }
          }
        }
      `,
      variables: {
        search: query,
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
        if (resData.data.searchArtist) {
          this.setState({ artists: resData.data.searchArtist });
        }
        return;
      });
  };

  watchArtist = (artistId, artistName) => {
    if (!this.state.token) return;
    let requestBody = {
      query: `
      mutation WatchArtist($artistId: Int, $artistName: String){
        watchArtist(artistId: $artistId, artistName: $artistName)
      }
      `,
      variables: {
        artistId: parseInt(artistId),
        artistName: artistName,
      },
    };

    let token = this.state.token;
    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        // if (res.status !== 200 && res.status !== 201) {
        //   throw new Error('Failed!');
        // }
        return res.json();
      })
      .then((resData) => {
        this.getSavedArtist();
      });
  };

  unwatchArtist = (id) => {
    if (!this.state.token) return;
    let requestBody = {
      query: ` 
      mutation UnwatchArtist($id : ID){
        unwatchArtist(id: $id)
      }
      `,
      variables: {
        id: id,
      },
    };

    let token = this.state.token;
    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        // if (res.status !== 200 && res.status !== 201) {
        //   throw new Error('Failed!');
        // }
        return res.json();
      })
      .then((resData) => {
        this.getSavedArtist();
      });
  };

  getSavedArtist = () => {
    if (!this.state.userId) return;
    let userId = this.state.userId;

    let requestBody = {
      query: `
        query User($id: ID) {
          user(id: $id){
            watchlist {
              _id
              artistId
              artistName
              onTourUntil
              events {
                eventId
                eventName
                type
                date
                venue
                metroArea
                lat
                lng
              }
            }
          }
        }
      `,
      variables: {
        id: userId,
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
        this.setState({
          savedArtist: resData.data.user.watchlist,
        });
      });
  };

  //!-------------------------------------------------------------------!//
  render() {
    return (
      <div className='App'>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            username: this.state.username,
            login: this.login,
            logout: this.logout,
          }}>
          <Header />

          <main className='Content'>
            <Switch>
              {this.state.token && (
                <Redirect from='/' to='/events' exact />
              )}
              <Route exact path='/' component={LandingPage} />

              <Route
                exact
                path='/events'
                render={() => (
                  <EventsPage
                    events={this.state.events}
                    handleQueryMetro={this.handleQueryMetro}
                  />
                )}
              />
              <Route
                path={'/events/:eventId'}
                render={(props) => (
                  <EventShow events={this.state.events} {...props} />
                )}
              />

              <Route
                exact
                path='/artists'
                render={() => (
                  <ArtistPage
                    userId={this.state.userId}
                    artists={this.state.artists}
                    saved={this.state.savedArtist}
                    handleQueryArtist={this.handleQueryArtist}
                  />
                )}
              />
              <Route
                path='/artists/:artistId'
                render={(props) => (
                  <ArtistShow
                    userId={this.state.userId}
                    artists={this.state.artists}
                    saved={this.state.savedArtist}
                    watchArtist={this.watchArtist}
                    unwatchArtist={this.unwatchArtist}
                    {...props}
                  />
                )}
              />
              {this.state.token && (
                <Route path='/profile' component={ProfilePage} />
              )}
              {!this.state.token && <Redirect to='/' exact />}
            </Switch>
          </main>

          <MenuBar />
        </AuthContext.Provider>
      </div>
    );
  }
}

export default App;
