import { Shield } from "lucide-react"

interface TerminalHeaderProps {
  title: string
  subtitle?: string
  progress?: number
}

export function TerminalHeader({ title, subtitle, progress }: TerminalHeaderProps) {
  return (
    <div className="terminal-border bg-card p-6 rounded-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold terminal-glow">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {progress !== undefined && (
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{progress}%</div>
            <div className="text-xs text-muted-foreground">PROGRESS</div>
          </div>
        )}
      </div>
      {progress !== undefined && (
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
