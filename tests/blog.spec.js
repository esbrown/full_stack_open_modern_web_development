const { test, expect, beforeEach, describe } = require('@playwright/test')

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
      await page.getByTestId('username').fill('ethan')
      await page.getByTestId('password').fill('thisismypassword')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('eth logged-in')).toBeVisible()
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
})
