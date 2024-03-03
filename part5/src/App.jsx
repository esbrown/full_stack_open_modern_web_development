import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import SuccessMessage from './components/SuccessMessage'
import ErrorMessage from './components/ErrorMessage'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const userLocalStorageKey = 'loggedInUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const blogFormRef = useRef()

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

  const handleCreateBlog = async (newBlog) => {
    try {
      const response = await blogService.create(newBlog)
      updateSuccessMessage(`New blog "${newBlog.title}" successfully created`)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(response))
      console.log(response)
    } catch (exception) {
      updateErrorMessage(
        `There was an issue creating your new blog: ${exception.message}`
      )
      console.log('error', exception)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel={'New blog'} ref={blogFormRef}>
      <h2>Create new</h2>
      <BlogForm handleCreateBlog={handleCreateBlog} />
    </Togglable>
  )

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
