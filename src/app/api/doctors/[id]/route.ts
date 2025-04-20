import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }){
  const { id } = params
  const doctor = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  })
  return NextResponse.json(doctor)  
}