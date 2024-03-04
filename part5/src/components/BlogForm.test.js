import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let container
  let mockHandler

  const blog = {
    title: 'title_1',
    author: 'author_1',
    url: 'url_1',
  }

  beforeEach(() => {
    mockHandler = jest.fn()
    container = render(<BlogForm handleCreateBlog={mockHandler} />).container
  })

  test('test that handleCreateBlog called with correct params', async () => {
    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')

    const createButton = screen.getByText('create')

    const user = userEvent.setup()
    await user.type(titleInput, blog.title)
    await user.type(authorInput, blog.author)
    await user.type(urlInput, blog.url)
    await user.click(createButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0]).toStrictEqual(blog)
  })
})
