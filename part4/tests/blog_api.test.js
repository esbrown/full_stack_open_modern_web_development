const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const testHelper = require('../utils/test_helper')

const api = supertest(app)

let currToken = ''
const userName = 'ethan'
const pass = 'thisismypassword'

beforeEach(async () => {
  await User.deleteMany({})

  await Blog.deleteMany({})
  await Blog.insertMany(testHelper.initialBlogs)

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
    .set('Authorization', `Bearer ${currToken}`)
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
    .set('Authorization', `Bearer ${currToken}`)
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

test('delete succeeds', async () => {
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

  const blogsInDb = await testHelper.getBlogsInDatabase()
  const toDelete = blogsInDb[0]

  await api
    .delete(`/api/blogs/${toDelete.id}`)
    .set('Authorization', `Bearer ${currToken}`)
    .expect(204)
  const blogsAtEnd = await testHelper.getBlogsInDatabase()

  assert.strictEqual(blogsAtEnd.length, blogsInDb.length - 1)
})

test('delete on bad id fails', async () => {
  await api
    .delete('/api/blogs/badid')
    .set('Authorization', `Bearer ${currToken}`)
    .expect(400)
})

test('update succeeds', async () => {
  const initialBlogs = await testHelper.getBlogsInDatabase()
  const toUpdate = initialBlogs[0]
  const updatedBlog = {
    ...toUpdate,
    title: 'updated_title',
    url: 'updated_url',
    likes: toUpdate.likes + 1,
  }

  const updated = await api
    .put(`/api/blogs/${toUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
  assert.deepStrictEqual(updated.body, updatedBlog)
  assert.strictEqual(updated.body.likes, toUpdate.likes + 1)
})

after(async () => {
  await mongoose.connection.close()
})
