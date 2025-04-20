import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, User } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import prisma from "@/lib/prisma"
import { CommentForm } from "@/components/comment-form"


export default async function PostPage({ params }: { params: { id: string } }) {
  const postId = await parseInt(params.id)
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
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


  if (!post) {
    return (
      <div className="container py-8 px-4 mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Button asChild>
            <Link href="/community">Back to Community</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container min-w-3xl max-w-3xl  py-8 px-4 mx-auto">
      <div className="flex flex-col gap-6  mx-auto">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/community" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Community
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post?.author?.avatar || "/placeholder.svg"} alt={post.author.email} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{post.author.name}</span>
                <span className="text-sm text-muted-foreground">
                  • {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{post.content}</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Comments ({post.comments.length})</h2>

          {post.comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No comments yet. Be the first to comment!</p>
              <CommentForm postId={post.id} />
            </div>
          ) : (
            <div className="space-y-4">
              <CommentForm postId={post.id} />
              {post.comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={comment?.author?.image || "/placeholder.svg"} alt={comment?.author?.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{comment?.author?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        • {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
