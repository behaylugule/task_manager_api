const {
    oneUserId,
    oneUser,
    setUpDataBase,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThird
} = require('./fixtures/db')
const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/model/task')
const User = require('../src/model/user')
beforeEach(setUpDataBase)
test('should create a new user', async() => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${oneUser.tokens[0].token}`)
        .send({
            description: 'clean the house'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should userone task', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${oneUser.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)

})

test('should not delete the user', async() => {
    await request(app)
        .delete(`/tasks/${ taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()

})