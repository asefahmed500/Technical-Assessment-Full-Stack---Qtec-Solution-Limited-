import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { TaskListClient } from "./task-list-client"

export const dynamic = "force-dynamic"

export default async function TasksPage() {
  const session = await auth.api.getSession({ headers: new Headers() })

  if (!session?.user) {
    redirect("/login")
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  const serializedTasks = tasks.map((task) => ({
    ...task,
    dueDate: task.dueDate?.toISOString() || null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }))

  return (
    <TaskListClient
      initialTasks={serializedTasks}
      userEmail={session.user.email}
    />
  )
}
