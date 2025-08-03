"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClienteForm } from "@/components/clientes/cliente-form"
import { clientesService } from "@/lib/api/clientes"
import type { Cliente } from "@/types"
import { Edit, Trash2, Target, BarChart3 } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ClienteCardSkeleton } from "@/components/ui/optimized-skeleton"
import { useToast } from "@/contexts/toast-context"
import { useCallback, useMemo } from "react"
import { StaggeredContainer, StaggeredItem, FadeInCard } from "@/components/ui/loading-states"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { success, error: showError } = useToast()

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clientesService.listar()
      setClientes(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar clientes")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCliente = useCallback(async (clienteData: Omit<Cliente, "id">) => {
    try {
      const newCliente = await clientesService.criar({
        nome: clienteData.nome,
        email: clienteData.email,
        telefone: clienteData.telefone,
      })
      setClientes([...clientes, newCliente])
      success("Cliente criado!", `${newCliente.nome} foi adicionado com sucesso.`)
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao criar cliente"
      setError(errorMessage)
      showError("Erro ao criar cliente", errorMessage)
    }
  }, [clientes, success, showError])

  const handleEditCliente = useCallback(async (clienteId: string, clienteData: Omit<Cliente, "id">) => {
    try {
      const updatedCliente = await clientesService.atualizar(clienteId, {
        nome: clienteData.nome,
        email: clienteData.email,
        telefone: clienteData.telefone,
      })
      setClientes(clientes.map((cliente) => (cliente.id === clienteId ? updatedCliente : cliente)))
      success("Cliente atualizado!", `Dados de ${updatedCliente.nome} foram salvos.`)
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao atualizar cliente"
      setError(errorMessage)
      showError("Erro ao atualizar cliente", errorMessage)
    }
  }, [clientes, success, showError])

  const handleDeleteCliente = useCallback(async (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId)
    try {
      await clientesService.deletar(clienteId)
      setClientes(clientes.filter((cliente) => cliente.id !== clienteId))
      success("Cliente removido!", `${cliente?.nome || 'Cliente'} foi excluído com sucesso.`)
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao deletar cliente"
      setError(errorMessage)
      showError("Erro ao deletar cliente", errorMessage)
    }
  }, [clientes, success, showError])

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-foreground">Clientes</h1>
        <ClienteForm onSubmit={handleAddCliente} />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <ClienteCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <StaggeredContainer className="grid gap-6">
        {clientes.map((cliente, index) => (
          <StaggeredItem key={cliente.id}>
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl">{cliente.nome}</span>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="secondary" className="hover:bg-primary hover:text-primary-foreground">
                    <Link href={`/carteira/${cliente.id}`}>
                      <Target className="h-4 w-4 mr-2" />
                      Carteira
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="secondary" className="hover:bg-accent hover:text-accent-foreground">
                    <Link href={`/dashboard/${cliente.id}`}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span className="text-foreground">{cliente.email}</span>
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="font-medium">Telefone:</span>
                    <span className="text-foreground">{cliente.telefone}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ClienteForm
                    cliente={cliente}
                    onSubmit={(data) => handleEditCliente(cliente.id, data)}
                    trigger={
                      <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                        <Edit className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <ConfirmationDialog
                    trigger={
                      <Button size="sm" variant="ghost" className="hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
                    title="Excluir Cliente"
                    description={`Tem certeza que deseja excluir o cliente "${cliente.nome}"? Esta ação não pode ser desfeita e todos os dados relacionados (objetivos e investimentos) também serão removidos.`}
                    confirmText="Excluir"
                    onConfirm={() => handleDeleteCliente(cliente.id)}
                  />
                </div>
              </div>
            </CardContent>
            </Card>
          </StaggeredItem>
        ))}
        </StaggeredContainer>
      )}

      {!loading && clientes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhum cliente cadastrado ainda</p>
          <ClienteForm onSubmit={handleAddCliente} />
        </div>
      )}
      </div>
    </ProtectedRoute>
  )
}
