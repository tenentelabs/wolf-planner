import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "./card"
import { Skeleton } from "./skeleton"

export function FadeInCard({ children, delay = 0, ...props }: { children: React.ReactNode; delay?: number } & React.ComponentProps<typeof Card>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card {...props}>
        {children}
      </Card>
    </motion.div>
  )
}

export function StaggeredContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggeredItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

export function PulseLoader({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`w-4 h-4 bg-primary rounded-full ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

export function SmartSkeleton({ 
  variant = "default",
  lines = 1,
  className = ""
}: { 
  variant?: "card" | "list" | "stats" | "default"
  lines?: number
  className?: string 
}) {
  if (variant === "card") {
    return (
      <div className={`border rounded-xl p-6 space-y-4 animate-pulse ${className}`}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    )
  }

  if (variant === "stats") {
    return (
      <div className={`border rounded-xl p-6 space-y-3 animate-pulse ${className}`}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    )
  }

  if (variant === "list") {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 animate-pulse">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  )
}