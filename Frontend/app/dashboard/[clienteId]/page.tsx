"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { clientesService } from "@/lib/api/clientes"
import { carteirasService } from "@/lib/api/carteiras"
import type { Cliente, Objetivo } from "@/types"
import { ArrowLeft, TrendingUp, Target, DollarSign, BarChart3 } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { StaggeredContainer, StaggeredItem, FadeInCard } from "@/components/ui/loading-states"

export default function DashboardPage() {
  const params = useParams()
  const clienteId = params.clienteId as string

  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [selectedObjetivo, setSelectedObjetivo] = useState<Objetivo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [clienteId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Carregar dados do cliente
      const [clienteData, objetivosData] = await Promise.all([
        clientesService.obter(clienteId),
        carteirasService.listarObjetivos(clienteId)
      ])
      
      setCliente(clienteData)
      
      // Carregar investimentos para cada objetivo
      const objetivosComInvestimentos = await Promise.all(
        objetivosData.map(async (objetivo) => {
          const investimentos = await carteirasService.listarInvestimentos(objetivo.id)
          return { ...objetivo, investimentos }
        })
      )
      
      setObjetivos(objetivosComInvestimentos)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  const getTotalObjetivo = (objetivo: Objetivo) => {
    return objetivo.investimentos.reduce((total, inv) => total + inv.valor, 0)
  }

  const getTotalCarteira = () => {
    return objetivos.reduce((total, obj) => total + getTotalObjetivo(obj), 0)
  }

  const getObjetivoPercentage = (objetivo: Objetivo) => {
    const total = getTotalCarteira()
    if (total === 0) return 0
    return (getTotalObjetivo(objetivo) / total) * 100
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!cliente) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>Cliente não encontrado</AlertDescription>
          </Alert>
          <Button asChild className="mt-4">
            <Link href="/clientes">Voltar para Clientes</Link>
          </Button>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/clientes">Clientes</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/carteira/${clienteId}`}>Carteira</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard {cliente ? `- ${cliente.nome}` : ''}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/clientes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Dashboard - {cliente.nome}</h1>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href={`/carteira/${clienteId}`}>Gerenciar Carteira</Link>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Cards de Resumo */}
        <StaggeredContainer className="grid md:grid-cols-3 gap-6 mb-8">
          <StaggeredItem>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(getTotalCarteira())}</div>
            </CardContent>
            </Card>
          </StaggeredItem>

          <StaggeredItem>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objetivos Ativos</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{objetivos.length}</div>
            </CardContent>
            </Card>
          </StaggeredItem>

          <StaggeredItem>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Investimentos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {objetivos.reduce((total, obj) => total + obj.investimentos.length, 0)}
              </div>
            </CardContent>
            </Card>
          </StaggeredItem>
        </StaggeredContainer>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gráfico de Barras dos Objetivos */}
          <FadeInCard delay={0.2}>
            <CardHeader>
              <CardTitle>Distribuição por Objetivos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {objetivos.map((objetivo) => {
                  const total = getTotalObjetivo(objetivo)
                  const percentage = getObjetivoPercentage(objetivo)

                  return (
                    <div key={objetivo.id} className="group cursor-pointer hover:bg-muted/30 p-3 rounded-lg transition-all" onClick={() => setSelectedObjetivo(objetivo)}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{objetivo.nome}</span>
                        <span className="text-sm font-semibold text-accent">{formatCurrency(total)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500 shadow-sm group-hover:shadow-md"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 font-medium">{percentage.toFixed(1)}% do total</div>
                    </div>
                  )
                })}
              </div>

              {objetivos.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Nenhum objetivo cadastrado ainda</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Crie objetivos na carteira do cliente</p>
                </div>
              )}
            </CardContent>
          </FadeInCard>

          {/* Detalhes do Objetivo Selecionado */}
          <FadeInCard delay={0.4}>
            <CardHeader>
              <CardTitle>
                {selectedObjetivo ? `Investimentos - ${selectedObjetivo.nome}` : "Selecione um Objetivo"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedObjetivo ? (
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-green-600 mb-4">
                    Total: {formatCurrency(getTotalObjetivo(selectedObjetivo))}
                  </div>

                  {selectedObjetivo.investimentos.map((investimento) => {
                    const percentage =
                      selectedObjetivo.investimentos.length > 0
                        ? (investimento.valor / getTotalObjetivo(selectedObjetivo)) * 100
                        : 0

                    return (
                      <div key={investimento.id} className="border-l-4 border-primary/60 pl-4 py-3 bg-gradient-to-r from-muted/20 to-transparent rounded-r-lg hover:from-muted/40 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-foreground">{investimento.nome}</span>
                          <span className="text-accent font-semibold">{formatCurrency(investimento.valor)}</span>
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">{percentage.toFixed(1)}% deste objetivo</div>
                      </div>
                    )
                  })}

                  {selectedObjetivo.investimentos.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">Nenhum investimento neste objetivo</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Selecione um objetivo</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Clique em uma barra do gráfico para ver os detalhes</p>
                </div>
              )}
            </CardContent>
          </FadeInCard>
        </div>

        {/* Lista Completa de Objetivos */}
        {objetivos.length > 0 && (
          <FadeInCard delay={0.6} className="mt-8">
            <CardHeader>
              <CardTitle>Resumo Completo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {objetivos.map((objetivo) => (
                  <div key={objetivo.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-foreground">{objetivo.nome}</h3>
                      <span className="text-xl font-bold text-accent">
                        {formatCurrency(getTotalObjetivo(objetivo))}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {objetivo.investimentos.map((investimento) => (
                        <div key={investimento.id} className="bg-muted/30 p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                          <p className="font-medium text-foreground">{investimento.nome}</p>
                          <p className="text-accent font-semibold text-lg mt-1">{formatCurrency(investimento.valor)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </FadeInCard>
        )}
      </div>
    </ProtectedRoute>
  )
}