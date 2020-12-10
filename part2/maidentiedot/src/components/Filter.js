import React from 'react'

const Filter = ({ searchName, handleSearchChange }) => {
  return (
    <span>find countries: <input value={searchName} onChange={handleSearchChange}/></span>
  )
}

export default Filter;
