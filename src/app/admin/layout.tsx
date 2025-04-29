"use client";

import type React from "react"
import { Toaster } from "@/components/ui/sonner"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { redirect, usePathname } from "next/navigation";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useEffect } from "react";

interface JwtPayloadWithRole extends JwtPayload {
  role?: "SUPERADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";
  name?: string;
}

const queryClient = new QueryClient()

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const location = usePathname()
  let user: JwtPayloadWithRole | null = null;

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      user = jwtDecode(token) as JwtPayloadWithRole
    }
  }

  useEffect(() => {
    if (!user?.role || (user?.role !== "SUPERADMIN" && user?.role !== "ADMIN")) {
      redirect("/")
    }
  }, [user])
  return (
    <html>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <SidebarProvider>
              <AppSidebar variant="inset" />
              <SidebarInset>
                <div>
                  <SiteHeader headerTitle={location.split('/').pop() || ''} />
                  <main className="mx-auto w-full">{children}</main>
                  <Toaster />
                </div>
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
