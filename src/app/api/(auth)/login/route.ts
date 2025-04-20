import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ message: "User not found" });

  const isPasswordValid = bcrypt.compare(password, user.password);
  if (!isPasswordValid) return NextResponse.json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET as jwt.Secret);
  return NextResponse.json({ message: "Login Successful", token: token });
}
