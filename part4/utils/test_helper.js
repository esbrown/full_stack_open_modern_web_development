const Blog = require('../models/blog')

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
  const notes = await Blog.find({})
  return notes.map((note) => note.toJSON())
}

module.exports = {
  initialBlogs,
  getBlogsInDatabase,
}
