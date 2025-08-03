"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import type { Objetivo } from "@/types"

interface ObjetivoFormProps {
  onSubmit: (nome: string, valorMeta?: number) => void
  objetivo?: Objetivo
  trigger?: React.ReactNode
}

export function ObjetivoForm({ onSubmit, objetivo, trigger }: ObjetivoFormProps) {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState(objetivo?.nome || "")
  const [valorMeta, setValorMeta] = useState(objetivo?.valor_meta?.toString() || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const meta = valorMeta ? parseFloat(valorMeta) : undefined
    onSubmit(nome, meta)
    setOpen(false)
    if (!objetivo) {
      setNome("")
      setValorMeta("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Objetivo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{objetivo ? "Editar Objetivo" : "Adicionar Objetivo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Objetivo</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Aposentadoria, Casa própria, Viagem..."
              required
            />
          </div>
          <div>
            <Label htmlFor="valorMeta">Meta Financeira (Opcional)</Label>
            <Input
              id="valorMeta"
              type="number"
              step="0.01"
              min="0"
              value={valorMeta}
              onChange={(e) => setValorMeta(e.target.value)}
              placeholder="Ex: 15000 (deixe vazio se não quiser meta)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Defina um valor que você pretende atingir com este objetivo
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">{objetivo ? "Salvar" : "Adicionar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
