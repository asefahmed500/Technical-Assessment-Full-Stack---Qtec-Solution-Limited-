# AGENTS.md

This file provides guidance to AI coding agents working in this repository.

## Commands

```bash
# Development
npm run dev                    # Start dev server on port 3010

# Build & Type Check
npm run build                 # Production build (prisma generate + next build)
npm run typecheck             # TypeScript check (tsc --noEmit)
npm run lint                  # ESLint

# Testing
npm run test                   # Run all Vitest tests
npm run test path/to/test      # Run single test file
npm run test -t "name"       # Run test by name pattern
npm run test:watch           # Vitest in watch mode
npm run test:e2e            # Playwright e2e tests
npm run test:e2e:ui          # Playwright with UI

# Database
npx prisma migrate dev        # Run migrations
npx prisma studio          # Open Prisma Studio

# Formatting
npm run format               # Prettier format (--write)
```

## Code Style

### Imports

Use path alias `@/*` for internal imports. Order: external → aliases → relative.

```typescript
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MyComponent } from "./my-component"
```

### TypeScript

- Strict mode - no implicit any
- Explicit return types for exported functions
- Prefer `interface` over `type` for objects
- Use `Zod` for runtime validation

### Naming

| Element    | Convention  | Example              |
| ---------- | ----------- | -------------------- |
| Components | PascalCase  | `Button`, `TaskList` |
| Functions  | camelCase   | `getSession`         |
| Variables  | camelCase   | `userId`             |
| Constants  | UPPER_SNAKE | `MAX_RETRIES`        |
| File names | kebab-case  | `auth-provider.tsx`  |

### React Components

- Functional components with explicit prop types
- Use `React.ComponentProps<"element">` for props forwarding
- Use `class-variance-authority` (CVA) for variants
- Use `Slot` from radix-ui for polymorphic components

```typescript
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  const Comp = asChild ? Slot.Root : "button"
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

### Utility Functions

Use `cn()` from `@/lib/utils` for Tailwind class merging.

```typescript
className={cn("base", isActive && "active", className)}
```

### Error Handling

- Use Zod for input validation
- Return proper HTTP status codes in API routes

```typescript
if (!user) {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
}
```

### Server vs Client Components

Server: use `requireAuth()` from `@/lib/auth`, Prisma, no hooks.
Client: add `'use client'`, use `useSession()` from `@/lib/auth-client`.

```typescript
// Server Component
export default async function Page() {
  const user = await requireAuth()
  const data = await prisma.task.findMany({ where: { userId: user?.id } })
  return <Component data={data} />
}
```

---

## Testing

### Unit Tests (Vitest)

Location: `tests/unit/`. Use path aliases and `vi.mock()`.

```typescript
import { myFunction } from "@/lib/my-module"
vi.mock("@/lib/db", () => ({ prisma: { user: { findUnique: vi.fn() } } }))
```

### E2E Tests (Playwright)

Location: `tests/e2e/`. Dev server runs on port 3010.

---

## Project Structure

```
├── app/              # Next.js App Router
│   ├── api/        # API routes
│   └── dashboard/ # Protected routes
├── components/ui/   # shadcn/ui primitives
├── lib/            # Core utilities
│   ├── auth.ts    # Server auth
│   ├── auth-client.ts
│   ├── db.ts     # Prisma client
│   ├── utils.ts  # cn() utility
│   └── validations.ts
├── prisma/         # Database schema
└── tests/         # Tests
```

## Environment

```bash
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="min-32-chars"
BETTER_AUTH_URL="http://localhost:3010"
NEXT_PUBLIC_APP_URL="http://localhost:3010"
```
