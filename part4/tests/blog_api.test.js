const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'title_1',
    author: 'author_1',
    url: 'url_1',
    likes: 10,
  },
  {
    title: 'title_2',
    author: 'author_2',
    url: 'url_2',
    likes: 20,
  },
]

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('verify "id" name', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
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

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length + 1)

  const titles = response.body.map((blog) => blog.title)
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

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length + 1)

  const newBlog = response.body.filter((blog) => blog.title === 'title_3')[0]
  assert(newBlog.likes === 0)
})

after(async () => {
  await mongoose.connection.close()
})

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})
