import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: new Headers() })

  if (session?.user) {
    redirect("/tasks")
  } else {
    redirect("/login")
  }
}
