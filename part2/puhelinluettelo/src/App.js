import React, { useState } from 'react'
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]);

  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ searchName, setSearchName] = useState('');

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.map(person => person.name).includes(newName)) {
      window.alert(`${newName} is already added to phonebook`);
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
    
      setPersons(persons.concat(personObject));
      setNewName('');
      setNewNumber('');
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  }
  
  const filterPersons = (person) => {
    return person.name.toLowerCase().includes(searchName.toLowerCase());
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchName={searchName} handleSearchChange={handleSearchChange}/>
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons.filter(filterPersons)} searchName={searchName}/>
    </div>
  )
}

export default App