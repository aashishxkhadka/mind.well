import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

type Params = Promise<{ id: string }>
export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const id = (await params).id
  const admin = await prisma.admin.findUnique({
    where: { id: parseInt(id) }
  })

  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 })
  }

  const result = await prisma.admin.delete({ where: { id: parseInt(id) } })

  return NextResponse.json({ message: "Admin deleted successfully", result })
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const id = (await params).id

  const { name, email, password } = await req.json()

  const hashedPassword = await bcrypt.hash(password, 10)
  const admin = await prisma.admin.update({ where: { id: parseInt(id) }, data: { name, email, password: hashedPassword } })

  return NextResponse.json({ message: "Admin updated successfully", admin })
}
