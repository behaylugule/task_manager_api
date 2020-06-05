const { oneUserId, oneUser, setUpDataBase } = require('./fixtures/db')
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/model/user')


beforeEach(setUpDataBase)

test('should signing a new user', async() => {
    const response = await request(app).post('/users').send({
            name: 'baya gule',
            email: 'behaylugule@gmail.com',
            password: '12345678'
        }).expect(201)
        //assert that the database is changed
    const user = (await User.findById(response.body.user._id)).toObject()
    expect(user).not.toBeNull()
        //assert about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'baya gule',
            email: 'behaylugule@gmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('12345678')
})

test('should be log in', async() => {
    const response = await request(app).post('/users/login').send({
        email: oneUser.email,
        password: oneUser.password
    }).expect(200)
    const user = (await User.findById(response.body.user._id)).toObject()
    expect(response.body.token).toBe(user.tokens[1].token)
})
test('should not be  log in', async() => {
    await request(app).post('/users/login').send({
        email: 'bayaexample@gmail.com',
        password: 12345678
    }).expect(400)
})
test('should get the profile', async() => {
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${oneUser.tokens[0].token}`)
        .send()
        .expect(200)
})
test('should not get the profile', async() => {
    await request(app).get('/users/me')
        .send()
        .expect(401)
})
test('should delete the user', async() => {
    await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${oneUser.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(oneUser._id)
    expect(user).toBeNull()

})
test('should not delete the user', async() => {
    await request(app).delete('/users/me')
        .send()
        .expect(401)

})

test('should upload avater image', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${oneUser.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/1.png')
        .expect(200)
    const user = await User.findById(oneUserId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update the user', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${oneUser.tokens[0].token}`)
        .send({ name: 'bayaaaaa' })
        .expect(201)
})

test('should not update the user', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${oneUser.tokens[0].token}`)
        .send({ location: 'Addis Abeba' })
        .expect(404)
})