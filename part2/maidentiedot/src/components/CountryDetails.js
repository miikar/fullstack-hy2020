import React from 'react';

const CountryDetails = ({ country, weather }) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>Spoken languages</h3>
      <ul>
        {country.languages.map(language =>
          <li key={language.name}>{language.name}</li>
        )}
      </ul>
      <img alt="country-flag" style={{width: "200px"}} src={country.flag}></img>
      <Weather weather={weather}/>
    </div>
  )
}

const Weather = ({ weather }) => {
  if (weather === null) {
    return null;
  }

  return (
    <div>
      <h3>Weather in {weather.location.name}</h3>
      <div>
        <strong>temperature: </strong><span>{weather.current.temperature} Celsius</span>
      </div>
      <img alt="weather-icon" style={{width: "100px"}} src={weather.current.weather_icons[0]}></img>
      <div>
        <strong>wind: </strong><span>{weather.current.wind_speed} kmph </span><span>direction {weather.current.wind_dir}</span>
      </div>
    </div>
  )
}

export default CountryDetails;