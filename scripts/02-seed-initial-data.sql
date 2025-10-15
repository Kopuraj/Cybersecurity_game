-- Seed initial game data
-- Chapters and Achievements

-- Insert chapters
INSERT INTO chapters (chapter_number, chapter_name, chapter_description, unlock_requirement, max_score) VALUES
(0, 'Digital Identity', 'Create your digital identity and learn the basics', 0, 0),
(1, 'Campus Sign-Up', 'Create a secure account with strong password practices', 0, 100),
(2, 'Phishing Expedition', 'Identify and avoid phishing attempts in your inbox', 1, 100),
(3, 'Link Labyrinth', 'Analyze suspicious links and protect yourself from malicious URLs', 2, 100),
(4, 'Public WiFi Challenge', 'Navigate public networks safely and understand WiFi security', 3, 100);

-- Insert achievements/badges
INSERT INTO achievements (achievement_name, achievement_description, badge_icon, unlock_criteria, points_value) VALUES
('Password Pro', 'Created a strong password with 14+ characters and mixed types', 'lock', '{"type": "password_strength", "min_length": 14, "requires_mixed": true}', 20),
('Phish Fighter', 'Correctly identified 3+ phishing attempts', 'fish', '{"type": "phishing_detection", "min_correct": 3}', 25),
('Link Guardian', 'Safely handled 5+ suspicious links', 'link', '{"type": "link_safety", "min_safe_actions": 5}', 25),
('WiFi Warrior', 'Made secure decisions on public networks', 'wifi', '{"type": "network_security", "secure_choices": true}', 20),
('MFA Master', 'Enabled multi-factor authentication', 'shield', '{"type": "mfa_enabled", "value": true}', 15),
('Cyber Guardian', 'Achieved overall score of 85+', 'star', '{"type": "overall_score", "min_score": 85}', 30),
('Security Champion', 'Completed all chapters with 90+ scores', 'trophy', '{"type": "all_chapters", "min_score": 90}', 50),
('Secure Surfer', 'Completed the Public WiFi challenge perfectly', 'globe', '{"type": "chapter_perfect", "chapter_id": 4}', 20);
