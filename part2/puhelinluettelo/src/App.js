import React, { useState, useEffect } from 'react';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Notification from './components/Notification';

import personService from './services/persons';

const App = () => {
  const [ persons, setPersons] = useState([]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ searchName, setSearchName ] = useState('');
  const [ notification, setNotification ] = useState(null);

  const hook = () => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      });
  }
  
  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson !== undefined) {
      updatePerson(existingPerson);
    } else {
      createPerson();
    }
  }

  const createPerson = () => {
    const personObject = {
      name: newName,
      number: newNumber,
    }
    personService
      .create(personObject)
      .then(returnedPerson => {
        showNotification({
          message: `Added ${returnedPerson.name}`,
          type: 'success'
        });
        setPersons(persons.concat(returnedPerson));
      });
  }

  const updatePerson = (existingPerson) => {
    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const changedPerson = { ...existingPerson, number: newNumber }
      personService
        .update(changedPerson.id, changedPerson)
        .then(returnedPerson => {
          showNotification({
            message: `Updated ${returnedPerson.name}`,
            type: 'success'
          });
          setPersons(persons.map(person => person.id !== changedPerson.id ? person : returnedPerson))
        })
        .catch(error => {
          showNotification({
            message: `Information of ${changedPerson.name} has already been removed from server`,
            type: 'error'
          });
          setPersons(persons.filter(p => p.id !== changedPerson.id))
        });
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
      .deleteOne(person.id)
      .then(response => {
        showNotification({
          message: `Deleted ${person.name}`,
          type: 'success'
        });
        setPersons(persons.filter(p => p.id !== person.id));
      });
    }
  }

  const showNotification = (notification) => {
    setNotification(notification);
    setNewName('');
    setNewNumber('');
    setTimeout(() => {
      setNotification(null)
    }, 2000)
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
      <Notification notification={notification} />
      <Filter searchName={searchName} handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons 
        persons={persons.filter(filterPersons)}
        searchName={searchName}
        deletePerson={deletePerson}/>
    </div>
  )
}

export default App