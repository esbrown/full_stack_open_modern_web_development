import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  let mockHandler

  const blog = {
    title: 'title_1',
    author: 'author_1',
    url: 'url_1',
    likes: 10,
    user: {
      username: 'username',
      name: 'name',
      id: 'id',
    },
  }

  beforeEach(() => {
    mockHandler = jest.fn()
    container = render(<Blog blog={blog} updateLikes={mockHandler} />).container
  })

  test('at start the children are not displayed', async () => {
    const shown = container.querySelector('.shownByDefault')
    expect(shown).not.toHaveStyle('display: none')
    const hidden = container.querySelector('.hiddenByDefault')
    expect(hidden).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const shown = container.querySelector('.shownByDefault')
    expect(shown).toHaveStyle('display: none')
    const hidden = container.querySelector('.hiddenByDefault')
    expect(hidden).not.toHaveStyle('display: none')
  })

  test('clicking the button twice event handler twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
