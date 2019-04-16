import React, { Component } from 'react';
import './App.css';
import Auth from './Pages/Auth';

class App extends Component {
  render() {
    return (
      <div className='App'>
        <h1> HighNote</h1>
        <Auth />
      </div>
    );
  }
}

export default App;
