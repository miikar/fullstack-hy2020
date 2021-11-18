import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('when clicking button, should call create blog with correct details', () => {
    const createBlog = jest.fn()

    const component = render(
      <BlogForm createBlog={createBlog} />
    )

    const titleInput = component.container.querySelector('#title')
    const authorInput = component.container.querySelector('#author')
    const urlInput = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(titleInput, {
      target: { value: 'This is a test blog' }
    })
    fireEvent.change(authorInput, {
      target: { value: 'Test Author' }
    })
    fireEvent.change(urlInput, {
      target: { value: 'https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16' }
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('This is a test blog' )
    expect(createBlog.mock.calls[0][0].author).toBe('Test Author' )
    expect(createBlog.mock.calls[0][0].url).toBe('https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16' )

  })
})
