const express = require('express')
const auth = require('../middleware/auth')
require('../db/mongoose.js')
const User = require('../model/user.js')
const multer = require('multer')
const sharp = require('sharp')
const routers = express.Router()
const { sendWellcomeEmail, sendCancelationEmail } = require('../email/account')
routers.post('/users', async(req, res) => {
    const user = new User(req.body)
    try {

        await user.save()
        sendWellcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})
routers.post('/users/login', async(req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })

    } catch (e) {
        res.status(400).send(e)
    }
})
routers.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
routers.post('/users/logoutall', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

routers.get('/users/me', auth, async(req, res) => {

    res.send(req.user)

})
routers.get('/users/:id', async(req, res) => {
        const _id = req.params.id
        try {
            const user = await User.findById(_id)
            if (!user) {
                return res.status(404).send("This user is not found")
            }
            res.send(user)
        } catch (error) {
            res.status(500).send(error)
        }
    })
    ///////////////////////
routers.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'password', 'age']
    const isValid = updates.every((update) => allowedUpdate.includes(update))
    if (!isValid) {
        return res.status(404).send('invalid updates')
    }
    try {
        // const user = await User.findById(req.user._id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
            // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            // if (!user) {
            //     return res.status(404).send('user not found')
            // }
        res.status(201).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

routers.delete('/users/me', auth, async(req, res) => {
    try {
        const user = req.user
        await req.user.remove()
        sendCancelationEmail(user.email, user.name)
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})
const upload = multer({

    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        //regular expration search on google
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('the file must be images'))
        }
        cb(undefined, true)
    }
})
routers.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

routers.delete('/users/me/avatar', auth, async(req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        res.send(e)
    }
})
routers.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})
module.exports = routers