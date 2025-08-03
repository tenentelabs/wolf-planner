import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/contexts/toast-context"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair"
})

export const metadata: Metadata = {
  title: "Wolf Planner - Gestão de Investimentos",
  description: "Sistema de gestão de clientes e investimentos",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ToastProvider>
            <AuthProvider>
              <Header />
              <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">{children}</main>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
