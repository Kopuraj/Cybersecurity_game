# CyberSafe Quest

An interactive web-based cybersecurity education game that transforms security awareness training into an engaging digital adventure.

## Overview

CyberSafe Quest is a gamified learning platform where players progress through realistic cybersecurity scenarios, earning badges and building their security score. The game covers essential topics including password security, phishing detection, link safety, and public WiFi security.

## Features

- **Interactive Scenarios**: 4 hands-on chapters covering key cybersecurity concepts
- **Real-time Feedback**: Immediate educational explanations for every decision
- **Achievement System**: Unlock 8+ badges as you master security skills
- **Global Leaderboard**: Compete with other players worldwide
- **Personalized Certificates**: Download shareable completion certificates
- **Progress Tracking**: Visual journey map showing your advancement
- **Security Scorecard**: Detailed breakdown of your performance

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling with custom cybersecurity theme
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MySQL** - Database
- **JWT** - Authentication

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MySQL 8+ installed and running
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd cybersafe-quest
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   \`\`\`env
   # Backend API
   PORT=3001
   CORS_ORIGIN=http://localhost:3000
   
   # Database
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=cybersafe_quest
   DB_PORT=3306
   
   # Frontend
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   \`\`\`

4. **Setup the database**
   
   Run the SQL scripts to create tables and seed initial data:
   \`\`\`bash
   mysql -u your_mysql_user -p cybersafe_quest < scripts/01-create-database-schema.sql
   mysql -u your_mysql_user -p cybersafe_quest < scripts/02-seed-initial-data.sql
   \`\`\`

5. **Start the backend server**
   \`\`\`bash
   npm run server:dev
   \`\`\`

6. **Start the frontend development server**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Open your browser**
   
   Navigate to `http://localhost:3000`

## Project Structure

\`\`\`
cybersafe-quest/
├── app/                          # Next.js app directory
│   ├── character-creation/       # Character setup page
│   ├── game/                     # Game pages
│   │   ├── tutorial/            # Tutorial page
│   │   ├── journey/             # Journey map
│   │   ├── chapter-1/           # Password security
│   │   ├── chapter-2/           # Phishing detection
│   │   ├── chapter-3/           # Link safety
│   │   ├── chapter-4/           # WiFi security
│   │   ├── scorecard/           # Score dashboard
│   │   ├── achievements/        # Badges page
│   │   └── complete/            # Completion page
│   ├── leaderboard/             # Global rankings
│   ├── security-tips/           # Educational resources
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── terminal-header.tsx      # Header component
│   ├── security-status.tsx      # Status display
│   ├── feedback-modal.tsx       # Feedback dialogs
│   ├── certificate-generator.tsx # Certificate creation
│   └── share-score.tsx          # Social sharing
├── lib/                         # Utilities
│   ├── api.ts                   # API client
│   ├── game-context.tsx         # Game state management
│   └── scoring.ts               # Scoring logic
├── routes/                      # Backend API routes
│   ├── userRoutes.js           # User endpoints
│   ├── gameRoutes.js           # Game endpoints
│   ├── achievementRoutes.js    # Achievement endpoints
│   └── leaderboardRoutes.js    # Leaderboard endpoints
├── scripts/                     # Database scripts
│   ├── 01-create-database-schema.sql
│   └── 02-seed-initial-data.sql
├── config/                      # Configuration
│   └── database.js             # Database connection
└── server.js                    # Express server

\`\`\`

## Game Flow

1. **Character Creation**: Players create their digital identity
2. **Tutorial**: Learn the game mechanics and interface
3. **Chapter 1 - Password Security**: Create strong passwords with real-time feedback
4. **Chapter 2 - Phishing Detection**: Identify suspicious emails
5. **Chapter 3 - Link Safety**: Analyze URLs for threats
6. **Chapter 4 - WiFi Security**: Choose secure networks
7. **Scorecard**: Review performance across all categories
8. **Achievements**: View unlocked badges
9. **Completion**: Download certificate and share results

## API Endpoints

### User Management
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user details

### Game Sessions
- `POST /api/game/start` - Start new game session
- `GET /api/game/session/:sessionId` - Get session details
- `PUT /api/game/session/:sessionId/complete` - Complete session
- `POST /api/game/decision` - Record player decision

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/user/:sessionId` - Get user achievements
- `POST /api/achievements/unlock` - Unlock achievement

### Leaderboard
- `GET /api/leaderboard` - Get global rankings
- `GET /api/leaderboard/daily` - Get daily rankings
- `GET /api/leaderboard/rank/:sessionId` - Get user rank

## Scoring System

- **Overall Score**: 0-100 scale
- **Category Breakdown**:
  - Password Security (25%)
  - Phishing Awareness (25%)
  - Link Safety (25%)
  - Network Security (25%)

## Achievements

Players can unlock 8+ badges:
- Password Pro
- Phishing Detector
- Link Guardian
- Secure Surfer
- MFA Master
- Data Guardian
- Patch Pioneer
- Social Smartie
- Cyber Guardian (Master Badge)

## Development

### Running in Development Mode

\`\`\`bash
# Frontend
npm run dev

# Backend
npm run server:dev
\`\`\`

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on the GitHub repository.

---

**CyberSafe Quest** - Making cybersecurity education engaging and accessible.
