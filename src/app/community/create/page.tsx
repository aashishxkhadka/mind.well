"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import getUser from "@/lib/getuser"
import { toast } from "sonner"
import { jwtDecode } from "jwt-decode"

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100, {
    message: "Title must not exceed 100 characters",
  }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }).max(5000, {
    message: "Content must not exceed 5000 characters",
  }),
  published: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

export default function CreatePostPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  const user = jwtDecode(localStorage.getItem("token") as string)


  const createPost = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await axios.post("/api/post", { ...data, authorId: user?.id })
      return response.data
    },
    onSuccess: () => {
      toast.success("Post created successfully"),
        router.push("/community")
    }
  })
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    createPost.mutate(data)
  }

  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="min-w-2xl">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/community" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create a New Post</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title for your post"
                  {...register("title")}
                  aria-invalid={errors.title ? "true" : "false"}
                />
                {errors.title && <p className="text-sm font-medium text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="content"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Share your thoughts, questions, or experiences..."
                  className="min-h-[200px] resize-y"
                  {...register("content")}
                  aria-invalid={errors.content ? "true" : "false"}
                />
                {errors.content && <p className="text-sm font-medium text-destructive">{errors.content.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-8">
              <Button variant="outline" type="button" asChild>
                <Link href="/community">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Post"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
