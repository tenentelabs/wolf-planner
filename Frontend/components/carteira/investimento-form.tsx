"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import type { Investimento } from "@/types"

interface InvestimentoFormProps {
  onSubmit: (investimento: Omit<Investimento, "id">) => void
  investimento?: Investimento
  trigger?: React.ReactNode
}

export function InvestimentoForm({ onSubmit, investimento, trigger }: InvestimentoFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    nome: investimento?.nome || "",
    valor: investimento?.valor || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setOpen(false)
    if (!investimento) {
      setFormData({ nome: "", valor: 0 })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Investimento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{investimento ? "Editar Investimento" : "Adicionar Investimento"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Investimento</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Tesouro Direto, CDB, Ações..."
              required
            />
          </div>
          <div>
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: Number.parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">{investimento ? "Salvar" : "Adicionar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
