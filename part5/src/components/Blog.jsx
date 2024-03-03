import { useState } from 'react'

const Blog = ({ blog, updateLikes, canDelete, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [detailsVisible, setDetailsVisible] = useState(false)

  const hideWhenVisible = { display: detailsVisible ? 'none' : '' }
  const showWhenVisible = { display: detailsVisible ? '' : 'none' }

  const handleLikeClick = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    console.log('new blog', updatedBlog)
    updateLikes(updatedBlog)
  }

  const handleDeleteClick = () => {
    if (
      window.confirm(
        `Are you sure you want to remove blog ${blog.title} by ${blog.author}?`
      )
    ) {
      handleDelete(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible}>
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setDetailsVisible(false)}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={handleLikeClick}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {canDelete ? (
          <button onClick={() => handleDeleteClick(blog)}>remove</button>
        ) : null}
      </div>
    </div>
  )
}

export default Blog
