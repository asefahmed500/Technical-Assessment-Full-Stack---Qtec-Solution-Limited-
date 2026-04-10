import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getSession() {
  const session = await auth.api.getSession()
  if (!session?.user) {
    redirect("/login")
  }
  return session
}
