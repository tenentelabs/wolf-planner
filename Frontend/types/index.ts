export interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
}

export interface Investimento {
  id: string
  nome: string
  valor: number
}

export interface Objetivo {
  id: string
  nome: string
  investimentos: Investimento[]
}

export interface ClienteCarteira {
  clienteId: string
  objetivos: Objetivo[]
}
