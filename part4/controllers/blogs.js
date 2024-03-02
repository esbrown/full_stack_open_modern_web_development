const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const userExtractor = require('../utils/user_extractor')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

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
  const blog = new Blog({
    ...body,
    likes: body.likes ? body.likes : 0,
    user: user.id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blogId = request.params.id
  const blog = await Blog.findById(blogId)

  if (blog.user.toString() !== user.id.toString()) {
    return response
      .status(401)
      .json({ error: 'only the blog owner can delete' })
  }

  await Blog.findByIdAndDelete(blogId)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true, context: 'query' }
  )
  response.json(updatedBlog)
})

module.exports = blogsRouter
