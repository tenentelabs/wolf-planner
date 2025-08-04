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
  onSubmit: (nome: string, valorMeta?: number | null) => void
  objetivo?: Objetivo
  trigger?: React.ReactNode
}

export function ObjetivoForm({ onSubmit, objetivo, trigger }: ObjetivoFormProps) {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState(objetivo?.nome || "")
  const [valorMeta, setValorMeta] = useState(objetivo?.valor_meta?.toString() || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Se o campo estiver vazio, enviar null para remover a meta
    // Se tiver valor, converter para float
    // Se for 0, manter como 0
    let meta: number | null | undefined = undefined
    
    if (valorMeta === "" || valorMeta === null) {
      // Campo vazio = remover meta (enviar null)
      meta = null
    } else {
      const parsedValue = parseFloat(valorMeta)
      if (!isNaN(parsedValue) && parsedValue >= 0) {
        meta = parsedValue
      } else {
        meta = null // Valor inválido = remover meta
      }
    }
    
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
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Adicionar Objetivo</span>
            <span className="sm:hidden">Novo Objetivo</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="valorMeta">Meta Financeira (Opcional)</Label>
              {objetivo && objetivo.valor_meta && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setValorMeta("")}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Remover Meta
                </Button>
              )}
            </div>
            <Input
              id="valorMeta"
              type="number"
              step="0.01"
              min="0"
              value={valorMeta}
              onChange={(e) => setValorMeta(e.target.value)}
              placeholder="Ex: 15000 (deixe vazio para remover meta)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {valorMeta ? 
                "Defina um valor que você pretende atingir com este objetivo" :
                "Deixe vazio para não ter meta financeira"
              }
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
