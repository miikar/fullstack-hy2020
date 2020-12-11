import React, { useEffect, useState } from 'react';
import Filter from './components/Filter';
import Countries from './components/Countries';
import CountryDetails from './components/CountryDetails';
import axios from 'axios';

const api_key = process.env.REACT_APP_API_KEY;

const App = () => {

  const [countries, setCountries] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [weather, setWeather] = useState(null);

  const filteredCountries = countries.filter(country => {
    return country.name.toLowerCase().includes(searchName.toLowerCase());
  });
  const countryDetails = filteredCountries.length === 1 ? filteredCountries[0] : false;

  // Get initial countries data
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data);
      });
  }, []);

  // Watch showDetails
  useEffect(() => {
    if (countryDetails !== false) {
      axios
        .get('http://api.weatherstack.com/current', {
          params: {
            access_key: api_key,
            query: countryDetails.capital,
            units: 'm'
          }
        })
        .then(response =>{
          setWeather(response.data);
        });
    } else {
      setWeather(null);
    }
  }, [countryDetails]);

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  }

  const handleShowCountry = (countryName) => {
    setSearchName(countryName);
  }

  return (
    <div className="App">
      <Filter searchName={searchName} handleSearchChange={handleSearchChange} />
      { countryDetails === false
          ? <Countries 
          countries={filteredCountries}
          handleShowCountry={handleShowCountry} />
          : <CountryDetails country={countryDetails} weather={weather} />
      }
    </div>
  );
}

export default App;
