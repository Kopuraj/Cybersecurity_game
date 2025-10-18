# CyberSafe Quest - Navigation Flow Guide

## Complete User Journey

### 1. Landing Page
**Route:** `/`
**Purpose:** Welcome screen with game overview
**Actions:**
- Click "START YOUR DIGITAL JOURNEY" → Goes to User Selection
- Click "LEADERBOARD" → View global rankings
- Click "SECURITY TIPS" → View cybersecurity tips

---

### 2. User Selection Page
**Route:** `/user-selection`
**Purpose:** Choose between new game or continuing existing game
**Options:**
- **NEW GAME:** Clears localStorage and creates new player account
  - Clears: `cybersafe_user`, `cybersafe_session`, `cybersafe_state`
  - Navigates to: Character Creation
- **CONTINUE GAME:** Resume existing player session
  - Shows existing username
  - Navigates to: Game Tutorial (skips character creation)

---

### 3. Character Creation Page
**Route:** `/character-creation`
**Purpose:** Create new player account
**Steps:**
1. Enter Username (2-20 characters)
2. Enter Email (optional)
3. Select Avatar (Guardian, Sentinel, Defender, Keeper)
4. Click "BEGIN QUEST"

**Backend Actions:**
- Creates new user in database
- Checks for duplicate usernames
- Creates new game session
- Stores user and session in localStorage

**Navigates to:** Game Tutorial

---

### 4. Game Tutorial Page
**Route:** `/game/tutorial`
**Purpose:** Learn how the game works
**Features:**
- 3-step tutorial with progress dots
- Chapter preview showing all 4 challenges
- "BEGIN QUEST" button to start

**Navigates to:** Journey/Game Panel

---

### 5. Journey/Game Panel Page
**Route:** `/game/journey`
**Purpose:** Main game hub - see all chapters and select which to play
**Features:**
- Shows player username and progress percentage
- Displays all 4 chapters with status:
  - ✓ COMPLETED (green)
  - ● IN PROGRESS (yellow)
  - 🔒 LOCKED (gray)
- Click chapter to play (if not locked)
- View Scorecard button
- View Achievements button

**Chapters:**
1. **C1: Campus Sign-Up** - Password Security Challenge
2. **C2: Phishing Expedition** - Phishing Detection Challenge
3. **C3: Link Labyrinth** - Link Analysis Challenge
4. **C4: Public WiFi Challenge** - WiFi Security Challenge

---

### 6. Chapter Pages
**Routes:** 
- `/game/chapter-1` - Password Security
- `/game/chapter-2` - Phishing Detection
- `/game/chapter-3` - Link Analysis
- `/game/chapter-4` - WiFi Security

**Purpose:** Play individual challenges
**Features:**
- Clean challenge interface (NO hints during gameplay)
- Submit answer
- Navigate to results page

---

### 7. Chapter Results Pages
**Routes:**
- `/game/chapter-1/results` - Password Security Results
- `/game/chapter-2/results` - Phishing Detection Results
- `/game/chapter-3/results` - Link Analysis Results
- `/game/chapter-4/results` - WiFi Security Results

**Purpose:** Show detailed feedback and analysis
**Features:**
- Security analysis and explanations
- Score breakdown
- Achievements unlocked
- Educational content
- "NEXT CHAPTER" or "BACK TO JOURNEY" button

---

### 8. Scorecard Page
**Route:** `/game/scorecard`
**Purpose:** View overall security score and metrics
**Shows:**
- Overall Protection Level
- Global Rank
- Category Scores:
  - Password Security
  - Phishing Awareness
  - Network Safety
- View Badges button

---

### 9. Achievements Page
**Route:** `/game/achievements`
**Purpose:** View all badges and achievements
**Features:**
- Locked badges (grayed out)
- Unlocked badges (highlighted)
- Achievement descriptions
- View Leaderboard button

---

### 10. Game Complete Page
**Route:** `/game/complete`
**Purpose:** Final summary after all chapters
**Features:**
- Final security score
- Certificate download
- Share score on social media
- View Leaderboard button

---

### 11. Leaderboard Page
**Route:** `/leaderboard`
**Purpose:** View global player rankings
**Features:**
- Top 10 players by score
- Player username and score
- Global rank
- Accessible from multiple pages

---

### 12. Security Tips Page
**Route:** `/security-tips`
**Purpose:** Educational cybersecurity tips
**Features:**
- General security advice
- Best practices
- Reference material

---

## Data Flow

### User Creation
\`\`\`
Character Creation Form
    ↓
API: POST /api/users/create
    ↓
Database: Insert into users table
    ↓
Return: user_id, username, avatar_id
    ↓
localStorage: Save user data
\`\`\`

### Game Session
\`\`\`
Character Creation
    ↓
API: POST /api/game/session/start
    ↓
Database: Create game_session
    ↓
Return: session_id
    ↓
localStorage: Save session_id
\`\`\`

### Chapter Progress
\`\`\`
Submit Chapter Answer
    ↓
API: POST /api/game/decision
    ↓
Database: Record user_decision
    ↓
Calculate Score
    ↓
Update user_progress
    ↓
Check Achievements
    ↓
Return: Results with feedback
\`\`\`

---

## Key Features

### Each Player Gets:
- ✓ Unique username (no duplicates)
- ✓ Separate game session
- ✓ Individual progress tracking
- ✓ Personal score and ranking
- ✓ Achievement tracking
- ✓ Leaderboard position

### Challenge Mode:
- ✓ NO hints during gameplay
- ✓ Clean interface while playing
- ✓ Full feedback AFTER submission
- ✓ Educational content on results page
- ✓ Real-world scenario simulations

### Competitive Features:
- ✓ Global leaderboard
- ✓ Score comparison
- ✓ Achievement badges
- ✓ Certificate generation
- ✓ Social sharing

---

## Quick Navigation Reference

| Page | Route | From | To |
|------|-------|------|-----|
| Home | `/` | - | User Selection |
| User Selection | `/user-selection` | Home | Character Creation or Tutorial |
| Character Creation | `/character-creation` | User Selection | Tutorial |
| Tutorial | `/game/tutorial` | Character Creation or Continue | Journey |
| Journey | `/game/journey` | Tutorial | Chapter or Scorecard/Achievements |
| Chapter 1-4 | `/game/chapter-1` to `/game/chapter-4` | Journey | Results |
| Results | `/game/chapter-1/results` | Chapter | Journey or Next Chapter |
| Scorecard | `/game/scorecard` | Journey | Achievements |
| Achievements | `/game/achievements` | Scorecard or Journey | Leaderboard |
| Complete | `/game/complete` | Last Chapter Results | Leaderboard |
| Leaderboard | `/leaderboard` | Home or Achievements | Home |
| Security Tips | `/security-tips` | Home | Home |

---

## Testing the Flow

### Test New Player:
1. Open `http://localhost:3000`
2. Click "START YOUR DIGITAL JOURNEY"
3. Click "NEW GAME"
4. Enter username (e.g., "Player1")
5. Select avatar
6. Click "BEGIN QUEST"
7. Complete tutorial
8. Select Chapter 1
9. Complete challenge
10. View results
11. Check leaderboard

### Test Returning Player:
1. Open `http://localhost:3000`
2. Click "START YOUR DIGITAL JOURNEY"
3. Click "CONTINUE GAME"
4. Should show existing username
5. Resume from where you left off

---

## Troubleshooting

### Issue: Can't create new game
**Solution:** Click "NEW GAME" button - it clears localStorage

### Issue: Username already exists
**Solution:** Use a different username or click "NEW GAME" to start fresh

### Issue: Chapters are locked
**Solution:** Complete previous chapters in order

### Issue: Progress not saving
**Solution:** Check browser localStorage is enabled

---
