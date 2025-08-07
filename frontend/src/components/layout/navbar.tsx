"use client"

import * as React from "react"
import { Calendar, LogOut, Moon, Settings, Sun, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/stores/authStore"

export function Navbar() {
 const { user, logout, isAuthenticated } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/dashboard")
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-sky-500" />
              <span className="font-bold text-xl">EventManager</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">

             {isAuthenticated && user ? ( 
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none"> {user.name} </p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email} </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">{user.role} </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  { user.role === "admin" && ( 
                  <DropdownMenuItem onClick={() => router.push("/auth/accounts")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Accounts</span>
                  </DropdownMenuItem>
                   )} 
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : ( 
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="auth/register">Sign Up</Link>
                </Button>
              </div>
            )} 
          </div>
        </div>
      </div>
    </nav>
  )
}
