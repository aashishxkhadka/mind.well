import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, content, authorId } = body

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
    },
  })

  return NextResponse.json(post)
}

export async function GET(request: NextRequest) {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
  return NextResponse.json(posts)
}
