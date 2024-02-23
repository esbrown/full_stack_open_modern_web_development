const Header = ({ name }) => <h1>{name}</h1>

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Content = ({ parts }) =>
  parts.map((element) => <Part key={element.id} part={element} />)

const Total = ({ parts }) => {
  const sum = parts.reduce((sum, curr) => {
    return sum + curr.exercises
  }, 0)
  return <strong>total of {sum} exercises</strong>
}

const Course = ({ course }) => (
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course
