import React, { useState } from 'react'

const Countries = ({ countries, handleShowCountry }) => {

  const showDetails = countries.length === 1;

  return (
    <div>
      {countries.length > 10 
        ? <span>Too many matches, specify another filter</span>
        : countries.map(country =>
            <Country key={country.name}
              country={country}
              showDetails={showDetails}
              handleShowCountry={handleShowCountry}/>
          )}
    </div>
  )
}
    
const Country = ({ country, showDetails, handleShowCountry }) => {
  return (
    <div>
      { !showDetails
        ? <div>{country.name} <button onClick={() => handleShowCountry(country.name)}>show</button></div>
        : <CountryDetails country={country}/>
      }
    </div>
  )
}

const CountryDetails = ({ country }) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>
        {country.languages.map(language =>
          <li key={language.name}>{language.name}</li>
        )}
      </ul>
      <img src={country.flag}></img>
    </div>
  )
}

export default Countries;