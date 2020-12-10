import React from 'react'

const Filter = ({ searchName, handleSearchChange }) => {
  return (
    <span>filter shown with: <input value={searchName} onChange={handleSearchChange}/></span>
  )
}
  
export default Filter;