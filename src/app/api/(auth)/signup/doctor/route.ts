import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password, name, title, qualification, experience, address, phone, avatar } = await request.json();

  const emailExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (emailExist) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      title,
      qualification,
      experience,
      address,
      phone,
      avatar,
      isDoctor:true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }

  return NextResponse.json(user);
}