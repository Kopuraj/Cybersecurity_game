"use client"

import { Shield } from "lucide-react"

export function LoadingScreen({ message = "LOADING..." }: { message?: string }) {
  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="terminal-border rounded-full p-8 bg-card pulse-glow">
            <Shield className="h-16 w-16 text-primary animate-pulse" />
          </div>
        </div>
        <div className="text-primary text-2xl font-bold terminal-glow animate-pulse">{message}</div>
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
