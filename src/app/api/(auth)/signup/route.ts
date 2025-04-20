import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, name } = body;
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  })

  console.log("newUser", newUser)
  if (!newUser) return NextResponse.json({ message: "Error creating user" })

  return NextResponse.json({ message: "Singup req received" })
}
