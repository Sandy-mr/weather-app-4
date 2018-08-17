import React, { Component } from 'react';
import request from 'superagent';

class Country extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cities: '',
      show: false,
      timezone: 'Timezone',
      summary: 'Add a new city.',
      weekly: [],
      hourly: []
       
    };
  }
  getCoords = (ENDPOINT) => {
    return request.get(ENDPOINT);
  }

  fetchWeather = (response) => {
    const coords = response.body.results[0].geometry.location;

    const ENDPOINT = `https://api.darksky.net/forecast/8c6c8467512243aac21331fe2e8d328e/${ coords.lat }, ${ coords.lng }`;

    request
      .get(ENDPOINT)
      .then(response => {
        console.log(response.body.timezone);
        this.setState({
          weekly: response.body.daily.data,
          hourly: response.body.hourly.data,
          timezone: response.body.timezone,
          summary: response.body.currently.summary
        });
      });
  }

  fetchLocation = (count) => {

    const COUNTRY = count;
    const ENDPOINT = `https://maps.googleapis.com/maps/api/geocode/json?address=${ COUNTRY }`;
    this.setState({
     loading: true
   });

    this
      .getCoords(ENDPOINT)
      .then(this.fetchWeather)
      .catch(error => {
        this.setState({
          timezone: 'Timezone',
          summary: 'Something went wrong. Try again.'
        });
      });
  }

  renderIcon = iconName => {
    const icons = {
      'clear-day': 'wi-day-sunny',
      'partly-cloudy-day': 'wi-day-cloudy',
      'partly-cloudy-night': 'wi-night-alt-cloudy',
      'cloudy': 'wi-cloudy',
      'clear-night': '"wi-night-clear',
      'rain': 'wi-rain',
      'sleet': 'wi-sleet',
      'snow': 'wi-snow',
      'wind': 'wi-strong-wind',
      'fog': 'wi-day-fog'
    };

    return <i className={'wi '+icons[iconName] }></i>
  }

  dateToString = date => {
    return new Date(date * 1000).toLocaleString();
  }

  componentDidMount() {
  	setTimeout(() => this.setState({ loading: false }), 1500);
  	this.fetchLocation(this.props.match.params.cityName);
    }

 componentWillReceiveProps(newProps) {
       // console.log(props)
      this.fetchLocation(this.props.match.params.cityName);
    }

  render() {
    return (
      <div>
        <h3>{ this.state.timezone }</h3>
        <p>{ this.state.summary }</p>
        <h5>Weekly</h5>

      <table >
      <thead>
      <tr>
          <td>icon</td>
          <td>Sunrise Time</td>
          <td>Sunset Time</td>
          <td>Wind</td>
          <td>Pressure</td>
      </tr>
      </thead>
      <tbody className='week'>
          { this.state.weekly.map(day => {
            return (
              <tr>
                <td className='day__icon'>{this.renderIcon(this.state.day.icon)}</td>
                <td className='date'>{ this.dateToString(this.state.day.sunriseTime) }</td>
                <td className='date'>{ this.dateToString(day.sunsetTime) }</td>
                <td className='wind'>{ this.state.day.windSpeed } m/s</td>
                <td className='pressure'>{ this.state.day.pressure } hpa</td>
                </tr>
            );
          })
        }
        </tbody>
          </table>
          </div>
    );
  }
}

export default Country;
