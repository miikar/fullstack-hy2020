import blogService from '../services/blogs'

const byLikes = (b1, b2) => b2.likes - b1.likes

const blogReducer = (state = [], action) => {
  switch(action.type) {
  case 'LIKE':
    return state.map(b => b.id !== action.data.id ? b : action.data).sort(byLikes)
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'REMOVE_BLOG':
    return state.filter(b => b.id !== action.data.id).sort(byLikes)
  case 'INIT_BLOGS':
    return action.data.sort(byLikes)
  default:
    return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    try {
      const blogs = await blogService.getAll()
      dispatch({
        type: 'INIT_BLOGS',
        data: blogs,
      })
    } catch(exception) {
      console.log(exception)
    }
  }
}

export const createBlog = (content) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(content)
      dispatch({
        type: 'NEW_BLOG',
        data: newBlog
      })
    } catch(exception) {
      console.log(exception)
    }
  }
}

export const removeBlog = (blog) => {
  return async dispatch => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.remove(blog.id)
        dispatch({
          type: 'REMOVE_BLOG',
          data: blog
        })
      }
    } catch(exception) {
      console.log(exception)
    }
  }
}

export const like = (blog) => {
  return async dispatch => {
    try {
      const likedBlog = { ...blog, likes: blog.likes + 1 }
      await blogService.update({ ...likedBlog, user: blog.user.id })
      dispatch({
        type: 'LIKE',
        data: likedBlog
      })
    } catch(exception) {
      console.log(exception)
    }
  }
}

export default blogReducer
