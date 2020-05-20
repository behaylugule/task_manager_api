const express = require('express')
const userRouters = require('./routers/user')
const taskRouters = require('./routers/task')
const port = process.env.PORT
const app = express()
    // app.use((req, res, next) => {
    //     if (req.method === 'GET') {
    //         res.send('GET method is locked')
    //     } else {
    //         next()
    //     }
    // })
    // app.use((req, res, next) => {

//     res.status(503).send('try leter, this site is under maintenace ')


// })
app.use(express.json())
app.use(userRouters)
app.use(taskRouters)

/////////////////////////

app.listen(port, () => {
    console.log('server is on ' + port)
})


const Task = require('./model/task')
const User = require('./model/user')
const main = async() => {
    // const task = await Task.findById('5ebaf25e57d5ff34204c7ece')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    // const user = await User.findById('5ebae70c7bc57b19942af5ba')
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks)
}
main()