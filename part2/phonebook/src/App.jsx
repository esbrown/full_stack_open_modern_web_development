import { useEffect, useState } from "react"
import Persons from "./components/Persons"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import personsService from "./services/persons"
import SuccessMessage from "./components/SuccessMessage"
import ErrorMessage from "./components/ErrorMessage"

// 6.5 hours so far

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filtered, setFilter] = useState("")
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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

  const updateSuccessMessage = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const updateErrorMessage = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const existingPerson = persons.find((person) => person.name === newName)
    if (existingPerson) {
      if (
        window.confirm(
          `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber,
        }
        const id = updatedPerson.id
        personsService
          .update(updatedPerson.id, updatedPerson)
          .then((response) => {
            setPersons(persons.map((p) => (p.id !== id ? p : response)))
            setNewName("")
            setNewNumber("")
            updateSuccessMessage(
              `Updated the number for ${response.name} to ${response.number}`
            )
          })
          .catch(() => {
            updateErrorMessage(
              `Information of ${existingPerson.name} has already been removed from the server`
            )
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      }
      personsService.create(newPerson).then((updatedPerson) => {
        setPersons(persons.concat(updatedPerson))
        setNewName("")
        setNewNumber("")
        updateSuccessMessage(`Added ${updatedPerson.name} to Phonebook`)
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
      <SuccessMessage message={successMessage} />
      <ErrorMessage message={errorMessage} />
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
