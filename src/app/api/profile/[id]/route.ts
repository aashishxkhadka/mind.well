import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select:{
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      avatar: true,
    }
  })
  return NextResponse.json(user)
}