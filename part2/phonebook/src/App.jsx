import { useState } from "react"

const Person = ({ person }) => <p key={person.name}>{person.name}</p>

const Numbers = ({ people }) => {
  return (
    <div>
      {people.map((person) => (
        <Person key={person.name} person={person} />
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }])
  const [newName, setNewName] = useState("")

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
    }
    setPersons(persons.concat(newPerson))
    setNewName("")
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit" onClick={handleSubmit}>
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Numbers people={persons} />
    </div>
  )
}

export default App
