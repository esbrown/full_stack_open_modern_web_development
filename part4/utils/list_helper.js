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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
