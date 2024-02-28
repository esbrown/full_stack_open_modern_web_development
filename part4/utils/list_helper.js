const lodash = require('lodash')

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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
