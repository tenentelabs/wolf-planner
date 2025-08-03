import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, XCircle, Info, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "success" | "warning" | "error" | "info" | "loading"
  message?: string
  size?: "sm" | "md" | "lg"
  className?: string
  animate?: boolean
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200"
  },
  warning: {
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200"
  },
  error: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200"
  },
  info: {
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200"
  },
  loading: {
    icon: Loader2,
    color: "text-primary",
    bg: "bg-primary/5",
    border: "border-primary/20"
  }
}

const sizeConfig = {
  sm: {
    icon: "h-4 w-4",
    container: "p-2",
    text: "text-xs"
  },
  md: {
    icon: "h-5 w-5",
    container: "p-3",
    text: "text-sm"
  },
  lg: {
    icon: "h-6 w-6",
    container: "p-4",
    text: "text-base"
  }
}

export function StatusIndicator({ 
  status, 
  message, 
  size = "md", 
  className = "",
  animate = true 
}: StatusIndicatorProps) {
  const config = statusConfig[status]
  const sizes = sizeConfig[size]
  const Icon = config.icon
  
  const iconElement = status === "loading" ? (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Icon className={cn(sizes.icon, config.color)} />
    </motion.div>
  ) : (
    <Icon className={cn(sizes.icon, config.color)} />
  )

  if (!message) {
    return iconElement
  }

  const container = (
    <div className={cn(
      "flex items-center gap-2 rounded-lg border",
      config.bg,
      config.border,
      sizes.container,
      className
    )}>
      {iconElement}
      <span className={cn("font-medium", config.color, sizes.text)}>
        {message}
      </span>
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {container}
      </motion.div>
    )
  }

  return container
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className = "",
  showLabel = false,
  color = "primary",
  animated = true 
}: { 
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  color?: "primary" | "success" | "warning" | "error"
  animated?: boolean
}) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colorClasses = {
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-amber-500",
    error: "bg-red-500"
  }

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Progresso</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", colorClasses[color])}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.8, ease: "easeOut" } : undefined}
        />
      </div>
    </div>
  )
}

export function PulsingDot({ 
  color = "primary",
  size = "md",
  className = ""
}: {
  color?: "primary" | "success" | "warning" | "error"
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const colorClasses = {
    primary: "bg-primary",
    success: "bg-green-500", 
    warning: "bg-amber-500",
    error: "bg-red-500"
  }

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  }

  return (
    <motion.div
      className={cn(
        "rounded-full",
        colorClasses[color],
        sizeClasses[size],
        className
      )}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}