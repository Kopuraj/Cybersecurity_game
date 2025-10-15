interface SecurityStatusProps {
  riskLevel: "low" | "medium" | "high"
  encryption: boolean
  vpn: boolean
}

export function SecurityStatus({ riskLevel, encryption, vpn }: SecurityStatusProps) {
  const riskColors = {
    low: "text-success",
    medium: "text-warning",
    high: "text-destructive",
  }

  const riskLabels = {
    low: "LOW",
    medium: "MEDIUM",
    high: "HIGH",
  }

  return (
    <div className="terminal-border bg-card p-4 rounded-lg space-y-4">
      <h3 className="text-lg font-bold text-foreground mb-3">SECURITY STATUS</h3>

      {/* Risk Meter */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">RISK STATUS</div>
        <div className="relative h-24 w-24 mx-auto">
          <svg className="transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${riskLevel === "high" ? 251 : riskLevel === "medium" ? 167 : 84} 251`}
              className={riskColors[riskLevel]}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${riskColors[riskLevel]}`}>{riskLabels[riskLevel]}</span>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Encryption:</span>
          <span className={encryption ? "text-success" : "text-destructive"}>
            {encryption ? "ENABLED" : "DISABLED"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">VPN:</span>
          <span className={vpn ? "text-success" : "text-destructive"}>{vpn ? "CONNECTED" : "DISCONNECTED"}</span>
        </div>
      </div>
    </div>
  )
}
