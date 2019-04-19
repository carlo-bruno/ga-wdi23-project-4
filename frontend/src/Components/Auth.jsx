import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
// import axios from 'axios';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.usernameEl = React.createRef();
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();

    this.state = {
      isLogin: true,
    };
  }

  static contextType = AuthContext;

  switchMode = (e) => {
    e.preventDefault();
    this.setState((prev) => {
      return { isLogin: !prev.isLogin };
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            username
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password,
      },
    };

    if (!this.state.isLogin) {
      const username = this.usernameEl.current.value;
      requestBody = {
        query: `
          mutation CreateUser($username: String!, $email: String!, $password: String!) {
            createUser(userInput: {username: $username, email: $email, password: $password}) {
              userId
              username
              token
              tokenExpiration
            }
          }
        `,
        variables: {
          username: username,
          email: email,
          password: password,
        },
      };
    }

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
        if (resData.data.login) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.username,
            resData.data.login.tokenExpiration
          );
        } else {
          this.context.login(
            resData.data.createUser.token,
            resData.data.createUser.userId,
            resData.data.createUser.username,
            resData.data.createUser.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className='Auth'>
        <h3>
          {this.state.isLogin
            ? 'Log in to your account'
            : 'Sign up for a new account'}
        </h3>
        <form className='auth-form' onSubmit={this.handleSubmit}>
          {!this.state.isLogin && (
            <div className='form-control'>
              <input
                type='text'
                id='username'
                ref={this.usernameEl}
                placeholder='Username'
                required
              />
            </div>
          )}
          <div className='form-control'>
            <input
              type='email'
              id='email'
              ref={this.emailEl}
              placeholder='Email'
              required
            />
          </div>
          <div className='form-control'>
            <input
              type='password'
              id='password'
              ref={this.passwordEl}
              placeholder='Password'
              required
            />
          </div>
          <div className='form-actions'>
            <button type='submit' className='submit-btn'>
              {this.state.isLogin ? 'Log in!' : 'Sign Up!'}
            </button>
            <button
              type='button'
              className='switch-btn'
              onClick={this.switchMode}>
              {this.state.isLogin
                ? "Don't have an account?"
                : 'Already a member?'}{' '}
              <em>{this.state.isLogin ? 'Sign up' : 'Log in'}</em>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Auth;
