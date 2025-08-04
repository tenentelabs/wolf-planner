"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type LoginCredentials, type RegisterData, type AuthResponse } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/utils';

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
      logger.debug(`🔍 AuthContext: Iniciando verificação de autenticação... (tentativa ${retryCount + 1})`);
      
      const token = apiClient.getToken();
      logger.debug('🔑 AuthContext: Token recuperado do storage:', token ? `${token.substring(0, 20)}...` : 'null');
      
      if (token) {
        try {
          logger.debug('🌐 AuthContext: Validando token com /auth/me...');
          
          // Tentar fazer uma requisição autenticada para validar o token (com timeout)
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
          
          const response = await apiClient.get('/auth/me', { signal: controller.signal });
          clearTimeout(timeoutId);
          
          logger.debug('✅ AuthContext: Resposta do /auth/me:', response);
          
          if (response && response.email) {
            const userData = { id: response.id || 'user', email: response.email };
            logger.info('👤 AuthContext: Usuário autenticado:', userData);
            setUser(userData);
            
            // Atualizar cache com dados válidos
            localStorage.setItem('cached_user_data', JSON.stringify(userData));
          } else {
            logger.warn('⚠️ AuthContext: Resposta inválida do /auth/me - limpando token');
            apiClient.setToken(null);
            setUser(null);
            localStorage.removeItem('cached_user_data');
          }
        } catch (error: any) {
          logger.error('❌ AuthContext: Erro na validação do token:', {
            message: error.message,
            status: error.status,
            name: error.name
          });
          
          // Diferenciar tipos de erro
          if (error.status === 401 || error.status === 403) {
            logger.warn('🚫 AuthContext: Token expirado/inválido (401/403) - desconectando usuário');
            apiClient.setToken(null);
            setUser(null);
            localStorage.removeItem('cached_user_data');
          } else if ((error.status === 0 || error.name === 'AbortError') && retryCount === 0) {
            // Apenas 1 retry para evitar delays longos
            logger.warn(`🔄 AuthContext: Erro de rede - tentando novamente (${retryCount + 1}/2)`);
            setTimeout(() => {
              checkAuth(retryCount + 1);
            }, 1000); // Reduzido para 1s
            return;
          } else {
            logger.warn('🔌 AuthContext: Usando cache se disponível');
            // Em caso de erro persistente, usar dados cached
            const cachedUserData = localStorage.getItem('cached_user_data');
            if (cachedUserData) {
              try {
                const userData = JSON.parse(cachedUserData);
                setUser(userData);
                logger.info('💾 AuthContext: Usando dados cached do usuário:', userData);
              } catch (e) {
                logger.error('❌ AuthContext: Erro ao recuperar dados cached:', e);
                setUser(null);
              }
            } else {
              setUser(null);
            }
          }
        }
      } else {
        logger.debug('❌ AuthContext: Nenhum token encontrado - usuário não autenticado');
        setUser(null);
      }
      
      logger.debug('✅ AuthContext: Verificação concluída');
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      logger.debug('🔐 AuthContext: Iniciando login...');
      const response = await authService.login(credentials);
      
      logger.info('✅ AuthContext: Login bem-sucedido');
      setUser(response.user);
      
      // Cache dos dados do usuário para fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem('cached_user_data', JSON.stringify(response.user));
        logger.debug('💾 AuthContext: Dados do usuário armazenados em cache');
      }
      
      // Navegação otimizada
      await router.replace('/clientes');
      
      // Fallback reduzido
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          if (window.location.pathname === '/login') {
            window.location.href = '/clientes';
          }
        }, 300); // Reduzido de 500ms para 300ms
      }
    } catch (error) {
      logger.error('❌ AuthContext: Erro no login:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      logger.debug('📝 AuthContext: Iniciando registro...');
      
      // Registrar usuário
      const response = await authService.register(data);
      logger.info('✅ AuthContext: Registro bem-sucedido');
      
      // Garantir que o token foi definido
      if (response.access_token) {
        apiClient.setToken(response.access_token);
      }
      
      // Reduzir delays para melhor performance
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Definir usuário no estado
      setUser(response.user);
      
      // Cache dos dados do usuário para fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem('cached_user_data', JSON.stringify(response.user));
        logger.debug('💾 AuthContext: Dados do usuário armazenados em cache');
      }
      
      // Delay mínimo para sincronização
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Navegação otimizada
      await router.replace('/clientes');
      
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          if (window.location.pathname === '/register') {
            window.location.href = '/clientes';
          }
        }, 300); // Reduzido de 500ms para 300ms
      }
    } catch (error) {
      logger.error('❌ AuthContext: Erro no registro:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      logger.debug('🚪 AuthContext: Iniciando logout...');
      await authService.logout();
      setUser(null);
      
      // Limpar cache do usuário
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cached_user_data');
        logger.debug('🗑️ AuthContext: Cache do usuário removido');
      }
      
      router.push('/login');
    } catch (error) {
      logger.error('❌ AuthContext: Erro no logout:', error);
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