import React, { Component } from 'react';
import AuthContext from '../context/auth-context';

class ProfilePage extends Component {
  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (
          <div className='ProfilePage'>
            <section>
              <div className='profile-img'>
                <img
                  src='http://placekitten.com/g/275/275'
                  alt='placeholder'
                />
              </div>
              <h3>{context.userId}</h3>
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
