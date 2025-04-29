"use client"

import {
  LogOutIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const router = useRouter()
  const logOut = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
        onClick={() => logOut()}
          size={'lg'} className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-red-500 hover:bg-red-500 p-4 hover:text-white">
          <span>Logout</span> <LogOutIcon className="ml-auto size-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
          className="border border-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
