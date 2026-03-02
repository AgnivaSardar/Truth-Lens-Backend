# Truth Lens API Testing Routes

Base URL: `http://localhost:3000`

## Global Routes

### 1) Health Check
- **GET** `/health`
- **Payload**: None
- **Success (200)**
```json
{
  "success": true,
  "message": "Truth Lens Backend is running",
  "timestamp": "2026-03-03T10:00:00.000Z",
  "version": "1.0.0"
}
```

### 2) Root API Info
- **GET** `/`
- **Payload**: None
- **Success (200)**
```json
{
  "success": true,
  "message": "Welcome to Truth Lens API",
  "version": "1.0.0",
  "endpoints": {
    "news": "/api/news",
    "factCheck": "/api/fact-check",
    "speech": "/api/speech",
    "rag": "/api/rag",
    "translate": "/api/translate",
    "simulator": "/api/simulator"
  }
}
```

---

## News Routes (`/api/news`)

### 1) Get All News
- **GET** `/api/news?page=1&limit=10&trending=true&hot=true&category=politics&search=election`
- **Payload**: None
- **Query Params**:
  - `page` (optional, default `1`)
  - `limit` (optional, default `10`)
  - `trending` (`true|false`)
  - `hot` (`true|false`)
  - `category` (string)
  - `search` (string)
- **Success (200)**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

### 2) Get Trending News
- **GET** `/api/news/trending?limit=10`
- **Success (200)**
```json
{ "success": true, "data": [] }
```

### 3) Get Hot News
- **GET** `/api/news/hot?limit=10`
- **Success (200)**
```json
{ "success": true, "data": [] }
```

### 4) Get News Stats
- **GET** `/api/news/stats`
- **Success (200)**
```json
{
  "success": true,
  "data": { "total": 0, "trending": 0, "hot": 0 }
}
```

### 5) Get Single News
- **GET** `/api/news/:id`
- **Success (200)**
```json
{ "success": true, "data": { "id": "...", "title": "..." } }
```
- **Not Found (404)**
```json
{ "success": false, "error": "News not found" }
```

### 6) Create News
- **POST** `/api/news`
- **Payload**
```json
{
  "title": "Breaking Update",
  "description": "Short summary",
  "content": "Full article content",
  "isHot": false,
  "isTrending": true,
  "source": "Reuters",
  "imageUrl": "https://example.com/image.jpg",
  "category": "politics",
  "publishedAt": "2026-03-03T10:00:00.000Z"
}
```
- **Required**: `title`, `description`, `content`
- **Success (201)**
```json
{ "success": true, "data": { "id": "...", "title": "Breaking Update" } }
```
- **Validation Error (400)**
```json
{ "success": false, "error": "Title, description, and content are required" }
```

### 7) Update News
- **PUT** `/api/news/:id`
- **Payload** (any updatable fields)
```json
{ "title": "Updated title", "isHot": true }
```
- **Success (200)**
```json
{ "success": true, "data": { "id": "...", "title": "Updated title" } }
```
- **Not Found (404)**
```json
{ "success": false, "error": "News not found" }
```

### 8) Delete News
- **DELETE** `/api/news/:id`
- **Success (200)**
```json
{ "success": true, "message": "News deleted successfully" }
```
- **Not Found (404)**
```json
{ "success": false, "error": "News not found" }
```

---

## Fact-Check Routes (`/api/fact-check`)

### 1) Fact Check from Screenshot
- **POST** `/api/fact-check/screenshot`
- **Payload**
```json
{
  "image": "<base64-image>",
  "language": "en",
  "generateAudio": false
}
```
- **Required**: `image`
- **Success (200)**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "extractedText": "...",
    "ocrConfidence": 0.93,
    "factCheck": {
      "isFactual": false,
      "status": "FALSE",
      "explanation": "...",
      "sources": ["https://..."],
      "confidence": 0.91
    },
    "language": "en",
    "audio": null
  }
}
```
- **Validation Error (400)**
```json
{ "success": false, "error": "Image data is required" }
```

### 2) Fact Check from Text
- **POST** `/api/fact-check/text`
- **Payload**
```json
{
  "text": "Vaccines contain tracking chips",
  "language": "en",
  "generateAudio": false
}
```
- **Required**: `text`
- **Success (200)**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "originalText": "Vaccines contain tracking chips",
    "factCheck": {
      "isFactual": false,
      "status": "FALSE",
      "explanation": "...",
      "sources": ["https://..."],
      "confidence": 0.95
    },
    "language": "en",
    "audio": null
  }
}
```
- **Validation Error (400)**
```json
{ "success": false, "error": "Text is required" }
```

### 3) Fact Check History
- **GET** `/api/fact-check/history?page=1&limit=20&status=FALSE`
- **Success (200)**
```json
{
  "success": true,
  "data": [],
  "pagination": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 }
}
```

### 4) Fact Check Stats
- **GET** `/api/fact-check/stats`
- **Success (200)**
```json
{
  "success": true,
  "data": {
    "total": 0,
    "breakdown": {
      "true": 0,
      "false": 0,
      "partiallyTrue": 0,
      "unverified": 0
    }
  }
}
```

### 5) Get Fact Check by ID
- **GET** `/api/fact-check/:id`
- **Success (200)**
```json
{ "success": true, "data": { "id": "...", "verificationStatus": "FALSE" } }
```
- **Not Found (404)**
```json
{ "success": false, "error": "Fact check not found" }
```

---

## Speech Routes (`/api/speech`)

### 1) Text to Speech
- **POST** `/api/speech/text-to-speech`
- **Payload**
```json
{
  "text": "Hello world",
  "language": "en",
  "voice": "default"
}
```
- **Required**: `text`
- **Success (200)**
```json
{
  "success": true,
  "data": {
    "audio": "<base64-audio>",
    "format": "mp3",
    "language": "en"
  }
}
```

### 2) Speech to Text
- **POST** `/api/speech/speech-to-text`
- **Payload**
```json
{
  "audio": "<base64-audio>",
  "language": "en"
}
```
- **Required**: `audio`
- **Success (200)**
```json
{
  "success": true,
  "data": { "text": "hello world", "language": "en", "confidence": 0.88 }
}
```

### 3) Speech to Text + Translate
- **POST** `/api/speech/speech-to-text-translate`
- **Payload**
```json
{
  "audio": "<base64-audio>",
  "sourceLang": "en",
  "targetLang": "hi"
}
```
- **Required**: `audio`
- **Success (200)**
```json
{
  "success": true,
  "data": {
    "originalText": "hello world",
    "translatedText": "नमस्ते दुनिया",
    "sourceLang": "en",
    "targetLang": "hi",
    "confidence": 0.88
  }
}
```

---

## RAG Routes (`/api/rag`)

### 1) Search
- **POST** `/api/rag/search`
- **Payload**
```json
{
  "query": "What happened in election claims yesterday?",
  "userId": "optional-user-id"
}
```
- **Required**: `query`
- **Success (200)**
```json
{
  "success": true,
  "data": {
    "answer": "...",
    "sources": [],
    "confidence": 0.8
  }
}
```

### 2) Search History
- **GET** `/api/rag/history?userId=<user-id>&limit=10`
- **Required Query**: `userId`
- **Success (200)**
```json
{ "success": true, "data": [] }
```
- **Validation Error (400)**
```json
{ "success": false, "error": "User ID is required" }
```

### 3) Index Content
- **POST** `/api/rag/index`
- **Payload**
```json
{
  "content": "Article text to index",
  "metadata": { "source": "BBC", "category": "politics" }
}
```
- **Required**: `content`
- **Success (200)**
```json
{ "success": true, "message": "Content indexed successfully" }
```

---

## Translation Routes (`/api/translate`)

### 1) Translate Text
- **POST** `/api/translate`
- **Payload**
```json
{
  "text": "Hello",
  "targetLang": "es",
  "sourceLang": "auto"
}
```
- **Required**: `text`, `targetLang`
- **Success (200)**
```json
{
  "success": true,
  "data": {
    "translatedText": "Hola",
    "sourceLanguage": "en",
    "targetLanguage": "es"
  }
}
```

### 2) Detect Language
- **POST** `/api/translate/detect`
- **Payload**
```json
{ "text": "Bonjour" }
```
- **Required**: `text`
- **Success (200)**
```json
{ "success": true, "data": { "language": "fr", "confidence": 0.99 } }
```

### 3) Batch Translate
- **POST** `/api/translate/batch`
- **Payload**
```json
{
  "texts": ["Hello", "How are you?"],
  "targetLang": "hi",
  "sourceLang": "auto"
}
```
- **Required**: `texts` (array), `targetLang`
- **Success (200)**
```json
{
  "success": true,
  "data": [
    { "translatedText": "नमस्ते" },
    { "translatedText": "आप कैसे हैं?" }
  ]
}
```

---

## Simulator Routes (`/api/simulator`)

### Scenario Routes

#### 1) Get Scenarios
- **GET** `/api/simulator/scenarios?difficulty=easy&limit=20`
- **Success (200)**
```json
{ "success": true, "data": [], "count": 0 }
```

#### 2) Get Scenario by ID
- **GET** `/api/simulator/scenarios/:id`
- **Success (200)**
```json
{ "success": true, "data": { "id": "...", "title": "Fuel Price Crisis" } }
```
- **Not Found (404)**
```json
{ "success": false, "error": "Scenario not found" }
```

#### 3) Create Scenario
- **POST** `/api/simulator/scenarios`
- **Status**: Not included in “working routes” testing flow right now (controller exists, but service implementation is currently missing).

### Game Routes

#### 4) Start Game
- **POST** `/api/simulator/games/start`
- **Payload**
```json
{ "scenarioId": "<scenario-id>", "userId": "optional-user-id" }
```
- **Required**: `scenarioId`
- **Success (201)**
```json
{
  "success": true,
  "data": {
    "game": { "id": "...", "phase": "playing" },
    "currentNode": {
      "id": "...",
      "stepNumber": 1,
      "question": "...",
      "options": [
        { "id": "opt1", "text": "...", "order": 1 },
        { "id": "opt2", "text": "...", "order": 2 }
      ]
    },
    "scenario": { "id": "...", "title": "..." }
  },
  "message": "Game started! You will make choices that lead to different types of fake news."
}
```

#### 5) Make Choice
- **POST** `/api/simulator/games/:id/choice`
- **Payload**
```json
{ "optionId": "<option-id>" }
```
- **Required**: `optionId`

- **Success (200, game continues)**
```json
{
  "success": true,
  "gameComplete": false,
  "data": {
    "currentMetrics": {
      "engagementScore": 35,
      "viralityScore": 30,
      "outrageScore": 25,
      "credibilityScore": 40
    },
    "tacticUsed": {
      "name": "conspiracy_framing",
      "explanation": "..."
    },
    "nextNode": {
      "id": "...",
      "stepNumber": 2,
      "question": "...",
      "options": [
        { "id": "...", "text": "...", "order": 1 },
        { "id": "...", "text": "...", "order": 2 }
      ]
    }
  },
  "message": "Choice recorded. Next decision point ready."
}
```

- **Success (200, game complete)**
```json
{
  "success": true,
  "gameComplete": true,
  "data": {
    "headline": "...",
    "content": "...",
    "metrics": {
      "engagementScore": 70,
      "viralityScore": 80,
      "outrageScore": 65,
      "credibilityScore": 15
    },
    "tacticsUsed": [],
    "realWorldExamples": [],
    "consequences": "...",
    "score": 88
  },
  "message": "Game complete! See the fake news article you created."
}
```

#### 6) Get Game by ID
- **GET** `/api/simulator/games/:id`
- **Success (200)**
```json
{ "success": true, "data": { "id": "...", "phase": "playing", "currentNode": {} } }
```
- **Not Found (404)**
```json
{ "success": false, "error": "Game not found" }
```

#### 7) Get User Games
- **GET** `/api/simulator/games/user/:userId?limit=10`
- **Success (200)**
```json
{ "success": true, "data": [], "count": 0 }
```

#### 8) Leaderboard
- **GET** `/api/simulator/leaderboard?limit=10`
- **Success (200)**
```json
{ "success": true, "data": [], "count": 0 }
```

### Detection Mode Routes

#### 9) Get Detection Challenges
- **GET** `/api/simulator/detection/challenges?difficulty=easy&category=economy&limit=20`
- **Success (200)**
```json
{ "success": true, "data": [], "count": 0 }
```

#### 10) Get Detection Challenge by ID
- **GET** `/api/simulator/detection/challenges/:id`
- **Success (200)**
```json
{ "success": true, "data": { "id": "...", "title": "...", "content": "..." } }
```
- **Not Found (404)**
```json
{ "success": false, "error": "Challenge not found" }
```

#### 11) Submit Detection Attempt
- **POST** `/api/simulator/detection/submit`
- **Payload**
```json
{
  "challengeId": "<challenge-id>",
  "identifiedTactics": ["fear_mongering", "false_urgency"],
  "userId": "optional-user-id",
  "timeSpent": 42
}
```
- **Required**: `challengeId`, `identifiedTactics` (array)
- **Success (200)**
```json
{
  "success": true,
  "data": {
    "attempt": { "id": "...", "score": 75 },
    "correctTactics": ["fear_mongering", "false_urgency"],
    "missed": [],
    "falsePositives": [],
    "explanation": "...",
    "userScore": 75,
    "accuracy": 100
  },
  "message": "You scored 75/100! Accuracy: 100.0%"
}
```

#### 12) Detection History
- **GET** `/api/simulator/detection/history/:userId?limit=10`
- **Success (200)**
```json
{ "success": true, "data": [], "count": 0 }
```

### User Stats

#### 13) Get User Stats
- **GET** `/api/simulator/stats/:userId`
- **Success (200)**
```json
{
  "success": true,
  "data": {
    "gamesPlayed": 0,
    "avgGameScore": 0,
    "highestGameScore": 0,
    "detectionsAttempted": 0,
    "avgDetectionScore": 0,
    "avgDetectionAccuracy": 0
  }
}
```

---

## Common Error Responses

### Validation Error (400)
```json
{ "success": false, "error": "<validation message>" }
```

### Not Found (404)
```json
{ "success": false, "error": "<resource not found>" }
```

### Server Error (500)
```json
{ "success": false, "error": "<operation failed>", "message": "<details>" }
```

### Unknown Endpoint (404)
```json
{ "success": false, "error": "Endpoint not found", "path": "/unknown/path" }
```

---

## Quick cURL Samples

### Create News
```bash
curl -X POST http://localhost:3000/api/news \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Breaking Update",
    "description":"Summary",
    "content":"Long content"
  }'
```

### Start Simulator Game
```bash
curl -X POST http://localhost:3000/api/simulator/games/start \
  -H "Content-Type: application/json" \
  -d '{ "scenarioId": "<scenario-id>" }'
```

### Fact Check Text
```bash
curl -X POST http://localhost:3000/api/fact-check/text \
  -H "Content-Type: application/json" \
  -d '{ "text": "Some claim to verify", "language": "en" }'
```

### Translate Text
```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{ "text": "Hello", "targetLang": "hi", "sourceLang": "auto" }'
```
