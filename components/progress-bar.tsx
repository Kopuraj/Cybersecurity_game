"use client"

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  color?: "primary" | "secondary" | "accent" | "warning" | "destructive" | "success"
}

export function ProgressBar({ value, max = 100, className, showLabel = false, color = "primary" }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-accent",
    warning: "bg-warning",
    destructive: "bg-destructive",
    success: "bg-success",
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted terminal-border">
        <div
          className={cn("h-full transition-all duration-500 ease-out", colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-sm text-muted-foreground text-right font-mono">
          {value} / {max}
        </div>
      )}
    </div>
  )
}
