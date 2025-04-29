import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    where: {
      isDoctor: false
    }
  })
  return NextResponse.json(users, { status: 200 })
}



