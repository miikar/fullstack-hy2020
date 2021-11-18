import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  const updateBlog = jest.fn()

  beforeEach(() => {
    const blog = {
      title: 'Test title',
      author: 'Test author',
      url: 'Test url',
      likes: 1234,
      user: {
        name: 'Test user',
        username: 'testuser'
      }
    }

    component = render(
      <Blog blog={blog} updateBlog={updateBlog}/>
    )
  })

  test('by default renders only title and author', () => {
    const div = component.container.querySelector('.blog')
    // console.log(prettyDOM(div))

    expect(div).toHaveTextContent('Test title')
    expect(div).toHaveTextContent('Test author')
    expect(div).not.toHaveTextContent('Test url')
    expect(div).not.toHaveTextContent('123')
  })

  test('after clicking button, renders url and number likes', () => {
    const div = component.container.querySelector('.blog')
    const button = component.getByText('view')

    fireEvent.click(button)

    expect(div).toHaveTextContent('Test title')
    expect(div).toHaveTextContent('Test author')
    expect(div).toHaveTextContent('Test url')
    expect(div).toHaveTextContent('1234')
  })

  test('clicking like button should fire method for updating likes', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
