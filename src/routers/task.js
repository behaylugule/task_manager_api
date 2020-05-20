const express = require('express')
require('../db/mongoose.js')
const Tasks = require('../model/task.js')
const auth = require('../middleware/auth')
const User = require('../model/user')

const routers = express.Router()
routers.post('/tasks', auth, async(req, res) => {
        try {
            //  const task = new Tasks(req.body)
            const task = new Tasks({
                ...req.body,
                owner: req.user._id
            })

            await task.save()
            res.status(201).send(task)
        } catch (error) {
            res.status(400).send(error)
        }
    })
    //GET tasks?completed=true
    //GET tasks?limit=2&&skip=2     panigation
    //GET /tasks?sortBy=createdAt:desc
routers.get('/tasks', auth, async(req, res) => {
    const match = {}
    const sort = {}
        //filter
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    //sort
    if (req.query.sortBy) {
        const part = req.query.sortBy.split(':')
        sort[part[0]] = part[1] === 'desc' ? -1 : 1
    }
    try {
        // const tasks = await Tasks.find({owner:req.user._id})
        const user = await User.findById(req.user._id)
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }

})

routers.get(('/tasks/:id'), auth, async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Tasks.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send("Task not found")
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

routers.patch('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdate = ['description', 'completed']
    const isValid = updates.every((update) => allowedUpdate.includes(update))
    if (!isValid) {
        return res.status(404).send('invalid updates')
    }
    try {
        //  const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        const task = await Tasks.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('task not found')
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})
routers.delete('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Tasks.findOneAndDelete({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(404).send(e)
    }
})
module.exports = routers