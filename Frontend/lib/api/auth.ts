import { apiClient } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  // Add more fields if needed
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    apiClient.setToken(response.access_token);
    return response;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    apiClient.setToken(response.access_token);
    return response;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      apiClient.setToken(null);
    }
  },

  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  },
};