const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "API request failed")
  }

  return data
}

// User API
export async function createUser(userData: { username: string; email?: string; avatar_id: number }) {
  return apiCall("/users/create", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export async function getUser(userId: number) {
  return apiCall(`/users/${userId}`)
}

export async function updateUser(userId: number, updates: any) {
  return apiCall(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  })
}

// Game Session API
export async function startGameSession(userId: number) {
  return apiCall("/game/session/start", {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
  })
}

export async function getSession(sessionId: number) {
  return apiCall(`/game/session/${sessionId}`)
}

export async function updateChapterProgress(
  sessionId: number,
  chapterId: number,
  data: { status?: string; score?: number },
) {
  return apiCall(`/game/progress/${sessionId}/${chapterId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function recordDecision(decisionData: {
  session_id: number
  chapter_id: number
  decision_type: string
  decision_value: string
  is_correct: boolean
  points_earned: number
  feedback_shown: string
}) {
  return apiCall("/game/decision", {
    method: "POST",
    body: JSON.stringify(decisionData),
  })
}

export async function updateSessionScores(
  sessionId: number,
  scores: {
    overall_score?: number
    password_score?: number
    phishing_score?: number
    link_safety_score?: number
    network_score?: number
    rank_achieved?: string
  },
) {
  return apiCall(`/game/session/${sessionId}/scores`, {
    method: "PUT",
    body: JSON.stringify(scores),
  })
}

export async function completeSession(sessionId: number) {
  return apiCall(`/game/session/${sessionId}/complete`, {
    method: "PUT",
  })
}

// Achievements API
export async function getAllAchievements() {
  return apiCall("/achievements")
}

export async function getUserAchievements(sessionId: number) {
  return apiCall(`/achievements/session/${sessionId}`)
}

export async function unlockAchievement(sessionId: number, achievementId: number) {
  return apiCall("/achievements/unlock", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, achievement_id: achievementId }),
  })
}

// Leaderboard API
export async function getTopLeaderboard(limit = 10) {
  return apiCall(`/leaderboard/top/${limit}`)
}

export async function getUserRank(sessionId: number) {
  return apiCall(`/leaderboard/rank/${sessionId}`)
}

export async function getDailyLeaderboard() {
  return apiCall("/leaderboard/daily")
}
