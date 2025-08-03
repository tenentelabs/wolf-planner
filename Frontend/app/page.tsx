"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, BarChart3 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-foreground mb-4">Wolf Planner</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Sistema completo para gestão de clientes, objetivos financeiros e investimentos
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="group hover:shadow-xl transition-all duration-300 border-border/50">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Clientes</CardTitle>
            <CardDescription className="text-base">Gerencie seus clientes e suas informações de contato</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full hover:shadow-md transition-all">
              <Link href="/clientes">Gerenciar Clientes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-border/50">
          <CardHeader>
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="text-2xl">Objetivos</CardTitle>
            <CardDescription className="text-base">Defina objetivos financeiros e organize investimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full hover:shadow-md transition-all">
              <Link href="/clientes">Escolher Cliente</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-border/50">
          <CardHeader>
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/80 transition-colors">
              <BarChart3 className="h-6 w-6 text-secondary-foreground" />
            </div>
            <CardTitle className="text-2xl">Dashboard</CardTitle>
            <CardDescription className="text-base">Visualize relatórios e análises dos investimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full hover:shadow-md transition-all">
              <Link href="/clientes">Ver Dashboards</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-muted-foreground mb-6 text-lg">Comece gerenciando seus clientes e definindo seus objetivos financeiros</p>
        <Button asChild size="lg" className="hover:shadow-lg transition-all px-8">
          <Link href="/clientes">Começar Agora</Link>
        </Button>
      </div>
    </div>
  )
}
