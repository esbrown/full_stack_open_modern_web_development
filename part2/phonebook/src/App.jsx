import { useEffect, useState } from "react"
import Persons from "./components/Persons"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import personsService from "./services/persons"

// 5.5 hours so far

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filtered, setFilter] = useState("")

  useEffect(() => {
    personsService.getAll().then((persons) => {
      setPersons(persons)
    })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      }
      personsService.create(newPerson).then((updatedPerson) => {
        setPersons(persons.concat(updatedPerson))
        setNewName("")
        setNewNumber("")
      })
    }
  }

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id)
    if (window.confirm(`Do you really want to delete ${person.name}?`)) {
      personsService
        .remove(person.id)
        .then((deleted) =>
          setPersons(persons.filter((n) => n.id !== deleted.id))
        )
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterText={filtered} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Persons people={persons} filter={filtered} handleDelete={handleDelete} />
    </div>
  )
}

export default App
