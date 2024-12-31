import mongoose from 'mongoose'
if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url = `mongodb+srv://superusermike:${password}@cluster0.yip12.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', noteSchema)

const person = new Person({
  name: personName,
  number: personNumber,
})

person.save().then(result => {
  console.log('Person saved!')
//   mongoose.connection.close()
})



Person.find({}).then(result => {
    console.log("phonebook :" );

    result.forEach(person => {
        
        console.log(person.name + " " + person.number)
    })
    mongoose.connection.close()
    })