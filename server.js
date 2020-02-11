let jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
let config = require('./config')
dotenv.config()
let middleware = require('./middleware')

class HandlerGenerator {
    login (req, res) {
        let username = req.body.username
        let password = req.body.password

        let mockedUsername = 'admin'
        let mockedPassword = 'password'

        if (username && password) {
            if (username === mockedUsername && password === mockedPassword) {
                let token = jwt.sign({ username: username }, // payload
                    config.secret, // secretkey
                    {
                        expiresIn: '24h' // options
                    }
                )
                res.json({
                    success: true,
                    message: 'Authentication successful',
                    token: token
                })
            } else {
                res.send(403).json({
                    success: false,
                    message: 'Incorrect username or password'
                })
            }
        } else {
            res.send(400).json({
                success: false,
                message: 'Authentication failed! Please check the request'
            })
        }
    }
    index (req, res) {
        res.json({
            success: true,
            message: 'Index Page'
        })
    }
}

(function main() {
    // Express base config
    const express = require('express')
    const app = express()

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
    let handlers = new HandlerGenerator()
    const port = process.env.PORT;
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.post('/login', handlers.login)
    app.get('/', middleware.checkToken, handlers.index)
    app.listen(port, () => console.log(`Server is listening on port: ${port}`))
    app.post('/todo', async (req, res) => {
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
        // console.log(req.params)
    
        try {
            let todo = await TodoModel.findById(req.params.id).exec()
            console.log(req.body)
            todo.set(req.body)
            let result = await todo.save()
            console.log(result)
            res.send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    })
    
    app.delete('/todo/delete/:id', async (req, res) => {
        try {
            let result = await TodoModel.deleteOne({ _id: req.params.id }).exec()
            console.log(`deleting item...${req.params.id}`)
            res.send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    })
}())