const mongoose = require('mongoose')
const validate = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const task = require('./task')

const userSchames = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        validate(value) {
            if (!validate.isEmail(value)) {
                throw new Error('Email is not  correct formate')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {

                throw new Error('The password must not be password itself')

            }
        }
    },
    age: {
        type: Number,
        defualt: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('age must be posetive')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})
userSchames.virtual('tasks', {
        ref: 'Tasks',
        localField: '_id',
        foreignField: 'owner'
    })
    // for hiding private data
userSchames.methods.toJSON = function() {
        const user = this
        const userObject = user.toObject()
        delete userObject.password
        delete userObject.tokens
        return userObject
    }
    //for sign up and login
userSchames.methods.generateAuthToken = async function() {
        const user = this
        const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
        user.tokens = user.tokens.concat({ token })
        await user.save()
        return token
    }
    // for login
userSchames.statics.findByCredentials = async(email, password) => {
        const user = await User.findOne({ email })

        if (!user) {
            throw new Error('no user with ' + email + ' email address')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error('inncorect password pls try again!!!')
        }
        return user
    }
    //for password bycrept
userSchames.pre('save', async function(next) {
        const user = this;
        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 8)
        }
        next()
    })
    //for delete all the tasks
userSchames.pre('remove', async function(next) {
    const user = this
    await task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchames)
module.exports = User