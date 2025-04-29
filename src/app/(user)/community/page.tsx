"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, User } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { jwtDecode } from "jwt-decode"



export default function CommunityPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => axios.get("/api/post").then((res) => res.data),
  })

  let user = null;
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        user = jwtDecode(token);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }
  // const user = jwtDecode(localStorage.getItem("token") || "")

  if (isLoading) {
    return <div className="h-[80vh]">Loading...</div>
  }

  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
            <p className="text-muted-foreground">Connect with peers, share experiences, and find support</p>
          </div>
          {user && (
            <Button asChild>
              <Link href="/community/create">Create Post</Link>
            </Button>
          )}
        </div>

        <div className="grid gap-4">
          {posts?.map((post: any) => (
            <Link key={post.id} href={`/community/${post.id}`} className="block">
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {post.comments.length}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={post.author.image || "/placeholder.svg"} alt={post.author.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{post.author.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}