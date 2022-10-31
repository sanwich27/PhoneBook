const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')
app.use(cors())

let persons = [
	{ 
		"id": 1,
		"name": "Arto Hellas", 
		"number": "040-123456"
	},
	{ 
		"id": 2,
		"name": "Ada Lovelace", 
		"number": "39-44-5323523"
	},
	{ 
		"id": 3,
		"name": "Dan Abramov", 
		"number": "12-43-234345"
	},
	{ 
		"id": 4,
		"name": "Mary Poppendieck", 
		"number": "39-23-6423122"
	}
]

app.get('/', (request, response) => {
    response.send('<h1>Data was stored at http://localhost:3001/api/persons </h1>')
  })
  
app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/info', (request, response) => {
	response.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)

	if(person) {
		response.json(person)
	}
	else {
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)

	response.status(204).end()
})


const generateID = () => {
	const id = Math.floor(Math.random() * 10 ** 10)
	return id
}

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

	const nameExist = persons.find(person => person.name === body.name)
	if (nameExist) {
		return response.status(400).json({ 
      error: 'name must be unique' 
    })
	}

	const person = {
		id: generateID(),
		name: body.name,
		number: body.number
	}

	persons = persons.concat(person)

	response.json(persons)
})

const PORT = process.env.PORT || 3001
	app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})