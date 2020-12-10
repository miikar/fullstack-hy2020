import React from 'react'

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map(person =>
        <Person key={person.name} person={person} deletePerson={deletePerson}/>
      )}
    </div>
  )
}
    
const Person = ({ person, deletePerson }) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={() => deletePerson(person)}>delete</button>
    </div>
  )
}

export default Persons;