import { describe, it, expect } from "vitest"
import {
  createTaskSchema,
  updateTaskSchema,
  taskFilterSchema,
} from "@/lib/validations"

describe("Task Validation Schemas", () => {
  describe("createTaskSchema", () => {
    it("should validate a valid task input", () => {
      const validInput = {
        title: "Test Task",
        description: "Test description",
        priority: "HIGH",
      }
      expect(createTaskSchema.parse(validInput)).toEqual(validInput)
    })

    it("should require title", () => {
      const invalidInput = {
        description: "Test description",
        priority: "HIGH",
      }
      expect(() => createTaskSchema.parse(invalidInput)).toThrow()
    })

    it("should have default priority", () => {
      const input = { title: "Test Task" }
      const result = createTaskSchema.parse(input)
      expect(result.priority).toBe("MEDIUM")
    })

    it("should reject invalid priority", () => {
      const invalidInput = {
        title: "Test Task",
        priority: "INVALID",
      }
      expect(() => createTaskSchema.parse(invalidInput)).toThrow()
    })
  })

  describe("updateTaskSchema", () => {
    it("should allow partial updates", () => {
      const partialUpdate = { status: "COMPLETED" }
      expect(updateTaskSchema.parse(partialUpdate)).toEqual(partialUpdate)
    })

    it("should allow multiple fields", () => {
      const multipleFields = {
        title: "Updated Title",
        status: "IN_PROGRESS" as const,
        priority: "HIGH" as const,
      }
      expect(updateTaskSchema.parse(multipleFields)).toEqual(multipleFields)
    })

    it("should reject invalid status", () => {
      const invalidInput = { status: "INVALID" }
      expect(() => updateTaskSchema.parse(invalidInput)).toThrow()
    })
  })

  describe("taskFilterSchema", () => {
    it("should validate empty filter", () => {
      expect(taskFilterSchema.parse({})).toEqual({})
    })

    it("should validate status filter", () => {
      const filter = { status: "PENDING" as const }
      expect(taskFilterSchema.parse(filter)).toEqual(filter)
    })

    it("should validate sort options", () => {
      const filter = {
        sortBy: "dueDate" as const,
        sortOrder: "asc" as const,
      }
      expect(taskFilterSchema.parse(filter)).toEqual(filter)
    })

    it("should have default sort order", () => {
      const result = taskFilterSchema.parse({})
      expect(result.sortBy).toBeUndefined()
      expect(result.sortOrder).toBeUndefined()
    })
  })
})
