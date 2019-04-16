import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
// import axios from 'axios';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();

    this.state = {
      isLogin: true
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
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password
        }
      };
    }

    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
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
          <div className='form-control'>
            <label htmlFor='emai'>Email</label>
            <input
              type='email'
              id='email'
              ref={this.emailEl}
              required
            />
          </div>
          <div className='form-control'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              ref={this.passwordEl}
              required
            />
          </div>
          <div className='form-actions'>
            <button type='submit'>
              {this.state.isLogin ? 'Log in!' : 'Sign Up!'}
            </button>
            <button type='button' onClick={this.switchMode}>
              Switch to {this.state.isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Auth;
