const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const testHelper = require('../utils/test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await testHelper.getUsersInDatabase()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await testHelper.getUsersInDatabase()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await testHelper.getUsersInDatabase()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await testHelper.getUsersInDatabase()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('user with short username is not created', async () => {
    const usersAtStart = await testHelper.getUsersInDatabase()

    const newUser = {
      username: 'hi',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('User validation failed'))

    const usersAtEnd = await testHelper.getUsersInDatabase()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('user with short password is not created', async () => {
    const usersAtStart = await testHelper.getUsersInDatabase()

    const newUser = {
      username: 'test',
      name: 'Superuser',
      password: 'hi',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('password must be 3 or more characters'))

    const usersAtEnd = await testHelper.getUsersInDatabase()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})
