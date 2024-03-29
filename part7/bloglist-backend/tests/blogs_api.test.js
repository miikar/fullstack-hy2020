const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

// Add test users
beforeEach(async () => {
  await User.deleteMany({})

  for (let user of helper.initialUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const userObject = new User({
      username: user.username,
      name: user.name,
      passwordHash,
    })

    await userObject.save()
  }
})

// Add test blogs
beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

// Test cases
describe('blogs in database', () => {
  test('are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('have unique property called id', async () => {
    const blogs = await api
      .get('/api/blogs')
    expect(blogs.body[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  // Login
  var testLoginToken = null

  beforeEach(async () => {
    const loginUser = helper.initialUsers[0]
    const tokenResponse = await api
      .post('/api/login')
      .send(loginUser)
    testLoginToken = `bearer ${tokenResponse.body.token}`
  })

  test('succeeds with status code 201 with valid data and token', async () => {
    const newBlog = {
      title: 'This is a test blog',
      author: 'Test User',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12',
      likes: 1234
    }
  
    await api
      .post('/api/blogs')
      .set({ Authorization: testLoginToken})
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
    const blogTitles = blogsAtEnd.map(n => n.title)
    expect(blogTitles).toContain(
      'This is a test blog'
    )
  })

  test('fails with status code 401 with invalid token', async () => {
    const newBlog = {
      title: 'This is a test blog',
      author: 'Test User',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12',
      likes: 1234
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  
    const blogTitles = blogsAtEnd.map(n => n.title)
    expect(blogTitles).not.toContain(
      'This is a test blog'
    )
  })

  test('sets likes to 0 if not specified in request', async () => {
    // Expect likes to be as specified in request
    const blogsAtStart = await helper.blogsInDb()

    expect(blogsAtStart[0].likes).toBe(helper.initialBlogs[0].likes)
    // Expect likes to be 0 if unspecified in request
    const blogWithoutLikes = {
      title: 'Blog without likes',
      author: 'Test User',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12',
    }
  
    const response = await api
      .post('/api/blogs')
      .set({ Authorization: testLoginToken})
      .send(blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body.likes).toBe(0)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  })
  
  test('fails with statuscode 400 if title is invalid', async () => {
    const newBlog = {
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12',
      author: 'Test User',
    }
  
    const response = await api
      .post('/api/blogs')
      .set({ Authorization: testLoginToken})
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(response.body.error).toContain('title missing')
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('fails with statuscode 400 if url is invalid', async () => {
    const newBlog = {
      title: 'Test title',
      author: 'Test User',
    }
  
    const response = await api
      .post('/api/blogs')
      .set({ Authorization: testLoginToken})
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(response.body.error).toContain('url missing')
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})


describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid and user token is valid', async () => {
    const loginUser = helper.initialUsers[0]
    // Login
    let response = await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
    
    const token = `bearer ${response.body.token}`

    // Create blog
    const newBlog = {
      title: 'This is a test blog',
      author: 'Test User',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12',
      likes: 1234
    }

    response = await api
      .post('/api/blogs')
      .set({ Authorization: token })
      .send(newBlog)
      .expect(201)

    const blogToDelete = response.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: token })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with status code 401 if token is invalid', async () => {
    const loginUser = helper.initialUsers[0]
    const loginUser2 = helper.initialUsers[1]

    // Login
    let response = await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
    
    const token = `bearer ${response.body.token}`

    // Create blog
    const newBlog = {
      title: 'This is a test blog',
      author: 'Test User',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12',
      likes: 1234
    }

    response = await api
      .post('/api/blogs')
      .set({ Authorization: token })
      .send(newBlog)
      .expect(201)

    const blogToDelete = response.body

    // Another login
    response = await api
      .post('/api/login')
      .send(loginUser2)
      .expect(200)
    
    const token2 = `bearer ${response.body.token}`

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: token2 })
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).toContain(blogToDelete.title)
  })
})

describe('when updating a specific blog', () => {
  test('likes are succesfully updated if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newBlog = {
      likes: 77
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const updated = blogsAtEnd.find(item => item.id === blogToUpdate.id)
    expect(updated.likes).toBe(newBlog.likes)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a new username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'admin',
      name: 'Admin User',
      password: 'salasana',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salasana',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Testuser',
      password: 'salasana'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'Testuser',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`password` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'Testuser',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`password` is shorter than the minimum allowed length')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'te',
      name: 'Testuser',
      password: 'salasana',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Path `username` (`te`) is shorter than the minimum allowed length')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

// Close db connection
afterAll(() => {
  mongoose.connection.close()
})
