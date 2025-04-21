"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "../mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner";
import { Logo } from "../logo";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "../ui/dropdown-menu";
import { LucideAArrowDown, LucideArrowDown, LucideChevronDown } from "lucide-react";
export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage?.getItem("token")
    const user = token ? jwtDecode(token as string) : null
    setUser(user)
  }, [])


  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 flex items-center justify-between">
          <Logo />
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/doctors">Doctors</Link>
          </Button>
              <DropdownMenu>
                <DropdownMenuTrigger><Button variant={"ghost"}>Resources<LucideChevronDown/></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href="/resources">Resources</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/meditation">Meditation</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/assessment">Assessment</Link>
                  </DropdownMenuItem>
                 
      </DropdownMenuContent>
    </DropdownMenu>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/community">Community</Link>
          </Button>
          <div className="flex items-center gap-2">
          
         
            
            <DropdownMenu>
            <DropdownMenuTrigger><Button variant={"ghost"}>About<LucideChevronDown/></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href="/about">About</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/services">Services</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/mission">Mission</Link>
                  </DropdownMenuItem>
              
                  <DropdownMenuItem>
                    <Link href="/contact">Contact</Link>
                  </DropdownMenuItem>
                 </DropdownMenuContent>
                  </DropdownMenu> 
            
            
          
           
        
        </div>
        </nav>


        {!user ? (
        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Sign up</Link>
          </Button>
          </div>)
          :
          <div className="flex items-center gap-3">
          <ModeToggle />
          <Link href="/profile">
            <Avatar>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
          </div>

        }
      </div>
    </header>
  )
}
