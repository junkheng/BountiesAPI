const express = require('express')
const app = express()
const todoRouter = require('./routes/todo/todoRoutes')
const userRouter = require('./routes/user/userRoutes')

// To parse json
const bodyParser = require('body-parser')

const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/todo', todoRouter)
app.use('/user', userRouter)

app.listen(port, () => console.log(`Server is listening on port: ${port}`))
