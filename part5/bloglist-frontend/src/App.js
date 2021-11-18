import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const sortedBlogs = blogs.sort((a, b) => a.likes < b.likes ? 1 : -1)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      showNotification({
        message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
        type: 'success'
      })
    } catch (exception) {
      console.log(exception)
      showNotification({
        message: 'adding blog failed',
        type: 'error'
      })
    }
  }

  const updateBlog = async (id, changedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, changedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch (exception) {
      console.log(exception)
      showNotification({
        message: `updating blog ${changedBlog.title} by ${changedBlog.author} failed`,
        type: 'error'
      })
    }
  }

  const deleteBlog = async (id, blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author} ?`)) {
      try {
        await blogService.deleteOne(id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (exception) {
        console.log(exception)
        showNotification({
          message: `deleting blog ${blog.title} by ${blog.author} failed`,
          type: 'error'
        })
      }
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification({
        message: 'wrong username or password',
        type: 'error'
      })
    }

  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const showNotification = (notification) => {
    setNotification(notification)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      <h2>blogs</h2>

      <Notification notification={notification} />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in <input type="button" value="logout" onClick={handleLogout}></input></p>
          {blogForm()}
        </div>
      }

      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          loggerUsername={user === null ? false : user.username}
          updateBlog={(changedBlog) => updateBlog(blog.id, changedBlog)}
          deleteBlog={() => deleteBlog(blog.id, blog)} />
      )}
    </div>
  )
}

export default App