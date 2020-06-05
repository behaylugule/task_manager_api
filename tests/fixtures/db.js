const JWT = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/model/user')
const Task = require('../../src/model/task')
const oneUserId = new mongoose.Types.ObjectId()
const oneUser = {
    _id: oneUserId,
    name: 'aj',
    email: 'aguchewgulie@gmail.com',
    password: '12345678',

    tokens: [{
        token: JWT.sign({ _id: oneUserId }, process.env.JWT_SECRET)
    }]
}
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'yesh',
    email: 'yeshbekele@gmail.com',
    password: '12345678',

    tokens: [{
        token: JWT.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'first task',
    completed: true,
    owner: oneUserId
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'second task',
    completed: false,
    owner: oneUserId
}
const taskThird = {
    _id: new mongoose.Types.ObjectId(),
    description: 'third task',
    completed: true,
    owner: userTwoId
}

const setUpDataBase = async() => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(oneUser).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThird).save()
}

module.exports = {
    oneUserId,
    oneUser,
    setUpDataBase,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThird

}