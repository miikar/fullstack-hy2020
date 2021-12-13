import React from 'react'
import Blog from './Blog'
import { useSelector } from 'react-redux'
// import { initializeblogs } from '../reducers/blogReducer'

export const BlogList = ({ user }) => {
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(initializeblogs())
  // }, [])

  const blogs = useSelector(({ blogs }) => blogs)

  return (
    <div>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          own={user.username===blog.user.username}
        />
      )}
    </div>
  )
}

export default BlogList
