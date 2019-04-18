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
      events: [],
      artists: [],
    };
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token, userId });
  };

  logout = () => {
    console.log('trying to log out');
    this.setState({
      token: null,
      userId: null,
    });
  };

  handleQueryMetro = (query) => {
    let requestBody = {
      query: `
        query MetroEvents($metro: String) {
          metroEvents(metro: $metro) {
            eventId
            eventName
            type
            date
            venue
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
        this.setState({ events: resData.data.metroEvents });
      });
  };

  handleQueryArtist = (query) => {
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
        this.setState({ artists: resData.data.searchArtist });
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
                render={(props) => <EventShow {...props} />}
              />

              <Route
                exact
                path='/artists'
                render={() => (
                  <ArtistPage
                    artists={this.state.artists}
                    handleQueryArtist={this.handleQueryArtist}
                  />
                )}
              />
              <Route
                path='/artists/:artistId'
                render={(props) => <ArtistShow {...props} />}
              />
              {/* {this.state.token && ( */}
              <Route path='/profile' component={ProfilePage} />
              {/* )} */}
              {/* {!this.state.token && <Redirect to='/' exact />} */}
            </Switch>
          </main>

          <MenuBar />
        </AuthContext.Provider>
      </div>
    );
  }
}

export default App;
