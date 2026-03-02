# Truth Lens Backend - API Flow Documentation

## 🔄 Complete Fact-Checking Pipeline

### Flow 1: Screenshot to Verified Result with Audio
```
Frontend (Screenshot) 
    ↓
POST /api/fact-check/screenshot
    ↓
1. OCR Service (Independent OCR Model API)
   - Extract text from image
   - Return text + confidence score
    ↓
2. Fact Check Service (Independent Fact Check Model API)
   - Analyze extracted text
   - Verify claims against known facts
   - Return: isFactual, status, explanation, sources, confidence
    ↓
3. Translation Service (Independent Translation Model API)
   - Translate explanation to user's preferred language
   - Return translated text
    ↓
4. Speech Service (Independent Speech Model API)
   - Convert translated explanation to audio
   - Return audio buffer (MP3)
    ↓
Save to Database (FactCheck model)
    ↓
Return Complete Result to Frontend
```

### Flow 2: Voice Query to RAG Search
```
Frontend (Voice Input)
    ↓
POST /api/speech/speech-to-text
    ↓
1. Speech Service (Independent Speech Model API)
   - Convert audio to text
   - Return transcribed text
    ↓
POST /api/rag/search
    ↓
2. RAG Service
   - Generate embeddings for query
   - Search vector store for relevant documents
   - Use GPT-4 to generate contextual answer
   - Return answer + sources + related queries
    ↓
(Optional) POST /api/speech/text-to-speech
    ↓
3. Speech Service
   - Convert answer to audio
   - Return audio for playback
    ↓
Save to Database (SearchHistory model)
    ↓
Return Result to Frontend
```

## 🎯 API Integration Guide

### Frontend Implementation Examples

#### 1. Fact Check from Screenshot
```javascript
// Frontend Code Example
async function checkFactFromScreenshot(screenshotBase64, language = 'en') {
  const response = await fetch('http://localhost:3000/api/fact-check/screenshot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: screenshotBase64,
      language: language,
      generateAudio: true
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('Extracted Text:', result.data.extractedText);
    console.log('Is Factual:', result.data.factCheck.isFactual);
    console.log('Explanation:', result.data.factCheck.explanation);
    
    // Play audio if generated
    if (result.data.audio) {
      const audio = new Audio(`data:audio/mp3;base64,${result.data.audio}`);
      audio.play();
    }
  }
  
  return result;
}
```

#### 2. Voice to Text Search
```javascript
async function voiceSearch(audioBlob) {
  // Step 1: Convert audio to base64
  const audioBase64 = await blobToBase64(audioBlob);
  
  // Step 2: Speech to Text
  const sttResponse = await fetch('http://localhost:3000/api/speech/speech-to-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audio: audioBase64,
      language: 'en'
    })
  });
  
  const sttResult = await sttResponse.json();
  const query = sttResult.data.text;
  
  // Step 3: Search using RAG
  const ragResponse = await fetch('http://localhost:3000/api/rag/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
      userId: 'current-user-id'
    })
  });
  
  const ragResult = await ragResponse.json();
  
  return {
    query: query,
    answer: ragResult.data.answer,
    sources: ragResult.data.sources
  };
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
```

#### 3. Get Trending News
```javascript
async function getTrendingNews(limit = 10) {
  const response = await fetch(
    `http://localhost:3000/api/news/trending?limit=${limit}`
  );
  
  const result = await response.json();
  return result.data; // Array of trending news
}
```

#### 4. Translate Content
```javascript
async function translateContent(text, targetLang) {
  const response = await fetch('http://localhost:3000/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text,
      targetLang: targetLang,
      sourceLang: 'auto'
    })
  });
  
  const result = await response.json();
  return result.data.translatedText;
}
```

## 🏗️ Service Architecture

### Service Dependencies
```
Controllers (Handle HTTP Requests)
    ↓
Services (Business Logic)
    ↓
External APIs / Models
    ↓
Database (Prisma)
```

### Service Breakdown

| Service | Purpose | External APIs Used |
|---------|---------|-------------------|
| **OCR Service** | Extract text from images | OCR Model API |
| **Fact Check Service** | Verify information | Fact Check Model API |
| **Translation Service** | Translate between languages | Translation Model API |
| **Speech Service** | TTS & STT | Speech Model API |
| **RAG Service** | Intelligent search | OpenAI Embeddings, OpenAI GPT-4 |

## 🔑 Required API Keys

### Essential (Required)
- **OpenAI API Key**: Used for fact-checking, RAG search, embeddings, Whisper STT, and TTS

### Optional (Enhanced Features)
- **Google Translate API Key**: Better translation quality
- **Google Fact Check API Key**: Professional fact-checking database
- **Google Cloud API Key**: Google Speech-to-Text
- **ElevenLabs API Key**: Premium quality text-to-speech

## 📊 Data Flow Examples

### Example 1: News with Hot/Trending Flags
```
Database (News table)
    ↓
GET /api/news?trending=true&hot=true
    ↓
Filter: isTrending=true AND isHot=true
    ↓
Sort by: publishedAt DESC
    ↓
Return: Top news items
```

### Example 2: Fact Check History
```
User checks fact
    ↓
Result saved to FactCheck model
    ↓
GET /api/fact-check/history
    ↓
Retrieve all fact checks ordered by date
    ↓
Display history with status badges
```

## 🎨 Frontend Integration Tips

1. **Loading States**: All AI operations take time. Show loading indicators.

2. **Error Handling**: Wrap API calls in try-catch and show user-friendly errors.

3. **Rate Limiting**: The API has rate limits (100 req/15min general, 10 req/15min for expensive operations).

4. **Audio Handling**: Convert base64 audio to playable format using Audio API.

5. **Language Selection**: Store user's preferred language and pass it to all relevant endpoints.

6. **Caching**: Cache news and fact-check results on frontend to reduce API calls.

## 🔄 Typical User Workflows

### Workflow 1: Check News Article
```
1. User views trending news (GET /api/news/trending)
2. User selects article
3. User clicks "Verify Facts" button
4. Screenshot captured of article
5. POST /api/fact-check/screenshot
6. Display verification result with audio explanation
```

### Workflow 2: Voice Query
```
1. User clicks microphone icon
2. Record audio
3. POST /api/speech/speech-to-text
4. Display transcribed query
5. POST /api/rag/search with transcription
6. Display answer with sources
7. Optional: Convert answer to speech and play
```

### Workflow 3: Multi-language Experience
```
1. User selects language preference (e.g., Spanish)
2. Save to UserPreference model
3. All subsequent fact-checks return results in Spanish
4. Audio generated in Spanish voice
5. News content can be translated on-demand
```

## 🚦 Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created (POST success) |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

## 📈 Monitoring & Analytics

Track these metrics:
- Fact checks per day
- Most common verification statuses
- Average confidence scores
- Popular search queries
- API response times
- Error rates

All search history and fact checks are stored in the database for analytics.

---

## 🎯 Quick Start Testing

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up .env**:
   ```bash
   cp .env.example .env
   # Add your OpenAI API key
   ```

3. **Set up database**:
   ```bash
   npm run prisma:push
   ```

4. **Start server**:
   ```bash
   npm run dev
   ```

5. **Test health endpoint**:
   ```bash
   curl http://localhost:3000/health
   ```

6. **Test fact-check with text**:
   ```bash
   curl -X POST http://localhost:3000/api/fact-check/text \
     -H "Content-Type: application/json" \
     -d '{"text": "The Earth is flat", "language": "en"}'
   ```

---

**Happy Building! 🚀**
