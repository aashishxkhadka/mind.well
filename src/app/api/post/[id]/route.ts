import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
  })
  return NextResponse.json(post)
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { content, authorId } = body
  const post = await prisma.post.findUnique({
    where: { id: parseInt(params.id) },
  })

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const comment = await prisma.comment.create({
    data: { content, postId: post.id, authorId: authorId },
  })

  return NextResponse.json(comment)
}