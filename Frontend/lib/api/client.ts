interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        try {
          // Múltiplas tentativas de armazenamento para maior confiabilidade
          const storageOperations = [
            () => sessionStorage.setItem('auth_token', token),
            () => localStorage.setItem('auth_token', token),
            () => localStorage.setItem('auth_token_backup', token),
            () => {
              document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
            }
          ];

          storageOperations.forEach((operation, index) => {
            try {
              operation();
            } catch (e) {
              console.warn(`Storage operation ${index} failed:`, e);
            }
          });

          // Verificação adicional para mobile
          setTimeout(() => {
            if (!sessionStorage.getItem('auth_token')) {
              try {
                sessionStorage.setItem('auth_token', token);
              } catch (e) {
                console.warn('Delayed sessionStorage failed:', e);
              }
            }
          }, 50);

        } catch (e) {
          console.error('Token storage failed:', e);
        }
      } else {
        // Limpar todos os storages
        const clearOperations = [
          () => sessionStorage.removeItem('auth_token'),
          () => localStorage.removeItem('auth_token'),
          () => localStorage.removeItem('auth_token_backup'),
          () => {
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
          }
        ];

        clearOperations.forEach((operation, index) => {
          try {
            operation();
          } catch (e) {
            console.warn(`Clear operation ${index} failed:`, e);
          }
        });
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      // Try multiple storage methods for better mobile compatibility
      try {
        // Try sessionStorage first (mais confiável em alguns mobiles)
        this.token = sessionStorage.getItem('auth_token');
        
        // Then localStorage
        if (!this.token) {
          this.token = localStorage.getItem('auth_token');
        }
        
        // Then backup
        if (!this.token) {
          this.token = localStorage.getItem('auth_token_backup');
        }
        
        // Finally cookies
        if (!this.token) {
          const cookies = document.cookie.split(';');
          const authCookie = cookies.find(c => c.trim().startsWith('auth_token='));
          if (authCookie) {
            this.token = authCookie.split('=')[1];
          }
        }
      } catch (e) {
        console.warn('Storage access error:', e);
      }
    }
    return this.token;
  }

  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = options.token || this.getToken();

    console.log(`🌐 ApiClient: ${options.method || 'GET'} ${url}`);
    if (token) {
      console.log(`🔑 ApiClient: Usando token: ${token.substring(0, 20)}...`);
    } else {
      console.log('❌ ApiClient: Nenhum token disponível');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add any additional headers from options
    if (options.headers) {
      Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
        headers[key] = value;
      });
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('📋 ApiClient: Headers:', { ...headers, Authorization: headers.Authorization ? `Bearer ${token?.substring(0, 20)}...` : 'undefined' });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`📊 ApiClient: Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { detail: `HTTP ${response.status} ${response.statusText}` };
        }
        
        console.error('❌ ApiClient: Error response:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
          url
        });

        throw new ApiError(
          errorData.detail || `HTTP error! status: ${response.status}`,
          response.status,
          errorData
        );
      }

      // Handle empty responses
      const text = await response.text();
      const result = text ? JSON.parse(text) : {} as T;
      
      console.log('✅ ApiClient: Success response:', result);
      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('💥 ApiClient: API Error:', error);
        throw error;
      }
      
      const networkError = new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
      console.error('🔌 ApiClient: Network Error:', networkError);
      throw networkError;
    }
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient();