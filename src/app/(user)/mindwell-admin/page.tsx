"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";

const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export default function AdminLoginPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof AdminLoginSchema>>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleAdminLogin = useMutation({
    mutationFn: async (data: z.infer<typeof AdminLoginSchema>) => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(data),
      })
      return response.json()
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token)
      toast.success("Login successful")
      router.push("/admin/dashboard")
    },
    onError: () => {
      toast.error("Invalid email or password")
    }
  })

  const onSubmit = (data: z.infer<typeof AdminLoginSchema>) => {
    handleAdminLogin.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg border">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
          <p className="text-muted-foreground">Enter your credentials to access the admin dashboard</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                className="pl-10"
                {...form.register("email")}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10"
                {...form.register("password")}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={handleAdminLogin.isPending}
          >
            {handleAdminLogin.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  )
}