const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  // Separate password validation due to hashing
  if (!body.password) {
    return response.status(400).json({
      error: 'User validation failed: `password` is required.'
    })
  } else if (body.password.length < 3) {
    return response.status(400).json({
      error: 'User validation failed: `password` is shorter than the minimum allowed length (3).'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .find({}).populate('blogs', { title: 1, author: 1, url: 1 })

  response.json(users)
})

module.exports = usersRouter