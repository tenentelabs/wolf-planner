import { apiClient } from './client';
import type { Cliente } from '@/types';

export interface ClienteCreate {
  nome: string;
  email: string;
  telefone: string;
}

export interface ClienteUpdate extends ClienteCreate {}

export const clientesService = {
  async listar(): Promise<Cliente[]> {
    return apiClient.get<Cliente[]>('/clientes/');
  },

  async obter(id: string): Promise<Cliente> {
    return apiClient.get<Cliente>(`/clientes/${id}`);
  },

  async criar(data: ClienteCreate): Promise<Cliente> {
    return apiClient.post<Cliente>('/clientes/', data);
  },

  async atualizar(id: string, data: ClienteUpdate): Promise<Cliente> {
    return apiClient.put<Cliente>(`/clientes/${id}`, data);
  },

  async deletar(id: string): Promise<void> {
    await apiClient.delete(`/clientes/${id}`);
  },
};