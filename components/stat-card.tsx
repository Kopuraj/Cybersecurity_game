"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  color?: "primary" | "secondary" | "accent" | "warning"
  className?: string
}

export function StatCard({ icon: Icon, label, value, color = "primary", className }: StatCardProps) {
  const colorClasses = {
    primary: "text-primary border-primary/30",
    secondary: "text-secondary border-secondary/30",
    accent: "text-accent border-accent/30",
    warning: "text-warning border-warning/30",
  }

  return (
    <div className={cn("terminal-border bg-card p-6 rounded-lg hover:bg-card/80 transition-all", className)}>
      <Icon className={cn("h-8 w-8 mb-3", colorClasses[color])} />
      <div className={cn("text-3xl font-bold mb-2", colorClasses[color])}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}
