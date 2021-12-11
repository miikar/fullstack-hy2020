const _ = require('lodash')
const { flow, countBy, toPairs, maxBy, tail, groupBy, sumBy, map } = _

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (max, item) => {
    return (max.likes > item.likes) ? max : item
  }
  
  const topBlog = blogs.reduce(reducer, {})

  return blogs.length === 0
    ? null
    : {
      title: topBlog.title,
      author: topBlog.author,
      likes: topBlog.likes,
    }
}

const mostBlogs = (blogs) => {
  const fn = flow(
    arr => countBy(arr, 'author'),
    toPairs,
    arr => maxBy(arr, tail)
  )

  const topAuthor = fn(blogs)

  return blogs.length === 0
    ? null
    : {
      author: topAuthor[0],
      blogs: topAuthor[1]
    }
}

const mostLikes = (blogs) => {
  const fn = flow(
    arr => groupBy(arr, 'author'),
    arr => map(arr, (items, author) => { return { author: author, likes: sumBy(items, 'likes') }}),
    arr => maxBy(arr, 'likes')
  )

  const topLiked = fn(blogs)

  return blogs.length === 0
    ? null
    : topLiked
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}