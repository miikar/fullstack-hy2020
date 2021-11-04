const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

// Setup
beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

// Test cases
test('all blogs are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog has unique property called id', async () => {
  const blogs = await helper.blogsInDb()
  expect(blogs[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'This is a test blog',
    author: 'Test User',
    url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12',
    likes: 1234
  }

  await api
    .post('/api/blogs')
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

test('new blog has 0 likes by default', async () => {
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
    .send(blogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
})

test('new blog must have title and url', async () => {
  const newBlog = {
    author: 'Test User',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

// Close db connection
afterAll(() => {
  mongoose.connection.close()
})
