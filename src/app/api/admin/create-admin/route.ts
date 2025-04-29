import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json()

  const hashedPassword = await bcrypt.hash(body.password, 10)

  const newAdmin = await prisma.admin.create({
    data: {
      email: body.email,
      password: hashedPassword,
      name: body.name,
    }
  })

  return NextResponse.json(newAdmin, { status: 201 })
}