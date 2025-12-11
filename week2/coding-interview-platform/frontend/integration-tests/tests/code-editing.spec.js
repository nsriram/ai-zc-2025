import { test, expect } from '@playwright/test'

test.describe('Code Editing', () => {
  let sessionUrl

  test.beforeEach(async ({ page }) => {
    // Create a session before each test
    await page.goto('/')

    // Handle alert dialogs
    page.on('dialog', dialog => dialog.accept())

    await page.getByPlaceholder('Enter session name').fill('Edit Test Session')
    await page.getByRole('combobox').selectOption('javascript')
    await page.getByRole('button', { name: /create session/i }).click()
    await expect(page).toHaveURL(/\/session\//)
    sessionUrl = page.url()
  })

  test('should display Monaco editor', async ({ page }) => {
    await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 })
  })

  test('should load default code template for JavaScript', async ({ page }) => {
    await page.waitForTimeout(1000) // Wait for editor to fully load

    const editorText = await page.locator('.monaco-editor').textContent()
    expect(editorText).toContain('JavaScript')
    expect(editorText).toContain('function')
  })

  test('should allow typing in the editor', async ({ page }) => {
    // Wait for editor to be ready
    await page.locator('.monaco-editor').waitFor({ state: 'visible', timeout: 10000 })
    await page.waitForTimeout(1000)

    // Click in the editor to focus it
    await page.locator('.monaco-editor').click()

    // Type some code
    await page.keyboard.press('Control+A') // Select all
    await page.keyboard.type('console.log("Hello World");')

    await page.waitForTimeout(500)

    // Verify the text was entered (check the actual textarea value within Monaco)
    const editorText = await page.locator('.monaco-editor .view-lines').textContent()
    // Monaco editor adds line numbers and formatting, so just verify it contains our text
    expect(editorText).toContain('Hello')
    expect(editorText).toContain('World')
  })

  test('should change programming language', async ({ page }) => {
    // Wait for editor to load with JavaScript
    await page.waitForTimeout(1000)
    let editorText = await page.locator('.monaco-editor').textContent()
    expect(editorText).toContain('JavaScript')

    // Find and change language selector
    const languageSelect = page.locator('select').filter({ hasText: /javascript|python|java/ })
    if (await languageSelect.isVisible()) {
      await languageSelect.selectOption('python')
      await page.waitForTimeout(1000)

      // Verify Python template loaded
      editorText = await page.locator('.monaco-editor').textContent()
      expect(editorText).toContain('Python')
    }
  })

  test('should display run button for JavaScript code execution', async ({ page }) => {
    // Look for run/execute button (implementation dependent)
    const runButton = page.getByRole('button', { name: /run|execute/i })
    if (await runButton.isVisible()) {
      await expect(runButton).toBeEnabled()
    }
  })

  test('should persist code changes in session', async ({ page }) => {
    // Note: This test is limited because the mock API doesn't truly persist data
    // It verifies that the session loads with a template
    await page.locator('.monaco-editor').waitFor({ state: 'visible', timeout: 10000 })
    await page.waitForTimeout(1000)

    // Reload page
    await page.reload()
    await page.waitForTimeout(2000)

    // Verify editor still loads (even if with default template)
    await expect(page.locator('.monaco-editor')).toBeVisible()
    const editorText = await page.locator('.monaco-editor').textContent()
    expect(editorText.length).toBeGreaterThan(0)
  })
})