"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Objetivo } from "@/types"
import { useClienteData } from "@/hooks/use-cliente-data"
import { ArrowLeft, TrendingUp, Target, DollarSign, BarChart3 } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { StaggeredContainer, StaggeredItem, FadeInCard } from "@/components/ui/loading-states"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export default function DashboardPage() {
  const params = useParams()
  const clienteId = params.clienteId as string

  const { cliente, objetivos, loading, error } = useClienteData(clienteId)
  const [selectedObjetivo, setSelectedObjetivo] = useState<Objetivo | null>(null)

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

  const getProgressoMeta = (objetivo: Objetivo) => {
    if (!objetivo.valor_meta || objetivo.valor_meta === 0) return null
    const totalInvestido = getTotalObjetivo(objetivo)
    const progresso = Math.min((totalInvestido / objetivo.valor_meta) * 100, 100)
    return {
      progresso,
      totalInvestido,
      meta: objetivo.valor_meta,
      atingida: totalInvestido >= objetivo.valor_meta
    }
  }

  // Cores para o gráfico de pizza
  const COLORS = [
    '#3b82f6', // blue-500
    '#f59e0b', // amber-500  
    '#10b981', // emerald-500
    '#8b5cf6', // violet-500
    '#ef4444', // red-500
    '#06b6d4', // cyan-500
    '#ec4899', // pink-500
  ]

  // Preparar dados para o gráfico de pizza
  const prepareChartData = (objetivo: Objetivo) => {
    return objetivo.investimentos.map((investimento, index) => ({
      name: investimento.nome,
      value: investimento.valor,
      percentage: ((investimento.valor / getTotalObjetivo(objetivo)) * 100).toFixed(1),
      color: COLORS[index % COLORS.length]
    }))
  }

  // Tooltip customizado para o gráfico
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-accent font-semibold">{formatCurrency(data.value)}</p>
          <p className="text-muted-foreground text-sm">{data.percentage}% do objetivo</p>
        </div>
      )
    }
    return null
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
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/clientes" className="text-sm">Clientes</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/carteira/${clienteId}`} className="text-sm">Carteira</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm">
                <span className="hidden sm:inline">Dashboard {cliente ? `- ${cliente.nome}` : ''}</span>
                <span className="sm:hidden">Dashboard</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:space-x-4">
            <Button asChild variant="outline" size="sm" className="w-fit">
              <Link href="/clientes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-4xl">Dashboard - {cliente.nome}</h1>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={`/carteira/${clienteId}`}>Gerenciar Carteira</Link>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Cards de Resumo */}
        <StaggeredContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Gráfico de Barras dos Objetivos */}
          <FadeInCard delay={0.2}>
            <CardHeader>
              <CardTitle>Distribuição por Objetivos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {objetivos.map((objetivo) => {
                  const total = getTotalObjetivo(objetivo)
                  const carteiraPorcentagem = getObjetivoPercentage(objetivo)
                  const progressoMeta = getProgressoMeta(objetivo)

                  return (
                    <div key={objetivo.id} className="group cursor-pointer hover:bg-muted/30 p-3 rounded-lg transition-all" onClick={() => setSelectedObjetivo(objetivo)}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{objetivo.nome}</span>
                        <span className="text-sm font-semibold text-accent">{formatCurrency(total)}</span>
                      </div>
                      
                      {/* Barra de Progresso da Meta */}
                      {progressoMeta ? (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Meta: {formatCurrency(progressoMeta.meta)}</span>
                            <span className={`font-medium ${progressoMeta.atingida ? 'text-green-600' : 'text-blue-600'}`}>
                              {progressoMeta.progresso.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                            <div
                              className="h-3 rounded-full transition-all duration-500 shadow-sm group-hover:shadow-md"
                              style={{ 
                                width: `${progressoMeta.progresso}%`,
                                background: progressoMeta.atingida 
                                  ? 'linear-gradient(to right, #10b981, #059669)' 
                                  : 'linear-gradient(to right, #3b82f6, #2563eb)'
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Sem meta definida</span>
                            <span className="text-muted-foreground">{carteiraPorcentagem.toFixed(1)}% do total</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                            <div
                              className="h-3 rounded-full transition-all duration-500 shadow-sm group-hover:shadow-md"
                              style={{ 
                                width: `${carteiraPorcentagem}%`,
                                background: 'linear-gradient(to right, #9ca3af, #6b7280)'
                              }}
                            />
                          </div>
                        </div>
                      )}
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
                <div className="space-y-6">
                  <div className="text-lg font-semibold text-green-600 mb-4">
                    Total: {formatCurrency(getTotalObjetivo(selectedObjetivo))}
                  </div>

                  {selectedObjetivo.investimentos.length > 0 ? (
                    <div className="space-y-6">
                      {/* Gráfico de Pizza */}
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={prepareChartData(selectedObjetivo)}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              animationBegin={0}
                              animationDuration={800}
                            >
                              {prepareChartData(selectedObjetivo).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                              verticalAlign="bottom" 
                              height={36}
                              formatter={(value: string, entry: any) => (
                                <span className="text-sm font-medium text-foreground">
                                  {value}
                                </span>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Lista detalhada dos investimentos */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          Detalhamento
                        </h4>
                        {selectedObjetivo.investimentos.map((investimento, index) => {
                          const percentage = ((investimento.valor / getTotalObjetivo(selectedObjetivo)) * 100).toFixed(1)
                          return (
                            <div key={investimento.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="font-medium text-foreground">{investimento.nome}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-accent font-semibold">{formatCurrency(investimento.valor)}</div>
                                <div className="text-sm text-muted-foreground">{percentage}%</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
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