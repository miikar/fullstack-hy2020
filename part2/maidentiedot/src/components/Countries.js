import React from 'react'

const Countries = ({ countries, handleShowCountry }) => {

  return (
    <div>
      {countries.length > 10 
        ? <span>Too many matches, specify another filter</span>
        : countries.map(country =>
            <Country key={country.name}
              country={country}
              handleShowCountry={handleShowCountry}/>
          )}
    </div>
  )
}
    
const Country = ({ country, handleShowCountry }) => {
  return (
    <div>
      {<div>{country.name} <button onClick={() => handleShowCountry(country.name)}>show</button></div>}
    </div>
  )
}

export default Countries;