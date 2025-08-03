"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ObjetivoForm } from "@/components/carteira/objetivo-form"
import { InvestimentoForm } from "@/components/carteira/investimento-form"
import { clientesService } from "@/lib/api/clientes"
import { carteirasService } from "@/lib/api/carteiras"
import type { Cliente, Objetivo, Investimento } from "@/types"
import { Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

export default function CarteiraPage() {
  const params = useParams()
  const clienteId = params.clienteId as string

  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState(false)

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
      // Se for erro 404, significa que o cliente não foi encontrado
      if (err.status === 404) {
        setCliente(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddObjetivo = async (nome: string, valorMeta?: number) => {
    try {
      setLoadingAction(true)
      const newObjetivo = await carteirasService.criarObjetivo({
        nome,
        cliente_id: clienteId,
        valor_meta: valorMeta
      })
      setObjetivos([...objetivos, { ...newObjetivo, investimentos: [] }])
    } catch (err: any) {
      setError(err.message || "Erro ao criar objetivo")
    } finally {
      setLoadingAction(false)
    }
  }

  const handleEditObjetivo = async (objetivoId: string, nome: string, valorMeta?: number) => {
    try {
      setLoadingAction(true)
      const updatedObjetivo = await carteirasService.atualizarObjetivo(objetivoId, { nome, valor_meta: valorMeta })
      setObjetivos(objetivos.map((obj) => (obj.id === objetivoId ? { ...obj, nome: updatedObjetivo.nome, valor_meta: updatedObjetivo.valor_meta } : obj)))
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar objetivo")
    } finally {
      setLoadingAction(false)
    }
  }

  const handleDeleteObjetivo = async (objetivoId: string) => {
    try {
      setLoadingAction(true)
      await carteirasService.deletarObjetivo(objetivoId)
      setObjetivos(objetivos.filter((obj) => obj.id !== objetivoId))
    } catch (err: any) {
      setError(err.message || "Erro ao deletar objetivo")
    } finally {
      setLoadingAction(false)
    }
  }

  const handleAddInvestimento = async (objetivoId: string, investimentoData: Omit<Investimento, "id">) => {
    try {
      setLoadingAction(true)
      const newInvestimento = await carteirasService.criarInvestimento({
        nome: investimentoData.nome,
        valor: investimentoData.valor,
        objetivo_id: objetivoId
      })
      setObjetivos(objetivos.map((obj) =>
        obj.id === objetivoId ? { ...obj, investimentos: [...obj.investimentos, newInvestimento] } : obj
      ))
    } catch (err: any) {
      setError(err.message || "Erro ao criar investimento")
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
      const updatedInvestimento = await carteirasService.atualizarInvestimento(investimentoId, {
        nome: investimentoData.nome,
        valor: investimentoData.valor
      })
      setObjetivos(objetivos.map((obj) =>
        obj.id === objetivoId
          ? {
              ...obj,
              investimentos: obj.investimentos.map((inv) =>
                inv.id === investimentoId ? updatedInvestimento : inv
              ),
            }
          : obj
      ))
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar investimento")
    } finally {
      setLoadingAction(false)
    }
  }

  const handleDeleteInvestimento = async (objetivoId: string, investimentoId: string) => {
    try {
      setLoadingAction(true)
      await carteirasService.deletarInvestimento(investimentoId)
      setObjetivos(objetivos.map((obj) =>
        obj.id === objetivoId
          ? { ...obj, investimentos: obj.investimentos.filter((inv) => inv.id !== investimentoId) }
          : obj
      ))
    } catch (err: any) {
      setError(err.message || "Erro ao deletar investimento")
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
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
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
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/clientes">Clientes</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Carteira {cliente ? `- ${cliente.nome}` : ''}</BreadcrumbPage>
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
              <h1 className="text-4xl font-bold text-foreground">Carteira - {cliente.nome}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline">
              <Link href={`/dashboard/${clienteId}`}>Ver Dashboard</Link>
            </Button>
            <ObjetivoForm onSubmit={handleAddObjetivo} />
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
                <CardTitle className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span>{objetivo.nome}</span>
                      <span className="text-lg font-semibold text-accent">
                        {formatCurrency(getTotalObjetivo(objetivo))}
                      </span>
                    </div>
                    {(() => {
                      const progressoMeta = getProgressoMeta(objetivo)
                      if (progressoMeta) {
                        return (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm mb-1">
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
                  </div>
                  <div className="flex items-center space-x-2">
                    <InvestimentoForm onSubmit={(data) => handleAddInvestimento(objetivo.id, data)} />
                    <ObjetivoForm
                      objetivo={objetivo}
                      onSubmit={(nome, valorMeta) => handleEditObjetivo(objetivo.id, nome, valorMeta)}
                      trigger={
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <ConfirmationDialog
                      trigger={
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                      title="Excluir Objetivo"
                      description={`Tem certeza que deseja excluir o objetivo "${objetivo.nome}"? Esta ação não pode ser desfeita e todos os investimentos vinculados também serão removidos.`}
                      confirmText="Excluir"
                      onConfirm={() => handleDeleteObjetivo(objetivo.id)}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {objetivo.investimentos.length > 0 ? (
                  <div className="space-y-3">
                    {objetivo.investimentos.map((investimento) => (
                      <div key={investimento.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 transition-all group">
                        <div>
                          <p className="font-medium text-foreground">{investimento.nome}</p>
                          <p className="text-accent font-semibold">{formatCurrency(investimento.valor)}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <InvestimentoForm
                            investimento={investimento}
                            onSubmit={(data) => handleEditInvestimento(objetivo.id, investimento.id, data)}
                            trigger={
                              <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                                <Edit className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <ConfirmationDialog
                            trigger={
                              <Button
                                size="sm"
                                variant="ghost"
                                className="hover:bg-destructive/10 hover:text-destructive"
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