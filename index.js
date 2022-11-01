require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

app.use(express.static('build'))


app.get('/', (request, response) => {
    response.send('<h1>Data was stored at http://localhost:3001/api/persons </h1>')
  })

app.get('/api/persons', (request, response, next) => {
	Person.find({})
	.then(persons => {
			response.json(persons)
	})
	.catch(error => next(error))
})

app.get('/info', (request, response, next) => {
	Person.find({})
	.then(persons => {
		response.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`)
	})
	.catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {

	Person.findById(request.params.id)
	.then(person => {
		if(person) {
			response.json(person)
		}
		else {
			response.status(404).end()
		}
	})
	.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
	.then(result => {		
		response.status(204).end()
	})
	.catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person = {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'})
	.then(updatedPerson => {
		response.json(updatedPerson)
	})
	.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	Person.find({name: body.name})
	.then(person => {
		if (person.length === 0) { // result is []
			const person = new Person({
				name: body.name,
				number: body.number
			})
			return person.save()
		} 
	})
	.then(savedPerson => {
		if (savedPerson) { 
			response.json(savedPerson)
		}
		else { //savedPerson is undefined
			response.status(400).send({ error: 'name must be unique' })
		}
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
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
	app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})