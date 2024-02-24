const Person = ({ person, handleDelete }) => {
  const id = person.id
  return (
    <div>
      {person.name} {person.number}{" "}
      <button onClick={() => handleDelete(id)}>delete</button>
    </div>
  )
}

const Persons = ({ people, filter, handleDelete }) => {
  const filterCaseInsensitive = filter.toLowerCase()
  const filtered = people.filter((item) =>
    item.name.toLowerCase().includes(filterCaseInsensitive)
  )
  return (
    <div>
      {filtered.map((person) => (
        <Person key={person.id} person={person} handleDelete={handleDelete} />
      ))}
    </div>
  )
}

export default Persons
