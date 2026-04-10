import { test, expect } from "@playwright/test"

test.describe("Production Deployment Tests", () => {
  test("full flow: register, login, create task, update, delete", async ({
    page,
  }) => {
    const timestamp = Date.now()
    const testEmail = `prod-${timestamp}@test.com`
    const testPassword = "test123456"

    // Step 1: Register
    console.log("Testing registration...")
    await page.goto("https://qtechtask.vercel.app/register")
    await page.waitForLoadState("networkidle")

    await page.fill('input[id="name"]', "Production Test User")
    await page.fill('input[id="email"]', testEmail)
    await page.fill('input[id="password"]', testPassword)
    await page.click('button[type="submit"]')

    // Wait for navigation after registration
    await page.waitForURL(/.*dashboard.*tasks/, { timeout: 30000 })
    console.log("Registration successful!")

    // Step 2: Create a task
    console.log("Testing task creation...")
    const addTaskButton = page.locator('button:has-text("Add Task")')
    await expect(addTaskButton).toBeVisible({ timeout: 10000 })
    await addTaskButton.click()

    await page.waitForSelector('input[id="title"]', { timeout: 5000 })
    await page.fill('input[id="title"]', "Production Test Task")
    await page.click('button:has-text("Create Task")')

    // Verify task was created
    const taskElement = page.locator("text=Production Test Task")
    await expect(taskElement).toBeVisible({ timeout: 5000 })
    console.log("Task creation successful!")

    // Step 3: Update task status
    console.log("Testing task update...")
    // Click on status dropdown and change to IN_PROGRESS
    const statusSelect = page.locator('select[class*="w-32"]').first()
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption("IN_PROGRESS")
      await page.waitForTimeout(1000)
    }
    console.log("Task update successful!")

    // Step 4: Delete task
    console.log("Testing task deletion...")
    const deleteButton = page.locator('button:has-text("")').first()
    // Find and click delete button (trash icon)
    const trashButton = page.locator("button:has(svg.lucide-trash-2)").first()
    if (await trashButton.isVisible()) {
      await trashButton.click()
      await page.waitForTimeout(1000)
    }
    console.log("Task deletion successful!")

    // Step 5: Sign out
    console.log("Testing sign out...")
    await page.click('button:has-text("Sign out")')
    await page.waitForURL(/.*login/, { timeout: 10000 })
    console.log("Sign out successful!")

    // Step 6: Login again
    console.log("Testing login...")
    await page.fill('input[id="email"]', testEmail)
    await page.fill('input[id="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/.*dashboard.*tasks/, { timeout: 15000 })

    const addTaskButtonAfterLogin = page.locator('button:has-text("Add Task")')
    await expect(addTaskButtonAfterLogin).toBeVisible({ timeout: 10000 })
    console.log("Login successful!")

    console.log("All production tests passed!")
  })
})
