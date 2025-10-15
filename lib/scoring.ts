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
