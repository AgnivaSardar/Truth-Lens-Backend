# Misinformation Simulator API Documentation

## 🎮 Overview

The Misinformation Simulator is a game-based learning platform that teaches users how misinformation is created and spread. Users play as misinformation creators to understand psychological manipulation tactics, then practice detecting these tactics in real-world examples.

## 🎯 Game Flow

### Creation Mode
1. **Choose Scenario** - Select a misinformation scenario
2. **Select Role** - Pick your role (Fake News Creator, Spin Doctor, Bot Manager, or Sensational Journalist)
3. **Craft Message** - Make choices about emotional wording, images, hashtags, and target audience
4. **Run Simulation** - See how your misinformation spreads
5. **Learn Impact** - Understand psychological triggers used and real-world consequences

### Detection Mode
1. **Get Challenge** - Receive a piece of potential misinformation
2. **Identify Tactics** - Select manipulation tactics you recognize
3. **Submit Answer** - Get scored on accuracy
4. **Learn** - See correct answers with detailed explanations

---

## 📋 API Endpoints

### Base URL
```
http://localhost:3000/api/simulator
```

---

## 🎲 Scenario Endpoints

### Get All Scenarios
```http
GET /api/simulator/scenarios
```

**Query Parameters:**
- `difficulty` (optional): Filter by difficulty (`easy`, `medium`, `hard`)
- `limit` (optional): Number of results (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Fuel Price Crisis",
      "description": "Create a viral narrative about fuel price hike",
      "context": "Fuel prices have increased by 5%...",
      "targetTopic": "fuel_prices",
      "difficulty": "easy",
      "isActive": true,
      "createdAt": "2024-03-02T...",
      "updatedAt": "2024-03-02T..."
    }
  ],
  "count": 8
}
```

---

### Get Specific Scenario
```http
GET /api/simulator/scenarios/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Fuel Price Crisis",
    "description": "Create a viral narrative about fuel price hike",
    "context": "Fuel prices have increased by 5%...",
    "targetTopic": "fuel_prices",
    "difficulty": "easy",
    "isActive": true,
    "createdAt": "2024-03-02T...",
    "updatedAt": "2024-03-02T..."
  }
}
```

---

### Create Scenario (Admin)
```http
POST /api/simulator/scenarios
```

**Request Body:**
```json
{
  "title": "New Crisis Scenario",
  "description": "Description of the scenario",
  "context": "Detailed background information...",
  "targetTopic": "technology",
  "difficulty": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* created scenario */ },
  "message": "Scenario created successfully"
}
```

---

## 🎮 Game Endpoints

### Start New Game
```http
POST /api/simulator/games/start
```

**Request Body:**
```json
{
  "scenarioId": "uuid",
  "role": "fake_news_creator",
  "userId": "user123" // optional
}
```

**Valid Roles:**
- `fake_news_creator`
- `spin_doctor`
- `bot_manager`
- `sensational_journalist`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "game-uuid",
    "scenarioId": "uuid",
    "scenario": { /* scenario details */ },
    "userId": "user123",
    "role": "fake_news_creator",
    "phase": "creation",
    "engagementScore": 0,
    "viralityScore": 0,
    "outrageScore": 0,
    "credibilityScore": 50,
    "score": 0,
    "createdAt": "2024-03-02T..."
  },
  "message": "Game started successfully. Make your choices to create misinformation."
}
```

---

### Submit Choices and Run Simulation
```http
POST /api/simulator/games/:id/submit
```

**Request Body:**
```json
{
  "emotionalWording": "SHOCKING: Prices EXPLODE overnight! They don't want you to know the TRUTH!",
  "selectedEmotion": "fear",
  "imageManipulation": "dramatic_filter",
  "hashtags": ["#FuelCrisis", "#WakeUp", "#Truth"],
  "targetAudience": "general"
}
```

**Valid Emotions:**
- `fear`, `anger`, `outrage`, `hope`, `pride`, `shock`, `urgency`

**Valid Image Manipulations:**
- `no_manipulation`, `dramatic_filter`, `misleading_crop`, `fake_caption`, `deepfake`

**Valid Target Audiences:**
- `youth`, `elderly`, `political_left`, `political_right`, `conspiracy_theorists`, `general`

**Response:**
```json
{
  "success": true,
  "data": {
    "game": {
      "id": "game-uuid",
      "phase": "simulation",
      "engagementScore": 75,
      "viralityScore": 82,
      "outrageScore": 68,
      "credibilityScore": 25,
      "score": 78,
      "emotionalWording": "...",
      "selectedEmotion": "fear",
      "imageManipulation": "dramatic_filter",
      "hashtags": ["#FuelCrisis", "#WakeUp", "#Truth"],
      "targetAudience": "general",
      "triggersUsed": [
        {
          "type": "emotional_manipulation",
          "trigger": "fear",
          "description": "Exploits fear response to bypass rational thinking",
          "severity": "medium"
        }
      ],
      "realWorldExample": "Similar to pandemic-related misinformation...",
      "consequences": "Rapid spread across social media platforms..."
    },
    "metrics": {
      "engagementScore": 75,
      "viralityScore": 82,
      "outrageScore": 68,
      "credibilityScore": 25
    },
    "triggersUsed": [ /* array of triggers */ ],
    "consequences": "Rapid spread across social media platforms...",
    "realWorldExample": "Similar to pandemic-related misinformation..."
  },
  "message": "Simulation complete! See how your misinformation spreads."
}
```

---

### Complete Game
```http
POST /api/simulator/games/:id/complete
```

**Response:**
```json
{
  "success": true,
  "data": { /* completed game details */ },
  "message": "Game completed! You now understand how misinformation spreads."
}
```

---

### Get Game Details
```http
GET /api/simulator/games/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "game-uuid",
    "scenario": { /* scenario details */ },
    "choices": [ /* array of choices made */ ],
    /* all game fields */
  }
}
```

---

### Get User's Game History
```http
GET /api/simulator/games/user/:userId
```

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "game-uuid",
      "role": "fake_news_creator",
      "score": 78,
      "phase": "completed",
      "completedAt": "2024-03-02T...",
      "scenario": {
        "title": "Fuel Price Crisis",
        "difficulty": "easy"
      }
    }
  ],
  "count": 5
}
```

---

### Get Leaderboard
```http
GET /api/simulator/leaderboard
```

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "game-uuid",
      "userId": "user123",
      "role": "spin_doctor",
      "score": 95,
      "viralityScore": 88,
      "engagementScore": 92,
      "completedAt": "2024-03-02T...",
      "scenario": {
        "title": "Healthcare Reform Controversy",
        "difficulty": "hard"
      }
    }
  ],
  "count": 10
}
```

---

## 🔍 Detection Mode Endpoints

### Get Detection Challenges
```http
GET /api/simulator/detection/challenges
```

**Query Parameters:**
- `difficulty` (optional): Filter by difficulty
- `category` (optional): Filter by category (`political`, `health`, `climate`, `social`)
- `limit` (optional): Number of results (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "challenge-uuid",
      "title": "Fuel Price Panic Post",
      "difficulty": "easy",
      "category": "political",
      "realExample": true,
      "createdAt": "2024-03-02T..."
    }
  ],
  "count": 6
}
```

---

### Get Specific Detection Challenge
```http
GET /api/simulator/detection/challenges/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "challenge-uuid",
    "title": "Fuel Price Panic Post",
    "content": "🚨 BREAKING: Fuel prices to TRIPLE by next month!...",
    "imageUrl": null,
    "difficulty": "easy",
    "category": "political",
    "realExample": true
    // Note: correctTactics and explanation not included until after submission
  }
}
```

---

### Submit Detection Attempt
```http
POST /api/simulator/detection/submit
```

**Request Body:**
```json
{
  "challengeId": "challenge-uuid",
  "identifiedTactics": [
    "fear",
    "urgency",
    "conspiracy_framing",
    "exaggeration"
  ],
  "userId": "user123", // optional
  "timeSpent": 45 // seconds, optional
}
```

**Common Tactics:**
- `fear`, `anger`, `outrage`, `urgency`
- `conspiracy_framing`, `us_vs_them`, `false_urgency`
- `exaggeration`, `misleading_evidence`, `false_authority`
- `cherry_picking`, `misleading_crop`, `fake_caption`

**Response:**
```json
{
  "success": true,
  "data": {
    "attempt": {
      "id": "attempt-uuid",
      "challengeId": "challenge-uuid",
      "userId": "user123",
      "identifiedTactics": ["fear", "urgency", "conspiracy_framing", "exaggeration"],
      "correctCount": 4,
      "totalTactics": 5,
      "accuracy": 80,
      "timeSpent": 45,
      "score": 85,
      "completed": true
    },
    "correctTactics": [
      "fear",
      "urgency",
      "conspiracy_framing",
      "exaggeration",
      "false_urgency"
    ],
    "missed": ["false_urgency"],
    "falsePositives": [],
    "explanation": "This post uses fear-mongering (TRIPLE prices), false urgency...",
    "userScore": 85,
    "accuracy": 80
  },
  "message": "You scored 85/100! Accuracy: 80.0%"
}
```

---

### Create Detection Challenge (Admin)
```http
POST /api/simulator/detection/challenges
```

**Request Body:**
```json
{
  "title": "New Challenge",
  "content": "Suspicious content to analyze...",
  "imageUrl": "https://example.com/image.jpg", // optional
  "correctTactics": ["fear", "exaggeration"],
  "difficulty": "medium",
  "explanation": "Detailed explanation of tactics...",
  "realExample": true,
  "category": "health"
}
```

---

### Get User's Detection History
```http
GET /api/simulator/detection/history/:userId
```

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "attempt-uuid",
      "score": 85,
      "accuracy": 80,
      "timeSpent": 45,
      "completed": true,
      "createdAt": "2024-03-02T...",
      "challenge": {
        "title": "Fuel Price Panic Post",
        "difficulty": "easy",
        "category": "political"
      }
    }
  ],
  "count": 3
}
```

---

## 📊 Statistics Endpoints

### Get User Statistics
```http
GET /api/simulator/stats/:userId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "gamesPlayed": 15,
    "avgGameScore": 72.5,
    "highestGameScore": 95,
    "detectionsAttempted": 24,
    "avgDetectionScore": 78.3,
    "avgDetectionAccuracy": 82.5
  }
}
```

---

## 🎯 Scoring System

### Game Score (0-100)
Calculated based on:
- **Virality & Engagement** (40%): How effectively content spreads
- **Psychological Triggers** (30%): Number and effectiveness of manipulation tactics
- **Manipulation Balance** (30%): High engagement + low credibility = effective misinformation
- **Difficulty Multiplier**: Easy (0.8x), Medium (1.0x), Hard (1.3x)

### Detection Score (0-100)
Calculated based on:
- **Accuracy**: Percentage of correct tactics identified
- **Speed Bonus**: Faster completion (under 60s) gives bonus points
- **False Positive Penalty**: -5 points per incorrect tactic identified

---

## 🧠 Psychological Triggers

### Emotional Manipulation
- **Fear**: Exploits fear response to bypass rational thinking
- **Anger**: Triggers anger to promote sharing without fact-checking
- **Outrage**: Induces moral outrage for emotional responses
- **Urgency**: Creates false urgency to prevent critical evaluation

### Visual Deception
- **Dramatic Filter**: Visual filters to exaggerate emotional impact
- **Misleading Crop**: Selective cropping to remove context
- **Fake Caption**: False captions misrepresenting image content
- **Deepfake**: AI-generated imagery to fabricate events

### Cognitive Manipulation
- **Conspiracy Framing**: Creates distrust in authorities
- **Us vs Them**: Artificial divisions to polarize audience
- **False Authority**: Misuses expert credentials or fake experts
- **Cherry Picking**: Selective use of data to support narrative

---

## 💡 Educational Impact

### What Users Learn
1. **How Misinformation Works**: Understand psychological triggers and manipulation tactics
2. **Critical Thinking**: Develop ability to spot manipulation in real content
3. **Media Literacy**: Recognize patterns of misleading information
4. **Cognitive Immunity**: Build mental defenses against manipulation

### Real-World Applications
- Identify misinformation on social media
- Understand propaganda techniques
- Make informed decisions about shared content
- Teach others about manipulation tactics

---

## 🚀 Quick Start Example

```javascript
// 1. Get available scenarios
const scenarios = await fetch('/api/simulator/scenarios?difficulty=easy');

// 2. Start a game
const game = await fetch('/api/simulator/games/start', {
  method: 'POST',
  body: JSON.stringify({
    scenarioId: scenarios.data[0].id,
    role: 'fake_news_creator',
    userId: 'user123'
  })
});

// 3. Submit choices
const result = await fetch(`/api/simulator/games/${game.data.id}/submit`, {
  method: 'POST',
  body: JSON.stringify({
    emotionalWording: "BREAKING: Crisis EXPLODES!",
    selectedEmotion: "fear",
    imageManipulation: "dramatic_filter",
    hashtags: ["#Breaking", "#Crisis"],
    targetAudience: "general"
  })
});

// 4. View results - metrics, triggers, consequences

// 5. Complete the game
await fetch(`/api/simulator/games/${game.data.id}/complete`, {
  method: 'POST'
});

// 6. Try detection mode
const challenges = await fetch('/api/simulator/detection/challenges');

const detection = await fetch('/api/simulator/detection/submit', {
  method: 'POST',
  body: JSON.stringify({
    challengeId: challenges.data[0].id,
    identifiedTactics: ['fear', 'urgency', 'exaggeration'],
    userId: 'user123',
    timeSpent: 45
  })
});

// View score and learn from mistakes
```

---

## 🎨 Demo Features

### Visual Dashboard Elements
- **Virality Meter**: Real-time visualization of spread
- **Engagement Graph**: Shows interaction over time
- **Outrage Indicator**: Measures emotional impact
- **Credibility Score**: Shows trustworthiness perception
- **Trigger Breakdown**: Visual display of manipulation tactics used
- **Consequence Map**: Shows potential real-world impact

### Gamification Elements
- **Leaderboard**: Top scores across all players
- **Achievements**: Unlock badges for different tactics
- **Progress Tracking**: Personal improvement over time
- **Challenge Streaks**: Consecutive correct detections
- **Role Mastery**: Expert status in each role

---

## 📝 Database Schema Reference

See [schema.prisma](../prisma/schema.prisma) for complete database structure:
- **Scenario**: Available game scenarios
- **SimulationGame**: Individual game sessions
- **SimulationChoice**: Choices made during games
- **DetectionChallenge**: Detection mode challenges
- **DetectionAttempt**: User attempts at detection

---

## 🔧 Setup & Seed Data

### Run Migrations
```bash
npx prisma db push
```

### Seed Initial Data
```bash
node src/seeds/simulatorSeed.js
```

This creates:
- 8 diverse scenarios (easy, medium, hard)
- 6 detection challenges with explanations
- Ready-to-play content for testing

---

## 🎓 Educational Use Cases

### For Students
- Learn media literacy in engaging way
- Understand psychology of persuasion
- Practice critical thinking skills

### For Educators
- Use as teaching tool for misinformation education
- Track student progress and understanding
- Demonstrate real-world manipulation tactics

### For Researchers
- Study how people create and detect misinformation
- Analyze patterns in manipulation choices
- Test effectiveness of educational interventions

### For Judges/Competitions
- **Social Impact**: Builds cognitive immunity in population
- **Innovation**: Unique reverse-learning approach
- **Engagement**: Game mechanics make learning fun
- **Measurable Outcomes**: Track user improvement over time
- **Real-World Application**: Direct transfer to social media use

---

## 🏆 Why This Wins

1. **Novel Approach**: Teaching by doing (as attacker) is more effective than passive learning
2. **Psychological Depth**: Real cognitive science behind manipulation tactics
3. **Visual Impact**: Dashboard and metrics make great demo
4. **Scalability**: Rule-based simulation (no heavy ML required)
5. **Social Good**: Addresses critical problem of misinformation spread
6. **Engaging**: Game mechanics keep users coming back
7. **Measurable**: Clear metrics for learning outcomes
8. **Practical**: Immediately applicable to daily social media use

---

**Built with ❤️ for Truth Lens - Fighting Misinformation Through Education**
