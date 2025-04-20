import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
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

export async function POST(request: NextRequest, { params }: { params: Params }) {
  const body = await request.json()
  const { content, authorId } = body
  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  })

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const comment = await prisma.comment.create({
    data: { content, postId: post.id, authorId: authorId },
  })

  return NextResponse.json(comment)
}