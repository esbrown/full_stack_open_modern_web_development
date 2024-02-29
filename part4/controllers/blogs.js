const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (!body.title) {
    return response.status(400).json({
      error: 'title missing',
    })
  }
  if (!body.url) {
    return response.status(400).json({
      error: 'url missing',
    })
  }
  const blog = new Blog({ ...body, likes: body.likes ? body.likes : 0 })

  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter
