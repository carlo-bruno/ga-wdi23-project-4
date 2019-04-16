import React from 'react';
import Auth from '../Components/Auth';

const Home = () => {
  return (
    <div className='LandingPage'>
      <section className='brand-statement'>
        <h2 className='brand-font'>HighNote</h2>
        <h3>More Music &bull; More Memories</h3>
      </section>
      <Auth />
    </div>
  );
};

export default Home;
