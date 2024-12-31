import mongoose from 'mongoose'
import { env } from 'process';
import dotenv from 'dotenv';
dotenv.config();


mongoose.set('strictQuery', false)


// iam planned to give password  through terminal 

if (process.argv.length < 3) {
  console.log('give password as argument')
  console.log('node server_file.js <password>');
  
  process.exit(1)
}




const password = process.argv[2]
const urlfromenv = process.env.MONGODB_URI

const url = urlfromenv.replace('<password>', password)




// console.log('connecting to', url)



mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String ,
    minlength: 3,
    required: true
  } ,
  number: {
    type: String,
    minlength: 8,
    required: true ,
    validate : 
    {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


// module.exports = mongoose.model('Note', noteSchema)\
const Person = mongoose.model('Person', personSchema)
export default  Person;