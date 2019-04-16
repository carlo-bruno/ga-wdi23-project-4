import React, { Component } from 'react';
// import { Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import Auth from './Pages/Auth';
import AuthContext from './context/auth-context';
import Header from './Components/Header';
import MenuBar from './Components/MenuBar';

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
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}>
          <Header />

          <main className='Content'>
            {/* Routes here */}
            <Auth />
          </main>

          <MenuBar />
        </AuthContext.Provider>
      </div>
    );
  }
}

export default App;
