import { test, expect } from '@playwright/test'

test.describe('Real-time Collaboration', () => {
  test('should sync code changes between two users', async ({ browser }) => {
    // Create two browser contexts (two users)
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    // Handle alert dialogs
    page1.on('dialog', dialog => dialog.accept())
    page2.on('dialog', dialog => dialog.accept())

    // User 1 creates a session
    await page1.goto('/')
    await page1.getByPlaceholder('Enter session name').fill('Collab Test')
    await page1.getByRole('combobox').selectOption('javascript')
    await page1.getByRole('button', { name: /create session/i }).click()
    await expect(page1).toHaveURL(/\/session\//)

    const sessionUrl = page1.url()

    // Wait for editor to load
    await page1.locator('.monaco-editor').waitFor({ state: 'visible', timeout: 10000 })
    await page1.waitForTimeout(1000)

    // User 2 joins the same session
    await page2.goto(sessionUrl)
    await page2.locator('.monaco-editor').waitFor({ state: 'visible', timeout: 10000 })
    await page2.waitForTimeout(1000)

    // Verify both users can see the editor
    await expect(page1.locator('.monaco-editor')).toBeVisible()
    await expect(page2.locator('.monaco-editor')).toBeVisible()

    // User 1 types code
    await page1.locator('.monaco-editor').click()
    await page1.keyboard.press('Control+A')
    await page1.keyboard.type('const message = "Hello from User 1";')

    // Wait for sync
    await page2.waitForTimeout(2000)

    // User 2 should see the change (check view-lines for text content)
    const page2Text = await page2.locator('.monaco-editor .view-lines').textContent()
    expect(page2Text).toContain('Hello')
    expect(page2Text).toContain('User')

    // User 2 types code
    await page2.locator('.monaco-editor').click()
    await page2.keyboard.press('End')
    await page2.keyboard.press('Enter')
    await page2.keyboard.type('console.log(message);')

    // Wait for sync
    await page1.waitForTimeout(2000)

    // User 1 should see User 2's change
    const page1Text = await page1.locator('.monaco-editor').textContent()
    expect(page1Text).toContain('console.log(message)')

    await context1.close()
    await context2.close()
  })

  test('should update user count when users join', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    // Handle alert dialogs
    page1.on('dialog', dialog => dialog.accept())

    // User 1 creates session
    await page1.goto('/')
    await page1.getByPlaceholder('Enter session name').fill('User Count Test')
    await page1.getByRole('combobox').selectOption('javascript')
    await page1.getByRole('button', { name: /create session/i }).click()
    await expect(page1).toHaveURL(/\/session\//)

    const sessionUrl = page1.url()
    await page1.waitForTimeout(2000)

    // Check initial user count
    const userCountText1 = await page1.locator('body').textContent()
    expect(userCountText1).toMatch(/1\s+user/)

    // User 2 joins
    await page2.goto(sessionUrl)
    await page2.locator('.monaco-editor').waitFor({ state: 'visible', timeout: 10000 })
    await page2.waitForTimeout(2000)

    // Both should see 2 users
    const userCountText1After = await page1.locator('body').textContent()
    const userCountText2 = await page2.locator('body').textContent()

    expect(userCountText1After).toMatch(/2\s+user/)
    expect(userCountText2).toMatch(/2\s+user/)

    await context1.close()
    await context2.close()
  })

  test('should sync language changes between users', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    // Handle alert dialogs
    page1.on('dialog', dialog => dialog.accept())

    // User 1 creates session with JavaScript
    await page1.goto('/')
    await page1.getByPlaceholder('Enter session name').fill('Language Sync Test')
    await page1.getByRole('combobox').selectOption('javascript')
    await page1.getByRole('button', { name: /create session/i }).click()
    await expect(page1).toHaveURL(/\/session\//)

    const sessionUrl = page1.url()
    await page1.waitForTimeout(1000)

    // User 2 joins
    await page2.goto(sessionUrl)
    await page2.locator('.monaco-editor').waitFor({ state: 'visible', timeout: 10000 })
    await page2.waitForTimeout(1000)

    // Verify both see JavaScript
    let page1Text = await page1.locator('.monaco-editor').textContent()
    let page2Text = await page2.locator('.monaco-editor').textContent()
    expect(page1Text).toContain('JavaScript')
    expect(page2Text).toContain('JavaScript')

    // User 1 changes to Python
    const languageSelect = page1.locator('select').filter({ hasText: /javascript|python/ })
    if (await languageSelect.isVisible()) {
      await languageSelect.selectOption('python')
      await page1.waitForTimeout(2000)

      // Both should see Python template
      page1Text = await page1.locator('.monaco-editor').textContent()
      page2Text = await page2.locator('.monaco-editor').textContent()
      expect(page1Text).toContain('Python')
      expect(page2Text).toContain('Python')
    }

    await context1.close()
    await context2.close()
  })

  test('should update user count when user disconnects', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    // Handle alert dialogs
    page1.on('dialog', dialog => dialog.accept())

    // User 1 creates session
    await page1.goto('/')
    await page1.getByPlaceholder('Enter session name').fill('Disconnect Test')
    await page1.getByRole('combobox').selectOption('javascript')
    await page1.getByRole('button', { name: /create session/i }).click()
    await expect(page1).toHaveURL(/\/session\//)

    const sessionUrl = page1.url()
    await page1.waitForTimeout(1000)

    // User 2 joins
    await page2.goto(sessionUrl)
    await page2.locator('.monaco-editor').waitFor({ state: 'visible', timeout: 10000 })
    await page2.waitForTimeout(2000)

    // Should show 2 users
    let userCountText = await page1.locator('body').textContent()
    expect(userCountText).toMatch(/2\s+user/)

    // User 2 disconnects
    await page2.close()
    await page1.waitForTimeout(2000)

    // Should show 1 user
    userCountText = await page1.locator('body').textContent()
    expect(userCountText).toMatch(/1\s+user/)

    await context1.close()
    await context2.close()
  })
})