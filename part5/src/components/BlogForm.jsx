import { useState } from 'react'

const BlogForm = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlogSubmit = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url,
    }
    handleCreateBlog(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleBlogSubmit}>
      <div>
        title{' '}
        <input
          type='text'
          value={title}
          name='Title'
          id='title-input'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author{' '}
        <input
          type='text'
          value={author}
          name='Author'
          id='author-input'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url{' '}
        <input
          type='text'
          value={url}
          name='Url'
          id='url-input'
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  )
}

export default BlogForm
