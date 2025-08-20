"use client"

import { useState, useEffect, useCallback } from "react"
import { clientesService } from "@/lib/api/clientes"
import { carteirasService } from "@/lib/api/carteiras"
import type { Cliente, Objetivo } from "@/types"

interface UseClienteDataReturn {
  cliente: Cliente | null
  objetivos: Objetivo[]
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

// Cache simple para evitar requests duplicados
const dataCache = new Map<string, {
  data: { cliente: Cliente | null; objetivos: Objetivo[] }
  timestamp: number
}>()

const CACHE_DURATION = 30 * 1000 // 30 segundos

export function useClienteData(clienteId: string): UseClienteDataReturn {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async (useCache = true) => {
    try {
      setLoading(true)
      setError(null)

      // Verificar cache se solicitado
      if (useCache) {
        const cached = dataCache.get(clienteId)
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setCliente(cached.data.cliente)
          setObjetivos(cached.data.objetivos)
          setLoading(false)
          return
        }
      }
      
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

      // Atualizar cache
      dataCache.set(clienteId, {
        data: { cliente: clienteData, objetivos: objetivosComInvestimentos },
        timestamp: Date.now()
      })
      
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados")
      // Se for erro 404, cliente não foi encontrado
      if (err.status === 404) {
        setCliente(null)
      }
    } finally {
      setLoading(false)
    }
  }, [clienteId])

  const refreshData = useCallback(() => loadData(false), [loadData])

  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    cliente,
    objetivos,
    loading,
    error,
    refreshData
  }
}