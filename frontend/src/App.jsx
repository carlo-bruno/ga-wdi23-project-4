import React, { Component } from 'react';
import './App.css';
import Auth from './Pages/Auth';
import AuthContext from './context/auth-context';

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

  logout = () => {};

  render() {
    return (
      <div className='App'>
        <h1> HighNote</h1>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}>
          <Auth />
        </AuthContext.Provider>
      </div>
    );
  }
}

export default App;
