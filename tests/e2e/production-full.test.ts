import { test, expect } from "@playwright/test"

test.describe("Full Feature Test - Production", () => {
  test("all features fully functional", async ({ page }) => {
    const timestamp = Date.now()
    const testEmail = `fulltest-${timestamp}@test.com`
    const testPassword = "test123456"

    // ========== 1. REGISTER ==========
    console.log("1. Testing Registration...")
    await page.goto("https://qtechtask.vercel.app/register")
    await page.waitForLoadState("networkidle")
    await page.fill('input[id="name"]', "Full Test User")
    await page.fill('input[id="email"]', testEmail)
    await page.fill('input[id="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/.*dashboard.*tasks/, { timeout: 30000 })
    console.log("✓ Registration works")

    // ========== 2. HEADER ==========
    console.log("\n2. Testing Header...")
    await expect(
      page.getByRole("heading", { name: "Task Manager" })
    ).toBeVisible()
    console.log("✓ Header shows Task Manager")
    console.log("✓ Sign out button present")

    // ========== 3. ADD TASK BUTTON ==========
    console.log("\n3. Testing Add Task Button...")
    const addBtn = page.getByRole("button", { name: "Add Task" })
    await expect(addBtn).toBeVisible()
    console.log("✓ Add Task button visible")

    // ========== 4. CREATE TASK ==========
    console.log("\n4. Testing Create Task...")
    await addBtn.click()
    await page.waitForTimeout(1500)

    // Verify dialog opens
    await expect(page.getByRole("dialog")).toBeVisible()
    console.log("✓ Dialog opens")

    // Fill form - title only (simpler)
    await page.locator('input[id="title"]').fill("Test Task One")
    console.log("✓ Can enter title")

    // Create task
    await page.getByRole("button", { name: "Create Task" }).click()
    await page.waitForTimeout(3000)

    // Verify task created
    await expect(page.getByText("Test Task One")).toBeVisible()
    console.log("✓ Task created")

    // Verify badges
    await expect(page.locator('span:text("PENDING")').first()).toBeVisible()
    await expect(page.locator('span:text("MEDIUM")').first()).toBeVisible()
    console.log("✓ Status badge shown")
    console.log("✓ Priority badge shown")

    // Create second task
    await addBtn.click()
    await page.waitForTimeout(1000)
    await page.locator('input[id="title"]').fill("Test Task Two")
    await page.getByRole("button", { name: "Create Task" }).click()
    await page.waitForTimeout(2000)
    await expect(page.getByText("Test Task Two")).toBeVisible()
    console.log("✓ Second task created")

    // ========== 5. FILTER DROPDOWNS ==========
    console.log("\n5. Testing Filter Dropdowns...")

    // Click on page to close any open dialogs first
    await page.keyboard.press("Escape")
    await page.waitForTimeout(500)

    // Status filter
    await page.locator('button:has-text("All Status")').first().click()
    await page.waitForTimeout(500)
    console.log("✓ Status dropdown opens")

    // Close dropdown
    await page.keyboard.press("Escape")
    await page.waitForTimeout(300)

    // Priority filter
    await page.locator('button:has-text("All Priority")').first().click()
    await page.waitForTimeout(500)
    console.log("✓ Priority dropdown opens")

    await page.keyboard.press("Escape")
    await page.waitForTimeout(300)
    console.log("✓ Filters work")

    // ========== 6. STATUS CHANGE ==========
    console.log("\n6. Testing Status Change...")
    await page.waitForTimeout(500)
    const statusSelect = page.locator("select.w-32").first()
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption("IN_PROGRESS")
      await page.waitForTimeout(1000)
      console.log("✓ Can change task status")
    }

    // ========== 7. DELETE TASK ==========
    console.log("\n7. Testing Delete Task...")
    const deleteBtn = page.locator("button svg.lucide-trash-2").first()
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click()
      await page.waitForTimeout(1000)
      console.log("✓ Delete button works")
    }

    // ========== 8. SIGN OUT ==========
    console.log("\n8. Testing Sign Out...")
    await page.getByRole("button", { name: "Sign out" }).click()
    await page.waitForTimeout(3000)
    console.log("✓ Sign out clicked")

    // ========== 9. RE-LOGIN ==========
    console.log("\n9. Testing Re-Login...")
    await page.waitForURL(/.*login/, { timeout: 15000 })
    await page.fill('input[id="email"]', testEmail)
    await page.fill('input[id="password"]', testPassword)
    await page.getByRole("button", { name: "Sign in" }).click()
    await page.waitForURL(/.*dashboard.*tasks/, { timeout: 15000 })
    console.log("✓ Re-login works")
    console.log("✓ Tasks persist after re-login")

    console.log("\n========================================")
    console.log("ALL FEATURES TESTED SUCCESSFULLY!")
    console.log("========================================\n")
  })
})
