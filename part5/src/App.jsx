import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import SuccessMessage from './components/SuccessMessage'
import ErrorMessage from './components/ErrorMessage'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const userLocalStorageKey = 'loggedInUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      blogService.setToken(user.token)
      window.localStorage.setItem(userLocalStorageKey, JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      updateErrorMessage('Username or password is incorrect')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(userLocalStorageKey)
    blogService.setToken('')
    window.location.reload()
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem(userLocalStorageKey)
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const updateSuccessMessage = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const updateErrorMessage = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: title,
        author: author,
        url: url,
      }
      const response = await blogService.create(newBlog)
      updateSuccessMessage(`New blog "${title}" successfully created`)
      setTitle('')
      setAuthor('')
      setUrl('')
      setBlogFormVisible(false)
      setBlogs(blogs.concat(response))
      console.log(response)
    } catch (exception) {
      updateErrorMessage(
        `There was an issue creating your new blog: ${exception.message}`
      )
      console.log('error', exception)
    }
  }

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>New blog</button>
        </div>
        <div style={showWhenVisible}>
          <h2>Create new</h2>
          <BlogForm
            title={title}
            author={author}
            url={url}
            handleSetTitle={({ target }) => setTitle(target.value)}
            handleSetAuthor={({ target }) => setAuthor(target.value)}
            handleSetUrl={({ target }) => setUrl(target.value)}
            handleBlogSubmit={handleBlogSubmit}
          />
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SuccessMessage message={successMessage} />
      <ErrorMessage message={errorMessage} />

      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          <LoginForm
            username={username}
            password={password}
            handleSetUsername={({ target }) => setUsername(target.value)}
            handleSetPassword={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <div>
            {user.name} logged-in{' '}
            <button onClick={handleLogout}>log out</button>
          </div>
          <br />
          {blogForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
