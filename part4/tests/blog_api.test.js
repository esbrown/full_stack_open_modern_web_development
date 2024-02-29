const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const testHelper = require('../utils/test_helper')

const api = supertest(app)

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

test('delete succeeds', async () => {
  const blogsInDb = await testHelper.getBlogsInDatabase()
  const toDelete = blogsInDb[0]

  await api.delete(`/api/blogs/${toDelete.id}`).expect(204)
  const blogsAtEnd = await testHelper.getBlogsInDatabase()
  assert.strictEqual(blogsAtEnd.length, testHelper.initialBlogs.length - 1)
})

test('delete on bad id fails', async () => {
  await api.delete('/api/blogs/badid').expect(500)
})

after(async () => {
  await mongoose.connection.close()
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(testHelper.initialBlogs)
})
