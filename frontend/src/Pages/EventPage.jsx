import React, { Component } from 'react';
import EventCard from '../Components/EventCard';

class EventPage extends Component {
  constructor(props) {
    super(props);
    this.queryMetro = React.createRef();

    this.state = {
      filter: 'all',
    };
  }

  changeFilter = (filter) => {
    this.setState({ filter });
  };

  render() {
    let cards = this.props.events.map((event, i) => {
      return <EventCard key={i} event={event} />;
    });

    return (
      <div className='EventPage'>
        <header>
          <input
            type='text'
            name='queryMetro'
            id='queryMetro'
            ref={this.queryMetro}
            placeholder='Search for Metro Area'
          />
          <button
            onClick={() =>
              this.props.handleQueryMetro(
                this.queryMetro.current.value
              )
            }>
            Metro Area
          </button>
        </header>

        <div className='events-filters'>
          <div
            className={`filter ${
              this.state.filter === 'all' ? 'active' : ''
            }`}
            onClick={() => this.changeFilter('all')}>
            ALL{' '}
            <span className='events-count'>
              {this.props.events.length}
            </span>{' '}
          </div>
          <div
            className={`filter ${
              this.state.filter === 'saved' ? 'active' : ''
            }`}
            onClick={() => this.changeFilter('saved')}
            style={{ pointerEvents: 'none', color: '#cccc' }}>
            SAVED <span className='events-count'>0</span>
          </div>
        </div>

        <section className='events-collection'>{cards}</section>
      </div>
    );
  }
}

export default EventPage;
