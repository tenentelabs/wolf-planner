import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hover?: boolean
    gradient?: boolean
    glow?: boolean
  }
>(({ className, hover = false, gradient = false, glow = false, ...props }, ref) => {
  const baseClasses = "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300"
  
  const hoverClasses = hover ? "hover:shadow-md hover:border-primary/20 hover:-translate-y-1" : ""
  const gradientClasses = gradient ? "bg-gradient-to-br from-card to-muted/20 border-gradient" : ""
  const glowClasses = glow ? "hover:shadow-lg hover:shadow-primary/10" : ""

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        hoverClasses,
        gradientClasses,
        glowClasses,
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Enhanced animated card wrapper
const AnimatedCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    delay?: number
    hover?: boolean
    gradient?: boolean
    glow?: boolean
  }
>(({ className, delay = 0, hover = true, gradient = false, glow = false, children, ...props }, ref) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={hover ? { y: -4 } : undefined}
  >
    <Card
      ref={ref}
      className={className}
      hover={hover}
      gradient={gradient}
      glow={glow}
      {...props}
    >
      {children}
    </Card>
  </motion.div>
))
AnimatedCard.displayName = "AnimatedCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, AnimatedCard }