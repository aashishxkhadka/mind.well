import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

type Params = Promise<{ id: string }> 

export async function GET(request: NextRequest, { params }: { params: Params }){
  const { id } = await params
  const doctor = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  })
  return NextResponse.json(doctor)  
}