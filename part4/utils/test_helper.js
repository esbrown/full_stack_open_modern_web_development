const Blog = require('../models/blog')
const User = require('../models/user')

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

const getBlogsInDatabase = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const getUsersInDatabase = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs,
  getBlogsInDatabase,
  getUsersInDatabase,
}
