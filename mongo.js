const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !==5) {
  console.log('\nPlease enter the right command: ')
  console.log('1) Provide the password as an argument to see all entries of the phonebook: node mongo.js <password>')
  console.log('2) Provide the password, name, number to create an entry in the phonebook: node mongo.js <password> <name> <number>\n')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://banana:${password}@cluster0.hojxtqx.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = new mongoose.model('Person',personSchema)

if (process.argv.length === 5) {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')

      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })

      return person.save()
    })
    .then(() => {
      console.log(`add ${process.argv[3]} number ${process.argv[4]} to phonebook`)
      return mongoose.connection.close()
    })
    .catch(err => console.log(err))
} else {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')
      return Person.find({})
    })
    .then(result => {
      console.log('phonebook')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
    })
    .then(() => mongoose.connection.close())
    .catch(err => console.log(err))
}