"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TerminalHeader } from "@/components/terminal-header"
import { Lock, Fish, Link2, Wifi, Shield, ArrowLeft } from "lucide-react"

const SECURITY_TIPS = [
  {
    category: "Password Security",
    icon: Lock,
    color: "text-primary",
    tips: [
      "Use at least 12-14 characters for strong passwords",
      "Mix uppercase, lowercase, numbers, and special characters",
      "Never reuse passwords across different accounts",
      "Use a password manager to store credentials securely",
      "Enable two-factor authentication (2FA) whenever possible",
      "Change passwords immediately if you suspect a breach",
    ],
  },
  {
    category: "Phishing Protection",
    icon: Fish,
    color: "text-secondary",
    tips: [
      "Verify sender email addresses carefully before responding",
      "Never click links in suspicious or unexpected emails",
      "Look for spelling errors and grammatical mistakes",
      "Hover over links to check actual destination URLs",
      "Contact organizations directly if you're unsure about a message",
      "Report phishing attempts to your IT department",
    ],
  },
  {
    category: "Link Safety",
    icon: Link2,
    color: "text-accent",
    tips: [
      "Always check URLs before clicking on links",
      "Look for HTTPS and the padlock icon in your browser",
      "Be wary of shortened URLs that hide the destination",
      "Use link scanning tools to check for malicious content",
      "Verify the domain matches the claimed sender",
      "Avoid clicking links in unsolicited messages",
    ],
  },
  {
    category: "WiFi Security",
    icon: Wifi,
    color: "text-warning",
    tips: [
      "Always use a VPN on public WiFi networks",
      "Prefer networks with WPA2 or WPA3 encryption",
      "Avoid sensitive transactions on public networks",
      "Disable auto-connect features on your devices",
      "Verify network names with staff before connecting",
      "Turn off file sharing when on public WiFi",
    ],
  },
  {
    category: "General Security",
    icon: Shield,
    color: "text-success",
    tips: [
      "Keep your software and operating system updated",
      "Use antivirus and anti-malware protection",
      "Back up your important data regularly",
      "Be cautious about what you share on social media",
      "Review app permissions and privacy settings",
      "Use encrypted messaging apps for sensitive communications",
    ],
  },
]

export default function SecurityTipsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen cyber-grid p-8">
      <div className="max-w-6xl mx-auto">
        <TerminalHeader title="SECURITY TIPS" subtitle="Essential cybersecurity best practices" />

        <div className="space-y-6">
          {SECURITY_TIPS.map((section) => {
            const Icon = section.icon

            return (
              <div key={section.category} className="terminal-border bg-card p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="terminal-border rounded-full p-3 bg-background">
                    <Icon className={`h-8 w-8 ${section.color}`} />
                  </div>
                  <h2 className="text-2xl font-bold">{section.category}</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {section.tips.map((tip, index) => (
                    <div key={index} className="terminal-border bg-background p-4 rounded-lg flex items-start gap-3">
                      <div className={`mt-1 ${section.color}`}>•</div>
                      <p className="text-sm text-foreground leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Resources */}
        <div className="mt-8 terminal-border bg-card p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">ADDITIONAL RESOURCES</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• Visit your organization's IT security page for specific policies and guidelines</p>
            <p>• Report security incidents immediately to your IT department</p>
            <p>• Stay informed about the latest cybersecurity threats and trends</p>
            <p>• Participate in regular security awareness training</p>
            <p>• Use official security tools and software recommended by your organization</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button variant="outline" className="terminal-border bg-transparent" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            BACK TO HOME
          </Button>
          <Button
            className="terminal-border bg-primary hover:bg-primary/90"
            onClick={() => router.push("/character-creation")}
          >
            START QUEST
          </Button>
        </div>
      </div>
    </div>
  )
}
