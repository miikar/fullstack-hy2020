import React, { useState } from 'react'

const Blog = ({ loggerUsername, blog, updateBlog, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const simpleBlog = () => (
    <div>
      {blog.title} {blog.author}
      <button onClick={toggleDetails}>view</button>
    </div>
  )

  const increaseBlogLikes = () => {
    updateBlog({
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    })
  }

  const detailedBlog = () => (
    <div>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>likes {blog.likes}<button onClick={increaseBlogLikes}>like</button></div>
      <div>{blog.user.name}</div>
      <div>
        {blog.user.username === loggerUsername
          ? <button onClick={deleteBlog}>remove</button>
          : ''}</div>
    </div>
  )

  return (
    <div style={blogStyle} className='blog'>
      {!showDetails
        ? simpleBlog()
        : detailedBlog()}
    </div>
  )}

export default Blog
