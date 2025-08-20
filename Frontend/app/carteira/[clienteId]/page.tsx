"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ObjetivoForm } from "@/components/carteira/objetivo-form"
import { InvestimentoForm } from "@/components/carteira/investimento-form"
import { carteirasService } from "@/lib/api/carteiras"
import type { Objetivo, Investimento } from "@/types"
import { useClienteData } from "@/hooks/use-cliente-data"
import { Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SmartSkeleton } from "@/components/ui/loading-states"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

export default function CarteiraPage() {
  const params = useParams()
  const clienteId = params.clienteId as string

  const { cliente, objetivos, loading, error, refreshData } = useClienteData(clienteId)
  const [loadingAction, setLoadingAction] = useState(false)

  const handleAddObjetivo = async (nome: string, valorMeta?: number | null) => {
    try {
      setLoadingAction(true)
      await carteirasService.criarObjetivo({
        nome,
        cliente_id: clienteId,
        valor_meta: valorMeta
      })
      await refreshData()
    } catch (err: any) {
      console.error("Erro ao criar objetivo:", err.message || "Erro desconhecido")
    } finally {
      setLoadingAction(false)
    }
  }

  const handleEditObjetivo = async (objetivoId: string, nome: string, valorMeta?: number | null) => {
    try {
      setLoadingAction(true)
      await carteirasService.atualizarObjetivo(objetivoId, { nome, valor_meta: valorMeta })
      await refreshData()
    } catch (err: any) {
      console.error("Erro ao atualizar objetivo:", err.message || "Erro desconhecido")
    } finally {
      setLoadingAction(false)
    }
  }

  const handleDeleteObjetivo = async (objetivoId: string) => {
    try {
      setLoadingAction(true)
      await carteirasService.deletarObjetivo(objetivoId)
      await refreshData()
    } catch (err: any) {
      console.error("Erro ao deletar objetivo:", err.message || "Erro desconhecido")
    } finally {
      setLoadingAction(false)
    }
  }

  const handleAddInvestimento = async (objetivoId: string, investimentoData: Omit<Investimento, "id">) => {
    try {
      setLoadingAction(true)
      await carteirasService.criarInvestimento({
        nome: investimentoData.nome,
        valor: investimentoData.valor,
        objetivo_id: objetivoId
      })
      await refreshData()
    } catch (err: any) {
      console.error("Erro ao criar investimento:", err.message || "Erro desconhecido")
    } finally {
      setLoadingAction(false)
    }
  }

  const handleEditInvestimento = async (
    objetivoId: string,
    investimentoId: string,
    investimentoData: Omit<Investimento, "id">,
  ) => {
    try {
      setLoadingAction(true)
      await carteirasService.atualizarInvestimento(investimentoId, {
        nome: investimentoData.nome,
        valor: investimentoData.valor
      })
      await refreshData()
    } catch (err: any) {
      console.error("Erro ao atualizar investimento:", err.message || "Erro desconhecido")
    } finally {
      setLoadingAction(false)
    }
  }

  const handleDeleteInvestimento = async (objetivoId: string, investimentoId: string) => {
    try {
      setLoadingAction(true)
      await carteirasService.deletarInvestimento(investimentoId)
      await refreshData()
    } catch (err: any) {
      console.error("Erro ao deletar investimento:", err.message || "Erro desconhecido")
    } finally {
      setLoadingAction(false)
    }
  }

  const getTotalObjetivo = (objetivo: Objetivo) => {
    return objetivo.investimentos.reduce((total, inv) => total + inv.valor, 0)
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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-4 sm:py-8">
          {/* Breadcrumb skeleton */}
          <SmartSkeleton className="h-6 w-48 mb-4" />
          
          {/* Header skeleton */}
          <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:space-x-4">
              <SmartSkeleton className="h-9 w-20" />
              <SmartSkeleton className="h-8 w-64" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4">
              <SmartSkeleton className="h-9 w-32" />
              <SmartSkeleton className="h-9 w-36" />
            </div>
          </div>
          
          {/* Objetivo cards skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <SmartSkeleton key={i} variant="card" className="min-h-48" />
            ))}
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
              <BreadcrumbPage className="text-sm">
                <span className="hidden sm:inline">Carteira {cliente ? `- ${cliente.nome}` : ''}</span>
                <span className="sm:hidden">Carteira</span>
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
              <h1 className="text-2xl font-bold text-foreground sm:text-4xl">Carteira - {cliente.nome}</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={`/dashboard/${clienteId}`}>Ver Dashboard</Link>
            </Button>
            <div className="w-full sm:w-auto">
              <ObjetivoForm onSubmit={handleAddObjetivo} />
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {objetivos.map((objetivo) => (
            <Card key={objetivo.id}>
              <CardHeader>
                <div className="space-y-4">
                  {/* Título e Valor */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                      <h3 className="text-xl font-semibold text-foreground">{objetivo.nome}</h3>
                      <span className="text-lg font-semibold text-accent">
                        {formatCurrency(getTotalObjetivo(objetivo))}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar da Meta */}
                  {(() => {
                    const progressoMeta = getProgressoMeta(objetivo)
                    if (progressoMeta) {
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Meta: {formatCurrency(progressoMeta.meta)}
                            </span>
                            <span className={`font-medium ${progressoMeta.atingida ? 'text-green-600' : 'text-blue-600'}`}>
                              {progressoMeta.progresso.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                progressoMeta.atingida 
                                  ? 'bg-green-500' 
                                  : 'bg-gradient-to-r from-blue-500 to-blue-600'
                              }`}
                              style={{ width: `${progressoMeta.progresso}%` }}
                            />
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}

                  {/* Botões de Ação */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <InvestimentoForm onSubmit={(data) => handleAddInvestimento(objetivo.id, data)} />
                    <ObjetivoForm
                      objetivo={objetivo}
                      onSubmit={(nome, valorMeta) => handleEditObjetivo(objetivo.id, nome, valorMeta)}
                      trigger={
                        <Button size="sm" variant="outline" className="flex-shrink-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <ConfirmationDialog
                      trigger={
                        <Button size="sm" variant="outline" className="flex-shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                      title="Excluir Objetivo"
                      description={`Tem certeza que deseja excluir o objetivo "${objetivo.nome}"? Esta ação não pode ser desfeita e todos os investimentos vinculados também serão removidos.`}
                      confirmText="Excluir"
                      onConfirm={() => handleDeleteObjetivo(objetivo.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {objetivo.investimentos.length > 0 ? (
                  <div className="space-y-3">
                    {objetivo.investimentos.map((investimento) => (
                      <div key={investimento.id} className="flex flex-col gap-3 p-4 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 transition-all group sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{investimento.nome}</p>
                          <p className="text-accent font-semibold">{formatCurrency(investimento.valor)}</p>
                        </div>
                        <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <InvestimentoForm
                            investimento={investimento}
                            onSubmit={(data) => handleEditInvestimento(objetivo.id, investimento.id, data)}
                            trigger={
                              <Button size="sm" variant="ghost" className="hover:bg-primary/10 flex-shrink-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <ConfirmationDialog
                            trigger={
                              <Button
                                size="sm"
                                variant="ghost"
                                className="hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                            title="Excluir Investimento"
                            description={`Tem certeza que deseja excluir o investimento "${investimento.nome}"? Esta ação não pode ser desfeita.`}
                            confirmText="Excluir"
                            onConfirm={() => handleDeleteInvestimento(objetivo.id, investimento.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">Nenhum investimento adicionado ainda</p>
                    <InvestimentoForm onSubmit={(data) => handleAddInvestimento(objetivo.id, data)} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && objetivos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhum objetivo definido ainda</p>
            <ObjetivoForm onSubmit={handleAddObjetivo} />
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}