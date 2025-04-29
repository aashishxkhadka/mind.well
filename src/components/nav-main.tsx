"use client"

import { type LucideIcon, UserCog } from "lucide-react"
import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { jwtDecode } from "jwt-decode"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {

  let user = null;

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      user = jwtDecode(token)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <Link href={item.url} key={item.title}>
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} size={'lg'}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            </Link>
          ))}
          {
            // @ts-expect-error role might be undefined
            user?.role === "SUPERADMIN" && (
              <Link href={"/admin/admins"} >
                <SidebarMenuItem >
                  <SidebarMenuButton tooltip={"Manage Admins"} size={'lg'}>
                    <UserCog />
                    <span>Manage Admins</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>)
          }
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
