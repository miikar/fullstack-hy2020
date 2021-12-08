const router = require('express').Router()
const Note = require('../../../part4/bloglist/models/blog')
const User = require('../../../part4/bloglist/models/user')

router.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
