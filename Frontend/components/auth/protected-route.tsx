"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/utils";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logger.debug(`🛡️ ProtectedRoute: loading=${loading}, isAuthenticated=${isAuthenticated}`);
    
    if (!loading && !isAuthenticated) {
      logger.info('🚫 ProtectedRoute: Usuário não autenticado - redirecionando para login');
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-pulse rounded-full h-8 w-8 bg-muted"></div>
        <p className="text-sm text-muted-foreground">Redirecionando...</p>
      </div>
    );
  }

  logger.debug('✅ ProtectedRoute: Usuário autenticado - renderizando conteúdo');
  return <>{children}</>;
}