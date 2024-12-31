console.log('hello world');

// const http = require('http');

import http from 'http';
import express, { response } from 'express';
import exp from 'constants';
import cors from 'cors';
// import mongoose from 'mongoose';
import Note from './models/note.js';



// // const password = process.argv[2]

// // DO NOT SAVE YOUR PASSWORD TO GITHUB!!
// const url = process.env.MONGODB_URI ;

// mongoose.set('strictQuery',false)
// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// noteSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//       returnedObject.id = returnedObject._id.toString()
//       delete returnedObject._id
//       delete returnedObject.__v
//     }
//   })

// const Note = mongoose.model('Note', noteSchema)

const app =  express();

app.use(express.static('dist'));


app.use(cors())


app.use(express.json())

const requestLogger = (request , response , next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}


app.use(requestLogger)



// let notes = [
//     {
//       id: "1",
//       content: "HTML is easy",
//       important: true
//     },
//     {
//       id: "2",
//       content: "Browser can execute only JavaScript",
//       important: false
//     },
//     {
//       id: "3",
//       content: "GET and POST are the most important methods of HTTP protocol",
//       important: true
//     } ,
//     {
//         id: "5",
//         content: "Tested CORS",
//         important: false
//       }
//   ]


// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'text/plain' })
//   response.end(JSON.stringify(notes))
// })
app.get('/' , (reques , response) => {
    response.send('<h1>Hello World How are u</h1>')
})

app.get('/api/notes', (request, response) => {
    // response.json(notes)

    Note.find({}).then(notes => {
        response.json(notes)
    })
})

// view paticular note

app.get('/api/notes/:id', (request , response ,next ) => {
    // const id = request.params.id 
    // const note = notes.find(note => note.id === id)
    // if(note){
    //     response.json(note)
    // }else {
    //     response.status(404).end()
    // }
    Note.findById(request.params.id).then(note => {
        if(note){
            response.json(note) 
        }
        else {
            response.status(404).end()
        }

       
    }) .catch(error => { next(error)})

    //     console.log(error)
    //     response.status(400).send({error: 'malformatted id'})
    // })
   

})


// generate id 


const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
    return String(maxId + 1)

}

app.post('/api/notes', (request , response ,next) => {
    
    const body = request.body

    if(!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })
    
       
    // notes = notes.concat(note)
    // console.log(note)
    // response.json(note)
    note.save().then(savedNote => {
        response.json(savedNote)
    })
        .catch(error => next(error))

})








// //delete note 

app.delete('/api/notes/delete/:id', (request , response ,next) => {
    // const id = request.params.id
    // notes = notes.filter(note => note.id !== id)
   
    // response.status(204).end()

    Note.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    }) .catch(error => next(error))
})


app.put('/api/notes/:id', (request, response, next) => {
    const {content , important} = request.body
  
    const note = {
      content: body.content,
      important: body.important,
    }
  
    Note.findByIdAndUpdate(request.params.id, note, { new: true , runValidators: true, context: 'query' })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })






const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)




const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }  else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }

    app.use(errorHandler)



const PORT = 3001
app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`)

})


