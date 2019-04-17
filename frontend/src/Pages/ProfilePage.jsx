import React, { Component } from 'react';
import AuthContext from '../context/auth-context';

class ProfilePage extends Component {
  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (
          <div className='ProfilePage'>
            <h2>Profile Page</h2>
            <section>
              <div className='profile-img'>
                <img
                  src='http://placekitten.com/g/200/200'
                  alt='placeholder'
                />
              </div>
            </section>
            <button className='logout-btn' onClick={context.logout}>
              Logout
            </button>
          </div>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default ProfilePage;
