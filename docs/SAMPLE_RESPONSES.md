# Sample API Responses for Misinformation Simulator

## Example 1: Complete Game Flow

### 1. Get Scenarios

**Request:**
```http
GET /api/simulator/scenarios?difficulty=easy
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Fuel Price Crisis",
      "description": "Create a viral narrative about fuel price hike",
      "context": "Fuel prices have increased by 5% this week. Your goal is to create misinformation that exaggerates this situation and spreads panic.",
      "targetTopic": "fuel_prices",
      "difficulty": "easy",
      "isActive": true,
      "createdAt": "2024-03-02T10:00:00.000Z",
      "updatedAt": "2024-03-02T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 2. Start Game

**Request:**
```http
POST /api/simulator/games/start
Content-Type: application/json

{
  "scenarioId": "550e8400-e29b-41d4-a716-446655440000",
  "role": "fake_news_creator",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "scenarioId": "550e8400-e29b-41d4-a716-446655440000",
    "scenario": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Fuel Price Crisis",
      "description": "Create a viral narrative about fuel price hike",
      "context": "Fuel prices have increased by 5% this week...",
      "targetTopic": "fuel_prices",
      "difficulty": "easy",
      "isActive": true
    },
    "userId": "user123",
    "role": "fake_news_creator",
    "phase": "creation",
    "engagementScore": 0,
    "viralityScore": 0,
    "outrageScore": 0,
    "credibilityScore": 50,
    "score": 0,
    "createdAt": "2024-03-02T10:05:00.000Z",
    "updatedAt": "2024-03-02T10:05:00.000Z"
  },
  "message": "Game started successfully. Make your choices to create misinformation."
}
```

---

### 3. Submit Choices and Run Simulation

**Request:**
```http
POST /api/simulator/games/660e8400-e29b-41d4-a716-446655440001/submit
Content-Type: application/json

{
  "emotionalWording": "🚨 BREAKING: Fuel prices to TRIPLE by next month! Government hiding the TRUTH from you! They don't want you to know about the SECRET oil shortage. Share before they DELETE this!",
  "selectedEmotion": "fear",
  "imageManipulation": "dramatic_filter",
  "hashtags": ["#FuelCrisis", "#WakeUp", "#Truth", "#Breaking"],
  "targetAudience": "general"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "game": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "scenarioId": "550e8400-e29b-41d4-a716-446655440000",
      "scenario": {
        "title": "Fuel Price Crisis",
        "difficulty": "easy"
      },
      "userId": "user123",
      "role": "fake_news_creator",
      "emotionalWording": "🚨 BREAKING: Fuel prices to TRIPLE by next month!...",
      "selectedEmotion": "fear",
      "imageManipulation": "dramatic_filter",
      "hashtags": ["#FuelCrisis", "#WakeUp", "#Truth", "#Breaking"],
      "targetAudience": "general",
      "engagementScore": 78,
      "viralityScore": 85,
      "outrageScore": 72,
      "credibilityScore": 22,
      "score": 82,
      "phase": "simulation",
      "triggersUsed": [
        {
          "type": "emotional_manipulation",
          "trigger": "fear",
          "description": "Exploits fear response to bypass rational thinking",
          "severity": "medium"
        },
        {
          "type": "visual_deception",
          "trigger": "dramatic_filter",
          "description": "Visual filters to exaggerate emotional impact",
          "severity": "medium"
        },
        {
          "type": "conspiracy_framing",
          "trigger": "conspiracy_language",
          "description": "Uses conspiracy framing to create distrust in authorities",
          "severity": "high"
        },
        {
          "type": "urgency_manipulation",
          "trigger": "false_urgency",
          "description": "Creates artificial urgency to prevent critical thinking",
          "severity": "medium"
        }
      ],
      "realWorldExample": "Similar to pandemic-related misinformation that caused panic buying and vaccine hesitancy.",
      "consequences": "Rapid spread across social media platforms reaching millions. Erosion of trust in legitimate information sources. Long-term damage to public discourse and democratic processes.",
      "completedAt": null,
      "createdAt": "2024-03-02T10:05:00.000Z",
      "updatedAt": "2024-03-02T10:10:00.000Z"
    },
    "metrics": {
      "engagementScore": 78,
      "viralityScore": 85,
      "outrageScore": 72,
      "credibilityScore": 22
    },
    "triggersUsed": [
      {
        "type": "emotional_manipulation",
        "trigger": "fear",
        "description": "Exploits fear response to bypass rational thinking",
        "severity": "medium"
      },
      {
        "type": "visual_deception",
        "trigger": "dramatic_filter",
        "description": "Visual filters to exaggerate emotional impact",
        "severity": "medium"
      },
      {
        "type": "conspiracy_framing",
        "trigger": "conspiracy_language",
        "description": "Uses conspiracy framing to create distrust in authorities",
        "severity": "high"
      },
      {
        "type": "urgency_manipulation",
        "trigger": "false_urgency",
        "description": "Creates artificial urgency to prevent critical thinking",
        "severity": "medium"
      }
    ],
    "consequences": "Rapid spread across social media platforms reaching millions. Erosion of trust in legitimate information sources. Long-term damage to public discourse and democratic processes.",
    "realWorldExample": "Similar to pandemic-related misinformation that caused panic buying and vaccine hesitancy."
  },
  "message": "Simulation complete! See how your misinformation spreads."
}
```

---

## Example 2: Detection Challenge

### 1. Get Detection Challenge

**Request:**
```http
GET /api/simulator/detection/challenges/770e8400-e29b-41d4-a716-446655440002
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "title": "Fuel Price Panic Post",
    "content": "🚨 BREAKING: Fuel prices to TRIPLE by next month! Government hiding the TRUTH from you! They don't want you to know about the SECRET oil shortage. Share before they DELETE this! #FuelCrisis #WakeUp #Truth",
    "imageUrl": null,
    "difficulty": "easy",
    "category": "political",
    "realExample": true
  }
}
```

---

### 2. Submit Detection Attempt

**Request:**
```http
POST /api/simulator/detection/submit
Content-Type: application/json

{
  "challengeId": "770e8400-e29b-41d4-a716-446655440002",
  "identifiedTactics": [
    "fear",
    "urgency",
    "conspiracy_framing",
    "exaggeration"
  ],
  "userId": "user123",
  "timeSpent": 42
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attempt": {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "challengeId": "770e8400-e29b-41d4-a716-446655440002",
      "userId": "user123",
      "identifiedTactics": ["fear", "urgency", "conspiracy_framing", "exaggeration"],
      "correctCount": 4,
      "totalTactics": 5,
      "accuracy": 80,
      "timeSpent": 42,
      "score": 88,
      "completed": true,
      "createdAt": "2024-03-02T10:15:00.000Z",
      "updatedAt": "2024-03-02T10:15:00.000Z"
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
    "explanation": "This post uses fear-mongering (TRIPLE prices), false urgency (share before they DELETE), conspiracy framing (TRUTH, SECRET), and exaggeration (no evidence of tripling prices). These tactics bypass critical thinking by triggering emotional responses. The 'false_urgency' tactic creates artificial time pressure to prevent fact-checking.",
    "userScore": 88,
    "accuracy": 80
  },
  "message": "You scored 88/100! Accuracy: 80.0%"
}
```

---

## Example 3: User Statistics

**Request:**
```http
GET /api/simulator/stats/user123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "gamesPlayed": 12,
    "avgGameScore": 76.8,
    "highestGameScore": 95,
    "detectionsAttempted": 28,
    "avgDetectionScore": 82.3,
    "avgDetectionAccuracy": 85.7
  }
}
```

---

## Example 4: Leaderboard

**Request:**
```http
GET /api/simulator/leaderboard?limit=5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "game-1",
      "userId": "expert_user",
      "role": "spin_doctor",
      "score": 98,
      "viralityScore": 95,
      "engagementScore": 97,
      "completedAt": "2024-03-02T09:30:00.000Z",
      "scenario": {
        "title": "Election Interference",
        "difficulty": "hard"
      }
    },
    {
      "id": "game-2",
      "userId": "power_player",
      "role": "bot_manager",
      "score": 95,
      "viralityScore": 98,
      "engagementScore": 92,
      "completedAt": "2024-03-02T08:45:00.000Z",
      "scenario": {
        "title": "Healthcare Reform Controversy",
        "difficulty": "hard"
      }
    },
    {
      "id": "game-3",
      "userId": "master_manipulator",
      "role": "fake_news_creator",
      "score": 92,
      "viralityScore": 90,
      "engagementScore": 94,
      "completedAt": "2024-03-02T10:00:00.000Z",
      "scenario": {
        "title": "Vaccine Hesitancy Campaign",
        "difficulty": "hard"
      }
    },
    {
      "id": "game-4",
      "userId": "user123",
      "role": "sensational_journalist",
      "score": 88,
      "viralityScore": 85,
      "engagementScore": 91,
      "completedAt": "2024-03-02T09:15:00.000Z",
      "scenario": {
        "title": "Climate Change Denial",
        "difficulty": "medium"
      }
    },
    {
      "id": "game-5",
      "userId": "newbie_player",
      "role": "fake_news_creator",
      "score": 82,
      "viralityScore": 80,
      "engagementScore": 85,
      "completedAt": "2024-03-02T10:05:00.000Z",
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

## Frontend UI Suggestions

### Dashboard Layout

```
┌──────────────────────────────────────────────────────────┐
│                  MISINFORMATION SIMULATOR                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Choose Your Path:                                       │
│  ┌──────────────────┐    ┌──────────────────┐         │
│  │  Creation Mode   │    │  Detection Mode  │         │
│  │  🎭 Play Attacker│    │  🛡️ Be Defender  │         │
│  │  Learn to Create │    │  Learn to Detect │         │
│  └──────────────────┘    └──────────────────┘         │
│                                                          │
│  Your Stats:                                             │
│  Games Played: 12        Avg Score: 76.8                │
│  Detections: 28          Accuracy: 85.7%                │
│                                                          │
│  🏆 Leaderboard Top 3:                                   │
│  1. expert_user (98) - Election Interference            │
│  2. power_player (95) - Healthcare Controversy          │
│  3. master_manipulator (92) - Vaccine Campaign          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Game Results Screen

```
┌──────────────────────────────────────────────────────────┐
│            🎯 SIMULATION COMPLETE!                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Your Misinformation Score: 82/100                       │
│                                                          │
│  📊 Impact Metrics:                                      │
│  ┌────────────────────────────────────────────┐        │
│  │ Engagement:   [████████████░░] 78%         │        │
│  │ Virality:     [█████████████░] 85%         │        │
│  │ Outrage:      [███████████░░░] 72%         │        │
│  │ Credibility:  [███░░░░░░░░░░░] 22%         │        │
│  └────────────────────────────────────────────┘        │
│                                                          │
│  ⚠️ Psychological Triggers Used: (4)                    │
│  • Fear Manipulation (Medium Severity)                   │
│  • Visual Deception (Medium Severity)                    │
│  • Conspiracy Framing (High Severity) ⚠️                │
│  • False Urgency (Medium Severity)                       │
│                                                          │
│  📚 Learn From This:                                     │
│  Similar tactics were used in pandemic misinformation    │
│  that caused panic buying and vaccine hesitancy.         │
│                                                          │
│  🌍 Real-World Consequences:                            │
│  • Rapid spread across platforms                         │
│  • Erosion of trust in media                             │
│  • Damage to public discourse                            │
│                                                          │
│  Now you know how it works. Can you detect it?           │
│  ┌──────────────────────┐                               │
│  │  Try Detection Mode  │                               │
│  └──────────────────────┘                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Color Palette Suggestions

- **Primary**: `#1E3A8A` (Deep Blue) - Trust and authority
- **Danger**: `#DC2626` (Red) - High manipulation/severity
- **Warning**: `#F59E0B` (Amber) - Medium severity
- **Success**: `#10B981` (Green) - Good detection/learning
- **Background**: `#F9FAFB` (Light Gray)
- **Dark**: `#111827` (Near Black) - Text

---

## Animation Ideas

1. **Virality Meter**: Gradually fills up as simulation runs
2. **Engagement Pulse**: Numbers count up with pulse animation
3. **Trigger Reveal**: Cards flip to show each trigger
4. **Progress Bar**: Shows game phase (creation → simulation → reveal)
5. **Confetti**: On high scores in detection mode
6. **Warning Flash**: On high-severity tactics identified

---

**Use these examples to build your frontend UI! 🎨**
