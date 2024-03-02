const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const testHelper = require('../utils/test_helper')

const apiWithToken = (superTestApi) => {
  const addTokenHeader = (method, url) =>
    superTestApi[method](url).set('Authorization', `Bearer ${currToken}`)
  return {
    get: (url) => addTokenHeader('get', url),
    post: (url) => addTokenHeader('post', url),
    delete: (url) => addTokenHeader('delete', url),
    put: (url) => addTokenHeader('put', url),
  }
}

const api = apiWithToken(supertest(app))

let currToken = ''
const userName = 'ethan'
const pass = 'thisismypassword'

// before each, create new user and login
beforeEach(async () => {
  if (currToken !== '') {
    return
  }
  await User.deleteMany({})

  const passHash = await bcrypt.hash(pass, 10)
  const user = new User({
    username: userName,
    name: 'eth',
    passwordHash: passHash,
  })
  await user.save()

  const response = await api.post('/api/login/').send({
    username: userName,
    password: pass,
  })

  currToken = response.body.token
})

describe('test basic blog functionality', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(testHelper.initialBlogs)
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, testHelper.initialBlogs.length)
  })

  test('verify "id" name', async () => {
    const blogsInDb = await testHelper.getBlogsInDatabase()
    blogsInDb.forEach((blog) => {
      assert('id' in blog)
      assert(!('_id' in blog))
    })
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'title_3',
      author: 'author_3',
      url: 'url_3',
      likes: 30,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await testHelper.getBlogsInDatabase()
    assert.strictEqual(blogsAtEnd.length, testHelper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(titles.includes('title_3'))
  })

  test('likes missing defaults to 0', async () => {
    const blogMissingLikes = {
      title: 'title_3',
      author: 'author_3',
      url: 'url_3',
    }

    await api
      .post('/api/blogs')
      .send(blogMissingLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await testHelper.getBlogsInDatabase()

    assert.strictEqual(blogsAtEnd.length, testHelper.initialBlogs.length + 1)

    const newBlog = blogsAtEnd.filter((blog) => blog.title === 'title_3')[0]
    assert(newBlog.likes === 0)
  })

  test('title missing fails', async () => {
    const blogMissingTitle = {
      author: 'author_3',
      url: 'url_3',
    }

    await api.post('/api/blogs').send(blogMissingTitle).expect(400)
  })

  test('url missing fails', async () => {
    const blogMissingUrl = {
      title: 'title_3',
      author: 'author_3',
    }

    await api.post('/api/blogs').send(blogMissingUrl).expect(400)
  })
})

describe('delete and update on real data', async () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const user = await User.find({ username: userName })
    const user_id = user[0].id

    const blog = new Blog({
      title: 'will_delete!',
      author: 'author',
      url: 'hello.com',
      likes: 33,
      user: user_id,
    })
    await blog.save()
  })

  test('delete succeeds', async () => {
    const blogsInDb = await testHelper.getBlogsInDatabase()
    const toDelete = blogsInDb[0]

    await api.delete(`/api/blogs/${toDelete.id}`).expect(204)
    const blogsAtEnd = await testHelper.getBlogsInDatabase()

    assert.strictEqual(blogsAtEnd.length, blogsInDb.length - 1)
  })

  test('delete on bad id fails', async () => {
    await api.delete('/api/blogs/badid').expect(400)
  })

  test('update succeeds', async () => {
    const initialBlogs = await testHelper.getBlogsInDatabase()
    const toUpdate = initialBlogs[0]
    console.log('to update', toUpdate)
    const updatedBlog = {
      ...toUpdate,
      title: 'updated_title',
      url: 'updated_url',
      likes: toUpdate.likes + 1,
    }

    await api.put(`/api/blogs/${toUpdate.id}`).send(updatedBlog).expect(200)

    const blogsAtEnd = await testHelper.getBlogsInDatabase()
    const updated = blogsAtEnd[0]

    assert.deepStrictEqual(updated, updatedBlog)
    assert.strictEqual(updated.likes, toUpdate.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
