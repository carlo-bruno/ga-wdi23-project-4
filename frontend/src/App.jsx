import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import AuthContext from './context/auth-context';

import Header from './Components/Header';
import MenuBar from './Components/MenuBar';
import LandingPage from './Pages/LandingPage';
import EventsPage from './Pages/EventPage';
import ArtistPage from './Pages/ArtistPage';
import ProfilePage from './Pages/ProfilePage';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      userId: null
    };
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token, userId });
  };

  logout = () => {
    console.log('trying to log out');
    this.setState({
      token: null,
      userId: null
    });
  };

  render() {
    return (
      <div className='App'>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}>
          <Header />

          <main className='Content'>
            <Switch>
              {this.state.token && (
                <Redirect from='/' to='/events' exact />
              )}
              <Route exact path='/' component={LandingPage} />
              <Route path='/events' component={EventsPage} />
              <Route path='/artists' component={ArtistPage} />
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
