import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

// Sistema de logs condicionais para desenvolvimento
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     (typeof window !== 'undefined' && window.location.hostname === 'localhost');

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(message, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.warn(message, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    // Sempre mostrar erros
    console.error(message, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(message, ...args);
    }
  }
};
