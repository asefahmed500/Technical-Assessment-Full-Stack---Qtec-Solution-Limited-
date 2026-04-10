import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { TaskListClient } from "./task-list-client"

export const dynamic = "force-dynamic"

export default async function TasksPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/login")
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  const serializedTasks = tasks.map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
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
