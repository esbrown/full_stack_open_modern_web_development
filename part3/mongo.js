const mongoose = require("mongoose")

const numArgs = process.argv.length
if (numArgs < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ethansbrown711:${password}@cluster0.hfdjdhj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)

const printAllPeople = () => {
  Person.find({}).then((result) => {
    result.forEach((entry) => {
      console.log(entry)
    })
    mongoose.connection.close()
  })
}

const saveToDb = () => {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

if (numArgs === 3) {
  printAllPeople()
} else if (numArgs === 5) {
  saveToDb()
} else {
  mongoose.connection.close()
}
