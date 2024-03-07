const { test, expect, beforeEach, describe } = require('@playwright/test')

const loginSuccessfully = async (page) => {
  await page.getByTestId('username').fill('ethan')
  await page.getByTestId('password').fill('thisismypassword')

  await page.getByRole('button', { name: 'login' }).click()

  await expect(page.getByText('eth logged-in')).toBeVisible()
}

const loginOtherUser = async (page) => {
  await page.getByTestId('username').fill('root')
  await page.getByTestId('password').fill('password')

  await page.getByRole('button', { name: 'login' }).click()

  await expect(page.getByText('Superuser logged-in')).toBeVisible()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'eth',
        username: 'ethan',
        password: 'thisismypassword',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = await page.$('[data-testid="login-form"]')
    await expect(loginForm).toBeTruthy()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginSuccessfully(page)
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('ethan')
      await page.getByTestId('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('Username or password is incorrect')
      ).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginSuccessfully(page)
    })

    test('a new blog can be created', async ({ page }) => {
      const testTitle = 'This is a new blog!'
      await page.getByRole('button', { name: 'New blog' }).click()
      await page.getByTestId('title-input').fill(testTitle)
      await page.getByTestId('author-input').fill('author!')
      await page.getByTestId('url-input').fill('url.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(
        page.getByText(`New blog "${testTitle}" successfully created`)
      ).toBeVisible()
    })

    test('like works', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).first().click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('Like count updated')).toBeVisible()
    })

    test('delete works', async ({ page }) => {
      page.on('dialog', async (dialog) => {
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'view' }).last().click()
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('Successfully deleted')).toBeVisible()
    })

    test("cannot delete other user's post", async ({ page }) => {
      await page.getByRole('button', { name: 'log out' }).click()
      await page.goto('http://localhost:5173')
      await loginOtherUser(page)
      await page.getByRole('button', { name: 'view' }).last().click()
      await expect(page.getByText('remove')).not.toBeVisible()
    })
  })
})
