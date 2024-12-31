import express from 'express'
import exp from 'constants'
import cors from 'cors'
import Person from './models/person.js'
import morgan from 'morgan'



// const express = require('express')
// const cors = require('cors')
// const morgan = require('morgan')
// // const mongoose = require('mongoose')
// const Person = require('./models/person')






const app = express()



app.use(express.static('dist'))


app.use(cors())


app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// app.use(morgan('tiny'));





const requestLogger = (request , response , next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}


app.use(requestLogger)


app.get('/', (req, res) => {
  res.send('Hello World')
}
)

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
}
)



//step2
app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p> 
    <p>${date}</p>`)
})

//step3
app.get('/api/persons/:id', (req, res) => {
  // const id = (req.params.id);
  // const person = persons.find(person => person.id === id);
  // if(person){
  //     res.json(person);
  // }else{
  //     res.status(404).end();
  // }

  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
})

//step4
app.delete('/api/persons/:id', (req, res ,next) => {
  // const id = (req.params.id);
  // persons = persons.filter(person => person.id !== id);
  // res.status(204).end();

  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (!result) {
        return res.status(404).json({ error: 'Contact not found' })
      }
      res.status(204).end()
    })
    .catch(error => next(error))
})

//step4

//gen id 

// const generateId = () => {
//     const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => n.id))
//     : 0
//     return maxId + 1
// }

app.post('/api/persons', (req, res ,next) => {
  const body = req.body
  if(!body.name || !body.number){
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  // const person = {
  //     name: body.name,
  //     number: body.number,
  //     id: Math.floor(Math.random() * 1000),
  // }
  // persons = persons.concat(person);
  // res.json(person);

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  }) 
    .catch(error => {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
      } else {
        next(error)
      }
    })
})



app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  
  const updatedPerson = { name, number }
  
  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (!updatedPerson) {
        return res.status(404).json({ error: 'Contact not found' })
      }
      res.json(updatedPerson)
    })
    .catch(error => next(error)) // Handle errors
})
  


const errorHandling = (error, req, res, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  
  next(error)
}

app.use(errorHandling)

const PORT = 3001
app.listen(PORT , () => {
  console.log(`Server running on port ${PORT}`)

})
