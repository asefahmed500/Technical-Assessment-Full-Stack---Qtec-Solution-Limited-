import { test, expect } from "@playwright/test"

test.describe("Task Manager E2E Tests", () => {
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = "testpassword123"

  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should redirect to login when not authenticated", async ({ page }) => {
    await expect(page).toHaveURL(/\/login/)
  })

  test("should allow user registration", async ({ page }) => {
    await page.goto("/register")

    await page.fill('input[id="name"]', "Test User")
    await page.fill('input[id="email"]', testEmail)
    await page.fill('input[id="password"]', testPassword)

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/tasks/, { timeout: 10000 })
  })

  test("should allow user login", async ({ page }) => {
    await page.goto("/login")

    await page.fill('input[id="email"]', testEmail)
    await page.fill('input[id="password"]', testPassword)

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/tasks/, { timeout: 10000 })
  })

  test("should create a task", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[id="email"]', testEmail)
    await page.fill('input[id="password"]', testPassword)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/tasks/, { timeout: 10000 })

    await page.click('button:has-text("Add Task")')
    await page.fill('input[id="title"]', "Test Task")
    await page.fill('textarea[id="description"]', "Test Description")
    await page.click('button:has-text("Create Task")')

    await expect(page.locator("text=Test Task")).toBeVisible()
  })

  test("should update task status", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[id="email"]', testEmail)
    await page.fill('input[id="password"]', testPassword)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/tasks/, { timeout: 10000 })

    const select = page.locator('select:has-text("Pending")').first()
    if (select) {
      await select.selectOption("IN_PROGRESS")
    }

    await expect(page.locator('text="In Progress"').first()).toBeVisible()
  })

  test("should delete a task", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[id="email"]', testEmail)
    await page.fill('input[id="password"]', testPassword)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/tasks/, { timeout: 10000 })

    const deleteButton = page
      .locator('button:has([class*="lucide-trash"])')
      .first()
    await deleteButton.click()

    await expect(page.locator("text=Test Task")).not.toBeVisible()
  })

  test("should filter tasks by status", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[id="email"]', testEmail)
    await page.fill('input[id="password"]', testPassword)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/tasks/, { timeout: 10000 })

    await page.click('button:has-text("All Status")')
    await page.click("text=Completed")

    await expect(page.locator('button:has-text("Completed")')).toBeVisible()
  })
})
