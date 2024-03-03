import { useState } from 'react'

const Blog = ({ blog }) => {
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
          likes {blog.likes}{' '}
          <button onClick={() => console.log('like clicked')}>like</button>
        </div>
        <div>{blog.user.name}</div>
      </div>
    </div>
  )
}

export default Blog
