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

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(
          error.detail || `HTTP error! status: ${response.status}`,
          response.status,
          error
        );
      }

      // Handle empty responses
      const text = await response.text();
      return text ? JSON.parse(text) : {} as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
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