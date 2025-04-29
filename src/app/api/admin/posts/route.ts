import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    include:{
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return NextResponse.json(posts, {status: 200})
}