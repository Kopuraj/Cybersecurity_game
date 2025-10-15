"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { CheckCircle, XCircle, Shield, Wifi, AlertTriangle } from "lucide-react"

const WIFI_NETWORKS = [
  { id: 1, name: "Free_Campus_Guest", security: "Open", isSafe: false },
  { id: 2, name: "Student_Network_Secure", security: "WPA3", isSafe: true },
  { id: 3, name: "COFFEE_SHOP_FREE", security: "Open", isSafe: false },
]

export default function Chapter4ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const networkId = Number.parseInt(searchParams.get("network") || "1")
  const useVPN = searchParams.get("vpn") === "true"
  const isCorrect = searchParams.get("correct") === "true"
  const points = Number.parseInt(searchParams.get("points") || "0")
  const score = Number.parseInt(searchParams.get("score") || "0")

  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowResults(true), 500)
  }, [])

  const network = WIFI_NETWORKS.find((n) => n.id === networkId)

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader title="CHAPTER 4: RESULTS" subtitle="WiFi Security Assessment" progress={100} />

        {showResults && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="terminal-border bg-card p-8 rounded-lg text-center">
              {isCorrect ? (
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-success" />
              ) : (
                <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
              )}
              <h2 className="text-4xl font-bold mb-2">YOUR SCORE: {score}/100</h2>
              <p className="text-lg text-muted-foreground mb-2">
                Network: {network?.name} ({network?.security})
              </p>
              <p className="text-lg text-muted-foreground">VPN: {useVPN ? "Enabled" : "Disabled"}</p>
              <p className="text-2xl font-bold mt-4">POINTS EARNED: {points}/25</p>
            </div>

            <div className="terminal-border bg-card p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">WIFI SECURITY EDUCATION</h3>

              <div className="space-y-4">
                <div className="terminal-border bg-background p-4 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertTriangle className="h-6 w-6 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg text-destructive">Public WiFi Risks</h4>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-9">
                    <li>
                      <strong className="text-foreground">Data Interception:</strong> Hackers can capture unencrypted
                      data on open networks
                    </li>
                    <li>
                      <strong className="text-foreground">Man-in-the-Middle Attacks:</strong> Attackers position
                      themselves between you and the connection
                    </li>
                    <li>
                      <strong className="text-foreground">Fake Hotspots:</strong> Malicious networks mimicking
                      legitimate ones
                    </li>
                    <li>
                      <strong className="text-foreground">Session Hijacking:</strong> Stealing active login sessions
                    </li>
                    <li>
                      <strong className="text-foreground">Malware Distribution:</strong> Infected networks can push
                      malware to devices
                    </li>
                  </ul>
                </div>

                <div className="terminal-border bg-background p-4 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <Wifi className="h-6 w-6 text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg">Network Security Levels</h4>
                    </div>
                  </div>
                  <div className="space-y-3 ml-9">
                    <div>
                      <p className="font-bold text-destructive">Open Networks (No Password)</p>
                      <p className="text-sm text-muted-foreground">
                        Highest risk - all traffic visible to anyone on the network
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-warning">WEP/WPA (Weak Encryption)</p>
                      <p className="text-sm text-muted-foreground">Outdated security - easily cracked</p>
                    </div>
                    <div>
                      <p className="font-bold text-success">WPA2/WPA3 (Strong Encryption)</p>
                      <p className="text-sm text-muted-foreground">Modern security standards - much safer</p>
                    </div>
                  </div>
                </div>

                <div className="terminal-border bg-primary/20 border-primary p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-primary mb-2">Protection Strategies</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>
                          <strong className="text-foreground">Always use a VPN on public WiFi</strong> - Encrypts all
                          your traffic
                        </li>
                        <li>
                          <strong className="text-foreground">Prefer secure networks (WPA2/WPA3)</strong> - Look for
                          password-protected networks
                        </li>
                        <li>
                          <strong className="text-foreground">Verify network names</strong> - Confirm with staff to
                          avoid fake hotspots
                        </li>
                        <li>
                          <strong className="text-foreground">Disable auto-connect</strong> - Prevent automatic
                          connections to unknown networks
                        </li>
                        <li>
                          <strong className="text-foreground">Use HTTPS websites only</strong> - Look for the padlock
                          icon
                        </li>
                        <li>
                          <strong className="text-foreground">Avoid sensitive transactions</strong> - Don't do banking
                          or enter passwords on public WiFi
                        </li>
                        <li>
                          <strong className="text-foreground">Turn off file sharing</strong> - Disable network discovery
                          features
                        </li>
                        <li>
                          <strong className="text-foreground">Keep firewall enabled</strong> - Add an extra layer of
                          protection
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="terminal-border bg-success/20 border-success p-4 rounded-lg">
                  <p className="text-sm">
                    <strong className="text-success">Pro Tip:</strong> When traveling or working remotely, invest in a
                    reliable VPN service. It's your best defense against public WiFi threats and costs less than a
                    coffee per month!
                  </p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => router.push("/game/scorecard")}
              className="w-full terminal-border bg-primary hover:bg-primary/90"
            >
              VIEW FINAL SCORECARD
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
