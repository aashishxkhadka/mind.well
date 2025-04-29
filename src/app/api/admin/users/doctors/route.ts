import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const doctors = await prisma.user.findMany({
    where: {
      isDoctor: true
    }
  })
  return NextResponse.json(doctors, { status: 200 })
}



