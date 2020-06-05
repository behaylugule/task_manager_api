const express = require('express')
const userRouters = require('./routers/user')
const taskRouters = require('./routers/task')
const app = express()
app.use(express.json())
app.use(userRouters)
app.use(taskRouters)


module.exports = app