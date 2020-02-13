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
                console.log('incorrect user or pass')
                res.sendStatus(403).json({
                    success: false,
                    message: 'Incorrect username or password'
                })
            }
        } else {
            console.log('auth failed')
            res.sendStatus(400).json({
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
    const todoRouter = require('./routes/todo/todoRoutes')
    const userRouter = require('./routes/user/userRoutes')

    // To parse json
    const bodyParser = require('body-parser')

    let handlers = new HandlerGenerator()
    const port = process.env.PORT;

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use('/todo', todoRouter)
    app.use('/user', userRouter)

    app.post('/login', handlers.login)
    app.get('/', middleware.checkToken, handlers.index)
    app.listen(port, () => console.log(`Server is listening on port: ${port}`))
}())