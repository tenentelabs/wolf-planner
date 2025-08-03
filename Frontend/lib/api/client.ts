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
        // Set cookie with httpOnly would be better but requires server-side handling
        document.cookie = `auth_token=${token}; path=/; max-age=3600; SameSite=Strict`;
        localStorage.setItem('auth_token', token);
      } else {
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('auth_token');
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      // Try localStorage first
      this.token = localStorage.getItem('auth_token');
      
      // If not in localStorage, try cookies
      if (!this.token) {
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(c => c.trim().startsWith('auth_token='));
        if (authCookie) {
          this.token = authCookie.split('=')[1];
        }
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