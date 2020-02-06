// Express base config
const express = require('express')
const app = express()
const port = 3000
const router = express.Router()

const request = require('request')
const cors = require('cors')

// To parse json
const bodyParser = require('body-parser')

// Database base config
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true})
const db = mongoose.connection

// DB check
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected!')
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.listen(port, () => console.log(`Listening on port ${port}`))

const TodoModel = mongoose.model('todo', {
    task: String,
    completed: Boolean
})


// app.post('/todo', (req, res) => {
//     try {
//         request('http://localhost:3001/todo', async (error, response, body) => {
//             let todo = new TodoModel(req.body)
//             let result = await todo.save()
//             console.log('saving task from external......')
//             res.send(result)
//         })
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

app.post('/todo', async (req, res) => {
    try {
        let todo = new TodoModel(req.body)
        let result = await todo.save()
        console.log(`saving task: ${result.task}`)
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/todo', async (req, res) => {
    try {
        let result = await TodoModel.find().exec()
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/todo/:id', async (req, res) => {
    try {
        let todo = await TodoModel.findById(req.params.id).exec()
        res.send(todo)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.put('/todo/:id', async (req, res) => {
    try {
        let todo = await TodoModel.findById(req.params.id).exec()
        todo.set(req.body)
        let result = await todo.save()
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.delete('/todo/:id', async (req, res) => {
    try {
        let result = await TodoModel.deleteOne({ id: req.params._id }).exec()
        console.log(`deleting item...`)
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
})