import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const admin = await prisma.admin.findUnique({
    where: {
      email
    }
  })

  if (!admin) {
    return NextResponse.json({ message: "Admin not found" }, { status: 404 })
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password)

  if (!isPasswordValid) {
    throw new Error("Invalid password")
  }

  const token = jwt.sign({ id: admin.id, role: admin.role, name: admin.name, email: admin.email }, process.env.JWT_SECRET!, { expiresIn: "1h" })

  return NextResponse.json({ message: "Admin logged in successfully", token }, { status: 200 })
}

