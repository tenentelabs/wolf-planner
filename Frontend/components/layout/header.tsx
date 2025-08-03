"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Users, BarChart3, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Wolf Planner
            </span>
          </Link>

          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild className="hover:bg-primary/5">
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Início</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild className="hover:bg-primary/5">
              <Link href="/clientes" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Clientes</span>
              </Link>
            </Button>
            <ThemeToggle />
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                onClick={logout} 
                className="flex items-center space-x-2 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
