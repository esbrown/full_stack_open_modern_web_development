const BlogForm = ({
  title,
  author,
  url,
  handleSetTitle,
  handleSetAuthor,
  handleSetUrl,
  handleBlogSubmit,
}) => (
  <form onSubmit={handleBlogSubmit}>
    <div>
      title{' '}
      <input type='text' value={title} name='Title' onChange={handleSetTitle} />
    </div>
    <div>
      author{' '}
      <input
        type='text'
        value={author}
        name='Author'
        onChange={handleSetAuthor}
      />
    </div>
    <div>
      url <input type='text' value={url} name='Url' onChange={handleSetUrl} />
    </div>
    <button type='submit'>create</button>
  </form>
)

export default BlogForm
