const lodash = require('lodash')
const blog = require('../models/blog')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, currBlog) => {
    return sum + currBlog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  return blogs.reduce((max, currBlog) => {
    return currBlog.likes > max.likes ? currBlog : max
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const map = lodash.countBy(blogs, (blog) => blog.author)
  const result = Object.keys(map).reduce((a, b) => (map[a] > map[b] ? a : b))
  return {
    author: result,
    blogs: map[result],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const mapAuthorToTotalLikes = {}
  blogs.forEach((blog) => {
    mapAuthorToTotalLikes[blog.author] =
      (mapAuthorToTotalLikes[blog.author] || 0) + blog.likes
  })
  const authorWithMostLikes = Object.keys(mapAuthorToTotalLikes).reduce(
    (a, b) => (mapAuthorToTotalLikes[a] > mapAuthorToTotalLikes[b] ? a : b)
  )
  return {
    author: authorWithMostLikes,
    likes: mapAuthorToTotalLikes[authorWithMostLikes],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
