import type { Cliente, ClienteCarteira } from "@/types"

export const mockClientes: Cliente[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 99999-9999",
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria.santos@email.com",
    telefone: "(11) 88888-8888",
  },
  {
    id: "3",
    nome: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    telefone: "(11) 77777-7777",
  },
]

export const mockCarteiras: ClienteCarteira[] = [
  {
    clienteId: "1",
    objetivos: [
      {
        id: "1",
        nome: "Aposentadoria",
        investimentos: [
          { id: "1", nome: "Previdência Privada", valor: 30000 },
          { id: "2", nome: "Fundos de ações", valor: 20000 },
        ],
      },
      {
        id: "2",
        nome: "Faculdade dos Filhos",
        investimentos: [
          { id: "3", nome: "Tesouro Direto", valor: 10000 },
          { id: "4", nome: "Fundo multimercado", valor: 10000 },
        ],
      },
    ],
  },
  {
    clienteId: "2",
    objetivos: [
      {
        id: "3",
        nome: "Casa Própria",
        investimentos: [
          { id: "5", nome: "Poupança", valor: 15000 },
          { id: "6", nome: "CDB", valor: 25000 },
        ],
      },
    ],
  },
]
