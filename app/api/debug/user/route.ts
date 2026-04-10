import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name } = body

    // Direct Prisma creation - bypass Better Auth
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    })

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    console.error("Error:", error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
