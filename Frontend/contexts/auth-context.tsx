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
    const checkAuth = async (retryCount = 0) => {
      console.log(`🔍 AuthContext: Iniciando verificação de autenticação... (tentativa ${retryCount + 1})`);
      
      const token = apiClient.getToken();
      console.log('🔑 AuthContext: Token recuperado do storage:', token ? `${token.substring(0, 20)}...` : 'null');
      
      if (token) {
        try {
          console.log('🌐 AuthContext: Validando token com /auth/me...');
          
          // Tentar fazer uma requisição autenticada para validar o token
          const response = await apiClient.get('/auth/me');
          console.log('✅ AuthContext: Resposta do /auth/me:', response);
          
          if (response && response.email) {
            const userData = { id: response.id || 'user', email: response.email };
            console.log('👤 AuthContext: Usuário autenticado:', userData);
            setUser(userData);
            
            // Atualizar cache com dados válidos
            localStorage.setItem('cached_user_data', JSON.stringify(userData));
          } else {
            console.warn('⚠️ AuthContext: Resposta inválida do /auth/me - limpando token');
            apiClient.setToken(null);
            setUser(null);
            localStorage.removeItem('cached_user_data');
          }
        } catch (error: any) {
          console.error('❌ AuthContext: Erro na validação do token:', {
            message: error.message,
            status: error.status,
            data: error.data,
            stack: error.stack
          });
          
          // Diferenciar tipos de erro
          if (error.status === 401 || error.status === 403) {
            console.warn('🚫 AuthContext: Token expirado/inválido (401/403) - desconectando usuário');
            apiClient.setToken(null);
            setUser(null);
            localStorage.removeItem('cached_user_data');
          } else if (error.status === 0 && retryCount < 2) {
            // Erro de rede - tentar novamente até 3 vezes
            console.warn(`🔄 AuthContext: Erro de rede - tentando novamente em 2s (tentativa ${retryCount + 1}/3)`);
            setTimeout(() => {
              checkAuth(retryCount + 1);
            }, 2000);
            return; // Não continuar com o loading = false
          } else {
            console.warn('🔌 AuthContext: Erro de rede/servidor persistente - usando cache se disponível');
            // Em caso de erro de rede persistente, usar dados cached se disponíveis
            const cachedUserData = localStorage.getItem('cached_user_data');
            if (cachedUserData) {
              try {
                const userData = JSON.parse(cachedUserData);
                setUser(userData);
                console.log('💾 AuthContext: Usando dados cached do usuário:', userData);
              } catch (e) {
                console.error('❌ AuthContext: Erro ao recuperar dados cached:', e);
                setUser(null);
              }
            } else {
              setUser(null);
            }
          }
        }
      } else {
        console.log('❌ AuthContext: Nenhum token encontrado - usuário não autenticado');
        setUser(null);
      }
      
      console.log('✅ AuthContext: Verificação concluída');
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('🔐 AuthContext: Iniciando login...');
      const response = await authService.login(credentials);
      
      console.log('✅ AuthContext: Login bem-sucedido:', response.user);
      setUser(response.user);
      
      // Cache dos dados do usuário para fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem('cached_user_data', JSON.stringify(response.user));
        console.log('💾 AuthContext: Dados do usuário armazenados em cache');
      }
      
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
      console.error('❌ AuthContext: Erro no login:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log('📝 AuthContext: Iniciando registro...');
      
      // Registrar usuário
      const response = await authService.register(data);
      console.log('✅ AuthContext: Registro bem-sucedido:', response.user);
      
      // Garantir que o token foi definido
      if (response.access_token) {
        apiClient.setToken(response.access_token);
      }
      
      // Aguardar um momento para o token ser persistido
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Definir usuário no estado
      setUser(response.user);
      
      // Cache dos dados do usuário para fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem('cached_user_data', JSON.stringify(response.user));
        console.log('💾 AuthContext: Dados do usuário armazenados em cache');
      }
      
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
      console.error('❌ AuthContext: Erro no registro:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 AuthContext: Iniciando logout...');
      await authService.logout();
      setUser(null);
      
      // Limpar cache do usuário
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cached_user_data');
        console.log('🗑️ AuthContext: Cache do usuário removido');
      }
      
      router.push('/login');
    } catch (error) {
      console.error('❌ AuthContext: Erro no logout:', error);
      // Even if logout fails on the server, clear local state
      apiClient.setToken(null);
      setUser(null);
      
      // Limpar cache do usuário
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cached_user_data');
      }
      
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