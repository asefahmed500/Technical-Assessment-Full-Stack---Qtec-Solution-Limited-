# Task Management System

A full-stack task management application built with Next.js 16, Better Auth, PostgreSQL, and Prisma.

---

## Tech Stack

| Layer     | Technology                       |
| --------- | -------------------------------- |
| Framework | Next.js 16 (App Router)          |
| Language  | TypeScript                       |
| Auth      | Better Auth                      |
| Database  | PostgreSQL (Neon)                |
| ORM       | Prisma 7                         |
| Styling   | Tailwind CSS + shadcn/ui         |
| Testing   | Vitest (unit) + Playwright (e2e) |

---

## Features

- User registration and login via Better Auth
- Create, read, update, delete tasks
- Task status tracking: `pending` → `in_progress` → `completed`
- Priority levels: LOW, MEDIUM, HIGH
- Filter and sort tasks by status, priority
- Clean, responsive UI

---

## Prerequisites

- Node.js v20+
- PostgreSQL v15+ (using Neon cloud database)

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="your-random-secret-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript check
npm run test         # Run Vitest unit tests
npm run test:e2e     # Run Playwright e2e tests
npm run test:all     # Run all tests
```

---

## Project Structure

```
.
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   └── tasks/
│   ├── api/
│   │   ├── auth/          # Better Auth handler
│   │   └── tasks/         # Task CRUD API routes
│   └── layout.tsx
├── components/
│   ├── ui/                # shadcn/ui primitives
│   └── auth-provider.tsx
├── lib/
│   ├── auth.ts            # Better Auth server config
│   ├── auth-client.ts     # Better Auth client config
│   ├── db.ts              # Prisma client singleton
│   ├── validations.ts     # Zod schemas
│   └── session.ts         # Session helpers
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
│   ├── unit/              # Vitest unit tests
│   └── e2e/               # Playwright e2e tests
└── package.json
```

---

## Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  createdAt     DateTime  @default(now())
  emailVerified Boolean   @default(false)
  image         String?
  tasks         Task[]
  accounts      Account[]
  sessions      Session[]
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

---

## API Routes

| Method | Endpoint         | Description                      |
| ------ | ---------------- | -------------------------------- |
| GET    | `/api/tasks`     | Get all tasks for logged-in user |
| POST   | `/api/tasks`     | Create a new task                |
| GET    | `/api/tasks/:id` | Get a single task                |
| PATCH  | `/api/tasks/:id` | Update task                      |
| DELETE | `/api/tasks/:id` | Delete a task                    |

---

## Built with

- [Next.js](https://nextjs.org)
- [Better Auth](https://better-auth.com)
- [Prisma](https://prisma.io)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## License

MIT
