import { apiClient } from './client';
import type { Objetivo, Investimento } from '@/types';

export interface ObjetivoCreate {
  nome: string;
  cliente_id: string;
  valor_meta?: number | null;
}

export interface ObjetivoUpdate {
  nome?: string;
  valor_meta?: number | null;
}

export interface InvestimentoCreate {
  nome: string;
  valor: number;
  objetivo_id: string;
}

export interface InvestimentoUpdate {
  nome?: string;
  valor?: number;
}

export interface CarteiraCompleta {
  cliente_id: string;
  objetivos: Objetivo[];
  investimentos_por_objetivo: Record<string, Investimento[]>;
}

export const carteirasService = {
  // Objetivos
  async listarObjetivos(clienteId: string): Promise<Objetivo[]> {
    return apiClient.get<Objetivo[]>(`/carteiras/cliente/${clienteId}/objetivos`);
  },

  async criarObjetivo(data: ObjetivoCreate): Promise<Objetivo> {
    return apiClient.post<Objetivo>('/carteiras/objetivos', data);
  },

  async atualizarObjetivo(id: string, data: ObjetivoUpdate): Promise<Objetivo> {
    return apiClient.put<Objetivo>(`/carteiras/objetivos/${id}`, data);
  },

  async deletarObjetivo(id: string): Promise<void> {
    await apiClient.delete(`/carteiras/objetivos/${id}`);
  },

  // Investimentos
  async listarInvestimentos(objetivoId: string): Promise<Investimento[]> {
    return apiClient.get<Investimento[]>(`/carteiras/objetivo/${objetivoId}/investimentos`);
  },

  async criarInvestimento(data: InvestimentoCreate): Promise<Investimento> {
    return apiClient.post<Investimento>('/carteiras/investimentos', data);
  },

  async atualizarInvestimento(id: string, data: InvestimentoUpdate): Promise<Investimento> {
    return apiClient.put<Investimento>(`/carteiras/investimentos/${id}`, data);
  },

  async deletarInvestimento(id: string): Promise<void> {
    await apiClient.delete(`/carteiras/investimentos/${id}`);
  },

  // Carteira completa
  async obterCarteiraCompleta(clienteId: string): Promise<CarteiraCompleta> {
    return apiClient.get<CarteiraCompleta>(`/carteiras/cliente/${clienteId}/completa`);
  },
};