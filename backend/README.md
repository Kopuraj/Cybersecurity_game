# CyberSafe Quest - Backend API

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Database
1. Create a MySQL database named `cybersafe_quest`
2. Copy `.env.example` to `.env` and update with your database credentials
3. Run the SQL scripts in order:
   \`\`\`bash
   mysql -u root -p cybersafe_quest < scripts/01-create-database-schema.sql
   mysql -u root -p cybersafe_quest < scripts/02-seed-initial-data.sql
   \`\`\`

### 3. Start the Server
\`\`\`bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
\`\`\`

The API will be available at `http://localhost:5000`

## API Endpoints

### Users
- `POST /api/users/create` - Create new user profile
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile

### Game
- `POST /api/game/session/start` - Start new game session
- `GET /api/game/session/:sessionId` - Get session progress
- `PUT /api/game/progress/:sessionId/:chapterId` - Update chapter progress
- `POST /api/game/decision` - Record player decision
- `PUT /api/game/session/:sessionId/scores` - Update session scores
- `PUT /api/game/session/:sessionId/complete` - Complete game session

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/session/:sessionId` - Get user achievements
- `POST /api/achievements/unlock` - Unlock achievement

### Leaderboard
- `GET /api/leaderboard/top/:limit` - Get top players
- `GET /api/leaderboard/rank/:sessionId` - Get user rank
- `GET /api/leaderboard/daily` - Get daily leaderboard

## Database Schema

See `scripts/01-create-database-schema.sql` for complete schema definition.

Key tables:
- `users` - Player profiles
- `game_sessions` - Individual game playthroughs
- `chapters` - Game chapters/scenarios
- `user_progress` - Chapter completion tracking
- `achievements` - Available badges
- `user_achievements` - Earned badges
- `leaderboard` - Top scores
- `decisions` - Player choices tracking
