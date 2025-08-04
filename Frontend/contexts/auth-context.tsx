"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type LoginCredentials, type RegisterData, type AuthResponse } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = apiClient.getToken();
      if (token) {
        try {
          // Tentar fazer uma requisição autenticada para validar o token
          const response = await apiClient.get('/auth/me');
          if (response && response.email) {
            setUser({ id: response.id || 'user', email: response.email });
          } else {
            // Token inválido, limpar
            apiClient.setToken(null);
            setUser(null);
          }
        } catch (error) {
          // Token expirado ou inválido
          console.warn('Token validation failed:', error);
          apiClient.setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      
      // Solução mais robusta para navegação que funciona em mobile
      // Usar replace ao invés de push para evitar problemas de histórico
      await router.replace('/clientes');
      
      // Forçar recarregamento se necessário (especialmente em mobile)
      if (typeof window !== 'undefined') {
        // Pequeno delay e então verificar se a navegação ocorreu
        setTimeout(() => {
          if (window.location.pathname === '/login') {
            window.location.href = '/clientes';
          }
        }, 500);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // Registrar usuário
      const response = await authService.register(data);
      
      // Garantir que o token foi definido
      if (response.access_token) {
        apiClient.setToken(response.access_token);
      }
      
      // Aguardar um momento para o token ser persistido
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Definir usuário no estado
      setUser(response.user);
      
      // Aguardar outro momento para o estado ser atualizado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Usar a mesma lógica robusta do login
      await router.replace('/clientes');
      
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          if (window.location.pathname === '/register') {
            window.location.href = '/clientes';
          }
        }, 500);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      // Even if logout fails on the server, clear local state
      apiClient.setToken(null);
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}