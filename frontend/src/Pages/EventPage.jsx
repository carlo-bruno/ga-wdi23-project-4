import React, { Component } from 'react';
import EventCard from '../Components/EventCard';

class EventPage extends Component {
  constructor(props) {
    super(props);
    this.queryMetro = React.createRef();

    this.state = {
      filter: 'all',
      events: [],
    };
  }

  changeFilter = (filter) => {
    this.setState({ filter });
  };

  handleQueryMetro = () => {
    const metro = this.queryMetro.current.value;

    let requestBody = {
      query: `
        query MetroEvents($metro: String) {
          metroEvents(metro: $metro) {
            eventId
            eventName
            type
            date
            venue
            lat
            lng
            performance {
              _id
              artistId
              artistName
            }
          }
        }
      `,
      variables: {
        metro: metro,
      },
    };

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
        this.setState({ events: resData.data.metroEvents });
      });
  };

  render() {
    let cards = this.state.events.map((event, i) => {
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
            placeholder='Metro Area'
          />
          <button onClick={this.handleQueryMetro}>Search</button>
        </header>

        <div className='events-filters'>
          <div
            className={`filter ${
              this.state.filter === 'all' ? 'active' : ''
            }`}
            onClick={() => this.changeFilter('all')}>
            ALL{' '}
            <span className='events-count'>
              {this.state.events.length}
            </span>{' '}
          </div>
          <div
            className={`filter ${
              this.state.filter === 'saved' ? 'active' : ''
            }`}
            onClick={() => this.changeFilter('saved')}>
            SAVED{' '}
            <span className='events-count'>
              {/* {this.state.saved.length} */}
            </span>
          </div>
        </div>

        <section className='events-collection'>{cards}</section>
      </div>
    );
  }
}

export default EventPage;
