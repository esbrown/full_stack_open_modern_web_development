const Person = ({ person }) => (
  <p key={person.id}>
    {person.name} {person.number}
  </p>
)

const Persons = ({ people, filter }) => {
  const filterCaseInsensitive = filter.toLowerCase()
  const filtered = people.filter((item) =>
    item.name.toLowerCase().includes(filterCaseInsensitive)
  )
  return (
    <div>
      {filtered.map((person) => (
        <Person key={person.id} person={person} />
      ))}
    </div>
  )
}

export default Persons
