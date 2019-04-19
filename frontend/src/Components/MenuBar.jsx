// @ts-nocheck
import React from 'react';
import { NavLink } from 'react-router-dom';

import { ReactComponent as Calendar } from '../images/calendar-solid.svg';
import { ReactComponent as Star } from '../images/star-solid.svg';
import { ReactComponent as User } from '../images/user-alt-solid.svg';

import AuthContext from '../context/auth-context';

const MenuBar = () => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <nav className='MenuBar'>
          <NavLink to='/events'>
            <Calendar />
          </NavLink>
          <NavLink to='/artists'>
            <Star />
          </NavLink>

          <NavLink to='/profile'>
            {/*style={!context.token ? { pointerEvents: 'none' } : {}} >*/}
            <User />
          </NavLink>
        </nav>
      );
    }}
  </AuthContext.Consumer>
);

export default MenuBar;
