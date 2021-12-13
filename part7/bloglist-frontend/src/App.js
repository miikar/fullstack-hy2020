import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import NewBlog from './components/NewBlog'

// import blogService from './services/blogs'

// import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { logout, initializeUser } from './reducers/userReducer'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector(({ user }) => user)
  const blogFormRef = React.createRef()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, [dispatch])

  if ( !user ) {
    return (
      <div>
        <h2>login to application</h2>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

      <p>
        {user.name} logged in <button onClick={() => dispatch(logout())}>logout</button>
      </p>

      <Togglable buttonLabel='create new blog'  ref={blogFormRef}>
        <NewBlog blogFormRef={blogFormRef}/>
      </Togglable>

      <BlogList user={user}/>
    </div>
  )
}

export default App
