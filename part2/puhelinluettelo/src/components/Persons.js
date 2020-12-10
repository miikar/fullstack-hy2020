import React from 'react'

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map(person =>
        <Person key={person.name} person={person}/>
      )}
    </div>
  )
}
    
const Person = ({ person }) => {
  return (
    <div>
      {person.name} {person.number}
    </div>
  )
}

export default Persons;