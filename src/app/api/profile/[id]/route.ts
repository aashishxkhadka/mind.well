import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select:{
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
    }
  })
  return NextResponse.json(user)
}