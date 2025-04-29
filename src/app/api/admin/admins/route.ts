import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const admins = await prisma.admin.findMany({
    where: {
      role: "ADMIN"
    }
  })

  return NextResponse.json(admins)
}