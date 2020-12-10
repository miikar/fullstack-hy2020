import React, { useEffect, useState } from 'react';
import Filter from './components/Filter';
import Countries from './components/Countries';
import axios from 'axios';

const App = () => {

  const [countries, setCountries] = useState([]);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log(response);
        setCountries(response.data);
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  }

  const handleShowCountry = (countryName) => {
    setSearchName(countryName);
  }
  
  const filterCountries = (country) => {
    return country.name.toLowerCase().includes(searchName.toLowerCase());
  }

  return (
    <div className="App">
      <Filter searchName={searchName} handleSearchChange={handleSearchChange}/>
      <Countries countries={countries.filter(filterCountries)} handleShowCountry={handleShowCountry}/>
    </div>
  );
}

export default App;
