// Express base config
const express = require('express')
const app = express()
const router = express.Router()
const checkAuth = require('../../middleware')

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
    time: Date,
    updated_at: Date,
    completed: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false }
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

router.post('/', checkAuth, async (req, res) => {
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
        let result = await TodoModel.find({deleted: false}).exec() // only find non-deleted items at the start
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/archive', async (req, res) => {
    try {
        let result = await TodoModel.find({ deleted: true }).exec()
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/:id', checkAuth, async (req, res) => {
    try {
        let todo = await TodoModel.findById(req.params.id).exec()
        res.send(todo)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put('/:id', checkAuth, async (req, res) => {
    // console.log(req.body)
    try {
        let todo = await TodoModel.findById(req.params.id).exec()
        console.log(req.body)
        todo.set(req.body)
        let result = await todo.save()
        console.log(`updating item to...${result}`)
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put('/delete/:id', checkAuth, async (req, res) => {
    try {
        let todo = await TodoModel.findById(req.params.id).exec()
        console.log(req.body.deleted)
        todo.set(req.body.deleted)
        let result = await todo.save()
        console.log(`setting deleted status to...${result}`)
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put('/completed/:id', checkAuth, async (req, res) => {
    try {
        let todo = await TodoModel.findById(req.params.id).exec()
        console.log(req.body.completed)
        todo.set(req.body.completed)
        let result = await todo.save()
        console.log(`setting completed status to...${result}`)
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

// actual deleting
// router.delete('/delete/:id', checkAuth, async (req, res) => {
//     try {
//         let result = await TodoModel.deleteOne({ _id: req.params.id }).exec()
//         console.log(`deleting item...${req.params.id}`)
//         res.send(result)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

module.exports = router

// db status - updated/deleted/completed
// sorting.. Date.now() to timestamp
// if completed item, disable updating
// delete - don't delete from db, hide from client || follow edit, set req.body.deleted to true
// show only non-deleted items ***
// deleted items timestamp.. updated at..
// report ***


// api done for 'completed' status update.. need to add checkbox/strikethrough for Client