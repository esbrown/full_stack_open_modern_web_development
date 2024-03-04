import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
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
    container = render(<Blog blog={blog} />).container
  })

  test('at start the children are not displayed', async () => {
    const shown = container.querySelector('.shownByDefault')
    expect(shown).not.toHaveStyle('display: none')
    const hidden = container.querySelector('.hiddenByDefault')
    expect(hidden).toHaveStyle('display: none')
  })
})
