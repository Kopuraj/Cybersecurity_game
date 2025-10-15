-- CyberSafe Quest Database Schema
-- MySQL Database Setup Script

-- Users table - stores player profiles
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100),
    avatar_id INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
);

-- Game sessions table - tracks individual game playthroughs
CREATE TABLE IF NOT EXISTS game_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    overall_score INT DEFAULT 0,
    password_score INT DEFAULT 0,
    phishing_score INT DEFAULT 0,
    link_safety_score INT DEFAULT 0,
    network_score INT DEFAULT 0,
    rank_achieved VARCHAR(50),
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_session (user_id, started_at)
);

-- Chapters table - defines game chapters/scenarios
CREATE TABLE IF NOT EXISTS chapters (
    chapter_id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_number INT NOT NULL UNIQUE,
    chapter_name VARCHAR(100) NOT NULL,
    chapter_description TEXT,
    unlock_requirement INT DEFAULT 0,
    max_score INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table - tracks chapter completion
CREATE TABLE IF NOT EXISTS user_progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    chapter_id INT NOT NULL,
    status ENUM('locked', 'in_progress', 'completed') DEFAULT 'locked',
    score INT DEFAULT 0,
    attempts INT DEFAULT 0,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES chapters(chapter_id) ON DELETE CASCADE,
    UNIQUE KEY unique_session_chapter (session_id, chapter_id),
    INDEX idx_session_progress (session_id)
);

-- Achievements/Badges table - defines available badges
CREATE TABLE IF NOT EXISTS achievements (
    achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    achievement_name VARCHAR(100) NOT NULL UNIQUE,
    achievement_description TEXT,
    badge_icon VARCHAR(50),
    unlock_criteria JSON,
    points_value INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User achievements table - tracks earned badges
CREATE TABLE IF NOT EXISTS user_achievements (
    user_achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id) ON DELETE CASCADE,
    UNIQUE KEY unique_session_achievement (session_id, achievement_id),
    INDEX idx_session_achievements (session_id)
);

-- Leaderboard table - stores top scores
CREATE TABLE IF NOT EXISTS leaderboard (
    leaderboard_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    overall_score INT NOT NULL,
    rank_achieved VARCHAR(50),
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_score_ranking (overall_score DESC, completed_at ASC)
);

-- Decisions table - tracks player choices in scenarios
CREATE TABLE IF NOT EXISTS decisions (
    decision_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    chapter_id INT NOT NULL,
    decision_type VARCHAR(50),
    decision_value TEXT,
    is_correct BOOLEAN,
    points_earned INT DEFAULT 0,
    feedback_shown TEXT,
    decided_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES chapters(chapter_id) ON DELETE CASCADE,
    INDEX idx_session_decisions (session_id, chapter_id)
);
