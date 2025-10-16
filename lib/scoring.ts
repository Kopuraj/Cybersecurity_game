// Scoring utilities for CyberSafe Quest

export interface ScoreUpdate {
  category: "password" | "phishing" | "link" | "network"
  points: number
  isCorrect: boolean
}

export function calculatePasswordStrength(password: string): {
  score: number
  strength: string
  feedback: string[]
} {
  let score = 0
  const feedback: string[] = []

  // Length scoring
  if (password.length >= 8) score += 20
  if (password.length >= 12) score += 20
  if (password.length >= 14) score += 20

  // Character variety
  if (/[a-z]/.test(password)) {
    score += 10
  } else {
    feedback.push("Add lowercase letters")
  }

  if (/[A-Z]/.test(password)) {
    score += 10
  } else {
    feedback.push("Add uppercase letters")
  }

  if (/[0-9]/.test(password)) {
    score += 10
  } else {
    feedback.push("Add numbers")
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 10
  } else {
    feedback.push("Add special characters (!@#$%)")
  }

  // Common words penalty
  const commonWords = ["password", "123456", "qwerty", "admin", "letmein"]
  if (commonWords.some((word) => password.toLowerCase().includes(word))) {
    score -= 20
    feedback.push("Avoid common words")
  }

  const strength = score >= 80 ? "STRONG" : score >= 60 ? "MEDIUM" : score >= 40 ? "WEAK" : "VERY WEAK"

  return { score: Math.max(0, Math.min(100, score)), strength, feedback }
}

export function analyzePasswordSecurity(
  password: string,
  accountType: string,
): {
  score: number
  strength: string
  crackTime: string
  crackTimeSeconds: number
  riskLevel: string
  hackerSuccessRate: number
  potentialLoss: number
  weaknessType: string
  hackMessage: string
  consequences: string[]
  improvementTip: string
} {
  let score = 0
  let crackTimeSeconds = 0
  let weaknessType = ""
  let hackMessage = ""

  // Length-based crack time calculation
  const length = password.length
  if (length < 8) {
    crackTimeSeconds = 0.001 // Instant
    weaknessType = "too_short"
    hackMessage = "Brute-force attack cracked password instantly"
  } else if (length < 10) {
    crackTimeSeconds = 60 // 1 minute
    weaknessType = "short"
    hackMessage = "Brute-force attack succeeded in under 1 minute"
  } else if (length < 12) {
    crackTimeSeconds = 3600 // 1 hour
    weaknessType = "moderate_length"
  } else if (length < 14) {
    crackTimeSeconds = 86400 * 30 // 30 days
  } else {
    crackTimeSeconds = 86400 * 365 * 100 // 100 years
  }

  // Check for common passwords
  const commonPasswords = [
    "password",
    "123456",
    "qwerty",
    "admin",
    "letmein",
    "welcome",
    "monkey",
    "dragon",
    "master",
    "sunshine",
    "princess",
    "football",
  ]
  if (commonPasswords.some((common) => password.toLowerCase().includes(common))) {
    crackTimeSeconds = 0.001
    weaknessType = "common_password"
    hackMessage = "Rainbow table attack successful - password found in common password database"
    score -= 30
  }

  // Check for personal information patterns
  const personalPatterns = /\b(19|20)\d{2}\b|birthday|name|birth/i
  if (personalPatterns.test(password)) {
    crackTimeSeconds = Math.min(crackTimeSeconds, 60)
    weaknessType = "personal_info"
    hackMessage = "Social engineering attack successful - password contains personal information"
    score -= 20
  }

  // Check for repeated patterns
  if (/(.)\1{2,}/.test(password) || /^(.+)\1+$/.test(password)) {
    crackTimeSeconds = Math.min(crackTimeSeconds, 300)
    weaknessType = "repeated_pattern"
    hackMessage = "Pattern recognition attack successful - password uses repeated characters"
    score -= 15
  }

  // Character variety scoring
  let charTypes = 0
  if (/[a-z]/.test(password)) {
    score += 15
    charTypes++
  }
  if (/[A-Z]/.test(password)) {
    score += 15
    charTypes++
  }
  if (/[0-9]/.test(password)) {
    score += 15
    charTypes++
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 15
    charTypes++
  }

  // Multiply crack time by character variety
  crackTimeSeconds *= Math.pow(10, charTypes)

  // Length bonus
  if (length >= 8) score += 15
  if (length >= 12) score += 15
  if (length >= 16) score += 10

  // Cap score
  score = Math.max(0, Math.min(100, score))

  // Format crack time
  const crackTime = formatCrackTime(crackTimeSeconds)

  // Determine risk level
  let riskLevel = "LOW"
  if (crackTimeSeconds < 60) riskLevel = "EXTREME"
  else if (crackTimeSeconds < 3600) riskLevel = "HIGH"
  else if (crackTimeSeconds < 86400) riskLevel = "MEDIUM"

  // Calculate hacker success rate
  const hackerSuccessRate = Math.max(5, Math.min(95, 100 - score))

  // Calculate potential financial loss based on account type
  const lossByType: Record<string, number> = {
    social: 500,
    banking: 50000,
    email: 5000,
    work: 100000,
  }
  const baseLoss = lossByType[accountType] || 1000
  const potentialLoss = Math.round(baseLoss * (hackerSuccessRate / 100))

  // Generate consequences based on account type
  const consequences = generateConsequences(accountType, weaknessType)

  // Generate improvement tip
  const improvementTip = generateImprovementTip(password, weaknessType)

  const strength = score >= 80 ? "STRONG" : score >= 60 ? "MEDIUM" : score >= 40 ? "WEAK" : "VERY WEAK"

  return {
    score,
    strength,
    crackTime,
    crackTimeSeconds,
    riskLevel,
    hackerSuccessRate,
    potentialLoss,
    weaknessType,
    hackMessage: hackMessage || "Dictionary attack in progress",
    consequences,
    improvementTip,
  }
}

function formatCrackTime(seconds: number): string {
  if (seconds < 1) return "Instant"
  if (seconds < 60) return `${Math.round(seconds)} seconds`
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
  if (seconds < 86400 * 30) return `${Math.round(seconds / 86400)} days`
  if (seconds < 86400 * 365) return `${Math.round(seconds / (86400 * 30))} months`
  return `${Math.round(seconds / (86400 * 365))} years`
}

function generateConsequences(accountType: string, weaknessType: string): string[] {
  const consequencesByType: Record<string, string[]> = {
    social: [
      "Fake posts sent to all friends asking for money",
      "Personal photos and messages leaked publicly",
      "Identity stolen for scam operations",
    ],
    banking: [
      "Unauthorized transfers draining your account",
      "Credit cards maxed out with fraudulent purchases",
      "Loans taken out in your name",
    ],
    email: [
      "Password reset emails intercepted for all accounts",
      "Confidential documents accessed and sold",
      "Email used to scam your contacts",
    ],
    work: [
      "Company data breach traced back to you",
      "Confidential client information stolen",
      "Termination and potential legal action",
    ],
  }

  return (
    consequencesByType[accountType] || ["Account compromised and data stolen", "Personal information sold on dark web"]
  )
}

function generateImprovementTip(password: string, weaknessType: string): string {
  const tips: Record<string, string> = {
    too_short: "Add at least 6 more characters for 1,000,000x better security",
    short: "Add 4 more characters to increase crack time from minutes to years",
    common_password: "Avoid dictionary words - use a random combination instead",
    personal_info: "Never use birth years, names, or personal info - try random words",
    repeated_pattern: "Avoid repeated characters - mix it up for better security",
    moderate_length: "Add special characters (!@#$%) to multiply security by 100x",
  }

  return tips[weaknessType] || "Use 14+ characters with uppercase, lowercase, numbers, and symbols"
}

export function calculateOverallScore(
  passwordScore: number,
  phishingScore: number,
  linkScore: number,
  networkScore: number,
): number {
  // Weighted average
  const weights = {
    password: 0.25,
    phishing: 0.3,
    link: 0.25,
    network: 0.2,
  }

  return Math.round(
    passwordScore * weights.password +
      phishingScore * weights.phishing +
      linkScore * weights.link +
      networkScore * weights.network,
  )
}

export function getRankFromScore(score: number): string {
  if (score >= 95) return "Security Guru"
  if (score >= 85) return "Security Champion"
  if (score >= 70) return "Security Pro"
  if (score >= 50) return "Security Apprentice"
  return "Digital Novice"
}

export function checkAchievementUnlock(
  achievementType: string,
  value: any,
): { unlocked: boolean; achievementId: number } {
  const achievements: Record<string, { id: number; check: (val: any) => boolean }> = {
    password_pro: {
      id: 1,
      check: (val) => val.length >= 14 && val.score >= 80,
    },
    phish_fighter: {
      id: 2,
      check: (val) => val.correctCount >= 3,
    },
    link_guardian: {
      id: 3,
      check: (val) => val.safeActions >= 5,
    },
    wifi_warrior: {
      id: 4,
      check: (val) => val.secureChoices === true,
    },
    mfa_master: {
      id: 5,
      check: (val) => val.mfaEnabled === true,
    },
    cyber_guardian: {
      id: 6,
      check: (val) => val.overallScore >= 85,
    },
  }

  const achievement = achievements[achievementType]
  if (achievement && achievement.check(value)) {
    return { unlocked: true, achievementId: achievement.id }
  }

  return { unlocked: false, achievementId: 0 }
}
