import { test, expect } from '@playwright/test'

test.describe('Session Creation', () => {
  test('should display admin panel on home page', async ({ page }) => {
    await page.goto('/')

    // Check for admin panel elements
    await expect(page.getByText('Coding Interview Platform')).toBeVisible()
    await expect(page.getByText('Create a new interview session')).toBeVisible()
    await expect(page.getByPlaceholder('Enter session name')).toBeVisible()
    await expect(page.getByRole('combobox')).toBeVisible()
    await expect(page.getByRole('button', { name: /create session/i })).toBeVisible()
  })

  test('should create a new session and navigate to it', async ({ page }) => {
    await page.goto('/')

    // Fill in session details
    await page.getByPlaceholder('Enter session name').fill('Test Interview Session')
    await page.getByRole('combobox').selectOption('javascript')

    // Create session and wait for navigation
    await page.getByRole('button', { name: /create session/i }).click()

    // Dismiss the alert about clipboard
    page.on('dialog', dialog => dialog.accept())

    // Should navigate to session page
    await expect(page).toHaveURL(/\/session\//)

    // Verify session page elements
    await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/user/i)).toBeVisible()
  })

  test('should show validation error for empty session name', async ({ page }) => {
    await page.goto('/')

    // Try to create session without name
    const createButton = page.getByRole('button', { name: /create session/i })
    await createButton.click()

    // HTML5 validation should prevent submission
    const nameInput = page.getByPlaceholder('Enter session name')
    const validationMessage = await nameInput.evaluate(
      (el) => el.validationMessage
    )
    expect(validationMessage).toBeTruthy()
  })

  test('should create sessions with different languages', async ({ page }) => {
    const languages = ['javascript', 'python', 'java', 'cpp', 'go', 'typescript']

    // Handle alert dialogs (register once, outside the loop)
    page.on('dialog', dialog => dialog.accept())

    for (const language of languages) {
      await page.goto('/')

      await page.getByPlaceholder('Enter session name').fill(`${language} Session`)
      await page.getByRole('combobox').selectOption(language)
      await page.getByRole('button', { name: /create session/i }).click()

      // Wait for navigation and editor
      await expect(page).toHaveURL(/\/session\//)
      await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 })

      // Verify language-specific code template is loaded
      const editorContent = await page.locator('.monaco-editor').textContent()
      expect(editorContent.length).toBeGreaterThan(0)
    }
  })

  test('should copy session link to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    await page.goto('/')

    // Handle alert dialogs
    page.on('dialog', dialog => dialog.accept())

    await page.getByPlaceholder('Enter session name').fill('Clipboard Test')
    await page.getByRole('combobox').selectOption('javascript')
    await page.getByRole('button', { name: /create session/i }).click()

    await expect(page).toHaveURL(/\/session\//)

    // The link should be automatically copied (check for success message if implemented)
    // or manually test clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toContain('/session/')
  })
})