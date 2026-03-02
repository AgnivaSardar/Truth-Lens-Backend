# 🎮 Misinformation Simulator - Quick Start Guide

## What is it?

A **game-based learning platform** where you learn how misinformation works by **playing as the attacker**. Instead of just checking facts, you learn how manipulation tactics work from the inside, then practice detecting them.

## Why is this powerful?

- **Cognitive Immunity**: Train your brain to recognize manipulation
- **Reverse Learning**: Understanding creation makes you better at detection
- **Engaging**: Game mechanics make learning fun and memorable
- **Real Impact**: Skills transfer directly to social media use

---

## 🚀 Getting Started

### 1. Setup Database

Make sure your PostgreSQL database is running, then:

```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed initial scenarios and challenges
npm run seed:simulator
```

This creates:
- ✅ 8 diverse scenarios (easy, medium, hard difficulty)
- ✅ 6 detection challenges with real-world examples
- ✅ Ready-to-play content

### 2. Start the Server

```bash
npm run dev
```

Visit: `http://localhost:3000/api/simulator`

---

## 🎯 Two Game Modes

### Mode 1: Creation Mode (The Dark Side)

**Goal**: Create effective misinformation to understand how it works

**Flow**:
1. **Choose Scenario** - Pick from 8 real-world topics
2. **Select Role**:
   - `fake_news_creator` - Fabricate sensational stories
   - `spin_doctor` - Twist facts for political gain
   - `bot_manager` - Coordinate bot networks
   - `sensational_journalist` - Exaggerate for clicks
3. **Craft Your Misinformation**:
   - Write emotional wording
   - Choose psychological trigger (fear, anger, outrage, etc.)
   - Select image manipulation tactic
   - Pick hashtags for virality
   - Target specific audience
4. **Run Simulation** - See metrics:
   - 📈 **Engagement Score** (0-100)
   - 🔥 **Virality Score** (0-100)
   - ⚠️ **Outrage Score** (0-100)
   - 📉 **Credibility Score** (0-100)
5. **Learn Impact**:
   - Which psychological triggers you used
   - Real-world examples of similar misinformation
   - Potential consequences and harm
   - Your manipulation effectiveness score

### Mode 2: Detection Mode (The Hero)

**Goal**: Practice identifying manipulation tactics in real content

**Flow**:
1. **Get Challenge** - Receive suspicious content to analyze
2. **Identify Tactics** - Select all manipulation techniques you spot:
   - Emotional manipulation (fear, anger, urgency)
   - Visual deception (fake captions, misleading crops, deepfakes)
   - Cognitive tricks (conspiracy framing, false authority)
3. **Submit & Score**:
   - Get accuracy percentage
   - See which tactics you missed
   - Learn detailed explanations
   - Earn points based on speed and accuracy

---

## 📱 API Quick Reference

### Start a Game

```bash
curl -X POST http://localhost:3000/api/simulator/games/start \
  -H "Content-Type: application/json" \
  -d '{
    "scenarioId": "get-from-scenarios-endpoint",
    "role": "fake_news_creator",
    "userId": "user123"
  }'
```

### Submit Choices

```bash
curl -X POST http://localhost:3000/api/simulator/games/{gameId}/submit \
  -H "Content-Type: application/json" \
  -d '{
    "emotionalWording": "SHOCKING: Prices to EXPLODE overnight!",
    "selectedEmotion": "fear",
    "imageManipulation": "dramatic_filter",
    "hashtags": ["#Breaking", "#Crisis", "#Truth"],
    "targetAudience": "general"
  }'
```

**Response shows**:
- Real-time metrics (engagement, virality, outrage)
- Psychological triggers identified
- Real-world similar examples
- Potential consequences

### Try Detection Challenge

```bash
# Get challenges
curl http://localhost:3000/api/simulator/detection/challenges

# Submit detection attempt
curl -X POST http://localhost:3000/api/simulator/detection/submit \
  -H "Content-Type: application/json" \
  -d '{
    "challengeId": "challenge-uuid",
    "identifiedTactics": ["fear", "urgency", "conspiracy_framing"],
    "userId": "user123",
    "timeSpent": 45
  }'
```

**Response shows**:
- Your score (0-100)
- Accuracy percentage
- Tactics you missed
- Detailed explanation

---

## 🎨 Frontend Demo Ideas

### Visual Dashboard

```
┌─────────────────────────────────────┐
│     SIMULATION RESULTS              │
├─────────────────────────────────────┤
│                                     │
│  Engagement:  [████████░░] 82%     │
│  Virality:    [████████░░] 85%     │
│  Outrage:     [██████░░░░] 68%     │
│  Credibility: [██░░░░░░░░] 25%     │
│                                     │
│  🎯 Score: 78/100                   │
│                                     │
│  Psychological Triggers Used:       │
│  ⚠️ Fear Manipulation              │
│  🔥 False Urgency                  │
│  📸 Visual Exaggeration            │
│                                     │
│  Real-World Impact:                 │
│  "Similar tactics used in 2020      │
│   election misinformation that      │
│   reached 15M people..."            │
│                                     │
└─────────────────────────────────────┘
```

### Animated Elements

- **Virality meter** that rises as simulation runs
- **Engagement graph** showing spread over time
- **Heat map** of emotional triggers
- **Consequence timeline** showing escalation
- **Leaderboard** with top manipulators (gamification)

### Color Coding

- 🔴 High manipulation effectiveness
- 🟡 Medium credibility loss
- 🟢 Low harm potential
- ⚫ Real-world danger level

---

## 🧠 What Users Learn

### Creation Mode Teaches:
1. **Emotional Triggers**: Fear, anger, outrage, urgency work
2. **Visual Manipulation**: Images amplify false messages
3. **Audience Targeting**: Different groups fall for different tactics
4. **Viral Mechanics**: What makes content spread rapidly
5. **Credibility Trade-off**: High virality often means low credibility

### Detection Mode Teaches:
1. **Pattern Recognition**: Spot common manipulation tactics
2. **Critical Thinking**: Question before sharing
3. **Context Awareness**: Look for what's missing
4. **Source Verification**: Check claims against evidence
5. **Emotional Awareness**: Notice when content triggers emotions

---

## 📊 Scoring System

### Game Score (0-100)

```javascript
Score = (Virality × 0.2) + 
        (Engagement × 0.2) + 
        (Triggers × 6 each) + 
        (Effectiveness × 0.3) × 
        Difficulty Multiplier
```

**High Score Means**: Effective manipulation (scary but educational!)

### Detection Score (0-100)

```javascript
Score = (Accuracy %) + 
        Speed Bonus (if < 60s) - 
        False Positive Penalty (5pts each)
```

**High Score Means**: Good at spotting manipulation (goal!)

---

## 🏆 Demo Script for Judges

### Opening (30 seconds)

> "What if fighting misinformation isn't about checking facts,  
> but about understanding how false information is created?  
> Our simulator lets you **play as the attacker** to build cognitive immunity."

### Live Demo (2 minutes)

1. **Show scenario selection**
   - "Real-world topics like fuel prices, healthcare, elections"

2. **Create misinformation live**
   - Pick emotional trigger: "Fear"
   - Write dramatic text: "BREAKING: Crisis incoming!"
   - Select manipulation: "Dramatic filter"
   - Choose hashtags: "#Breaking #Crisis"

3. **Run simulation - show dashboard**
   - Virality meter rises dramatically
   - Engagement shoots up
   - Credibility drops
   - "Score: 85/100 - Highly effective manipulation!"

4. **Show educational reveal**
   - "You used 4 psychological triggers"
   - "Similar to [real-world example]"
   - "Could cause [specific harm]"

5. **Flip to detection mode**
   - Show real misinformation example
   - "Now you try to spot the tactics"
   - Submit and score

### Impact Statement (30 seconds)

> "Traditional fact-checking is reactive. Our approach is **preventive**.  
> Users who understand how manipulation works become immune to it.  
> This builds critical thinking that lasts a lifetime."

---

## 🎯 Competition Advantages

### For Hackathons/Competitions:

1. **Social Impact** ✅
   - Addresses critical misinformation problem
   - Builds cognitive immunity in population
   - Measurable learning outcomes

2. **Technical Innovation** ✅
   - Unique reverse-learning approach
   - Sophisticated simulation engine
   - Real-time metrics calculation
   - Psychological trigger detection

3. **User Engagement** ✅
   - Game mechanics (roles, scores, leaderboard)
   - Instant feedback
   - Visible progress tracking
   - Shareable results

4. **Scalability** ✅
   - Rule-based simulation (no heavy ML needed)
   - Easily add new scenarios
   - Works across languages
   - Cloud-ready architecture

5. **Demo-Friendly** ✅
   - Visual dashboard
   - Real-time animations
   - Clear before/after learning moment
   - Wow factor in simulation

6. **Market Validation** ✅
   - Schools need media literacy tools
   - Social platforms need education content
   - Governments fighting misinformation
   - Research institutions studying manipulation

---

## 📚 Full Documentation

- **Complete API Reference**: [SIMULATOR_API.md](../docs/SIMULATOR_API.md)
- **API Flow Diagrams**: [API_FLOW.md](../API_FLOW.md)
- **Main README**: [README.md](../README.md)

---

## 🎓 Educational Applications

### In Schools:
- Media literacy curriculum
- Critical thinking exercises
- Social studies lessons
- Psychology demonstrations

### For Researchers:
- Study misinformation creation patterns
- Test intervention effectiveness
- Analyze psychological triggers
- Measure learning outcomes

### For Social Media Users:
- Daily "detection training"
- Share results with friends
- Challenge others
- Track improvement over time

---

## 💡 Next Steps

1. ✅ **Test the API** - Try creating a game
2. ✅ **Build Frontend** - Create engaging UI
3. ✅ **Add Animations** - Make metrics come alive
4. ✅ **Create More Scenarios** - Expand content library
5. ✅ **Add Social Features** - Leaderboards, challenges
6. ✅ **Integrate with Main App** - Connect to fact-checking pipeline

---

## 🚨 Remember

> **The goal is NOT to teach people to create misinformation.  
> The goal is to make them IMMUNE to manipulation by understanding it.**

Like teaching cybersecurity students to hack (ethically) so they can defend,  
we teach misinformation creation (in a sandbox) so users can detect it in real life.

---

**Built with ❤️ for Truth Lens**  
*Fighting Misinformation Through Education*

🎮 Ready to play? Start your first game now!

```bash
npm run dev
# Visit http://localhost:3000/api/simulator/scenarios
```
