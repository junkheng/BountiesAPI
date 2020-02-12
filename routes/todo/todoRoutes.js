// Express base config
const express = require('express')
const app = express()
const router = express.Router()

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

const TodoModel = mongoose.model('todo', {
    task: String,
    completed: { type: Boolean, default: false }
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        let todo = new TodoModel(req.body)
        let result = await todo.save()
        console.log(`saving task: ${result.task}`)
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/', async (req, res) => {
    try {
        let result = await TodoModel.find().exec()
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/:id', async (req, res) => {
    try {
        let todo = await TodoModel.findById(req.params.id).exec()
        res.send(todo)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put('/:id', async (req, res) => {
    // console.log(req.body)
    try {
        let todo = await TodoModel.findById(req.params.id).exec()
        // console.log(req.body)
        todo.set(req.body)
        let result = await todo.save()
        console.log(`updating item to...${result}`)
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        let result = await TodoModel.deleteOne({ _id: req.params.id }).exec()
        console.log(`deleting item...${req.params.id}`)
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router