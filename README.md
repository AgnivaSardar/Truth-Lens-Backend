# Truth Lens Backend API

A comprehensive backend system for the Truth Lens application that provides fact-checking, news management, speech processing, translation, and RAG-based information retrieval.

## 🚀 Features

### Core Services

1. **📰 News Management**
   - CRUD operations for news articles
   - Trending and hot news filtering
   - Category-based organization
   - Search functionality

2. **✅ Fact Checking Pipeline**
   - Screenshot to text extraction (OCR)
   - AI-powered fact verification
   - Multi-language support
   - Source citation
   - Confidence scoring

3. **🎤 Speech Processing**
   - Text-to-Speech (TTS)
   - Speech-to-Text (STT)
   - Multiple voice options
   - Multi-language support

4. **🌐 Translation Service**
   - Multi-language translation
   - Automatic language detection
   - Batch translation support
   - Powered by Google Translate or LibreTranslate

5. **🔍 RAG (Retrieval-Augmented Generation)**
   - Intelligent information search
   - Context-aware responses
   - Search history tracking
   - Vector-based document retrieval

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- OpenAI API key (required for core features)
- Optional: Google Cloud APIs, ElevenLabs API

## 🛠️ Installation

1. **Clone and navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration.

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # Or push schema directly
   npm run prisma:push
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### News Endpoints

#### Get All News
```http
GET /api/news?page=1&limit=10&trending=true&hot=true&category=politics&search=election
```

#### Get Trending News
```http
GET /api/news/trending?limit=10
```

#### Get Hot News
```http
GET /api/news/hot?limit=10
```

#### Get News Statistics
```http
GET /api/news/stats
```

#### Get Single News
```http
GET /api/news/:id
```

#### Create News
```http
POST /api/news
Content-Type: application/json

{
  "title": "Breaking News",
  "description": "Short description",
  "content": "Full content here...",
  "isHot": true,
  "isTrending": true,
  "source": "News Source",
  "imageUrl": "https://example.com/image.jpg",
  "category": "politics"
}
```

#### Update News
```http
PUT /api/news/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "isHot": false
}
```

#### Delete News
```http
DELETE /api/news/:id
```

### Fact Check Endpoints

#### Fact Check from Screenshot
```http
POST /api/fact-check/screenshot
Content-Type: application/json

{
  "image": "base64_encoded_image_data",
  "language": "en",
  "generateAudio": true
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "extractedText": "The extracted text from screenshot",
    "ocrConfidence": 0.95,
    "factCheck": {
      "isFactual": false,
      "status": "FALSE",
      "explanation": "This claim is false because...",
      "sources": ["https://source1.com", "https://source2.com"],
      "confidence": 0.85
    },
    "language": "en",
    "audio": "base64_audio_data"
  }
}
```

#### Fact Check from Text
```http
POST /api/fact-check/text
Content-Type: application/json

{
  "text": "Text to fact check",
  "language": "en",
  "generateAudio": false
}
```

#### Get Fact Check History
```http
GET /api/fact-check/history?page=1&limit=20&status=FALSE
```

#### Get Fact Check Statistics
```http
GET /api/fact-check/stats
```

#### Get Fact Check by ID
```http
GET /api/fact-check/:id
```

### Speech Endpoints

#### Text to Speech
```http
POST /api/speech/text-to-speech
Content-Type: application/json

{
  "text": "Text to convert to speech",
  "language": "en",
  "voice": "alloy"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "audio": "base64_audio_data",
    "format": "mp3",
    "language": "en"
  }
}
```

#### Speech to Text
```http
POST /api/speech/speech-to-text
Content-Type: application/json

{
  "audio": "base64_audio_data",
  "language": "en"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "text": "Transcribed text",
    "language": "en",
    "confidence": 0.95
  }
}
```

#### Speech to Text with Translation
```http
POST /api/speech/speech-to-text-translate
Content-Type: application/json

{
  "audio": "base64_audio_data",
  "sourceLang": "en",
  "targetLang": "es"
}
```

### Translation Endpoints

#### Translate Text
```http
POST /api/translate
Content-Type: application/json

{
  "text": "Hello, world!",
  "targetLang": "es",
  "sourceLang": "en"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "translatedText": "¡Hola, mundo!",
    "sourceLang": "en",
    "targetLang": "es"
  }
}
```

#### Detect Language
```http
POST /api/translate/detect
Content-Type: application/json

{
  "text": "Bonjour le monde"
}
```

#### Batch Translate
```http
POST /api/translate/batch
Content-Type: application/json

{
  "texts": ["Hello", "Goodbye", "Thank you"],
  "targetLang": "fr",
  "sourceLang": "en"
}
```

### RAG Endpoints

#### Search
```http
POST /api/rag/search
Content-Type: application/json

{
  "query": "What are the latest trends in AI?",
  "userId": "user123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "answer": "Based on recent information...",
    "sources": ["Source 1", "Source 2"],
    "relevance": 0.92,
    "relatedQueries": ["AI trends 2024", "Machine learning advances"]
  }
}
```

#### Get Search History
```http
GET /api/rag/history?userId=user123&limit=10
```

#### Index Content
```http
POST /api/rag/index
Content-Type: application/json

{
  "content": "Content to index for RAG",
  "metadata": {
    "source": "news",
    "category": "technology"
  }
}
```

## 🗄️ Database Schema

### Models

- **News**: Stores news articles with trending/hot flags
- **FactCheck**: Stores fact-checking results with verification status
- **SearchHistory**: Tracks RAG search queries and results
- **UserPreference**: User preferences for language and voice settings

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `GOOGLE_TRANSLATE_API_KEY` | Google Translate API key | No |
| `GOOGLE_FACT_CHECK_API_KEY` | Google Fact Check API key | No |
| `ELEVEN_LABS_API_KEY` | ElevenLabs API key | No |

## 🧪 Testing

```bash
npm test
```

## 📝 Development

```bash
# Run in development mode with auto-reload
npm run dev

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Format code
npm run format

# Lint code
npm run lint
```

## 🏗️ Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── newsController.js
│   │   ├── factCheckController.js
│   │   ├── speechController.js
│   │   ├── ragController.js
│   │   └── translationController.js
│   ├── routes/                # API routes
│   │   ├── newsRoutes.js
│   │   ├── factCheckRoutes.js
│   │   ├── speechRoutes.js
│   │   ├── ragRoutes.js
│   │   └── translationRoutes.js
│   ├── services/              # Business logic & AI services
│   │   ├── ocrService.js
│   │   ├── factCheckService.js
│   │   ├── translationService.js
│   │   ├── speechService.js
│   │   └── ragService.js
│   ├── middleware/            # Express middleware
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   ├── rateLimiter.js
│   │   └── validation.js
│   └── server.js              # Main server file
├── .env                       # Environment variables (not in git)
├── .env.example               # Environment variables template
├── package.json
└── README.md
```

## 🔐 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting on all endpoints
- Strict rate limiting on expensive operations (OCR, fact-checking)
- Request validation
- Error handling middleware

## 🚀 Deployment

### Production Checklist

1. Set `NODE_ENV=production` in environment variables
2. Use a production PostgreSQL database
3. Set up proper CORS with specific frontend URL
4. Configure rate limits based on your needs
5. Set up logging and monitoring
6. Use a process manager (PM2, systemd)
7. Set up SSL/TLS with reverse proxy (nginx)

### Example PM2 Configuration

```bash
pm2 start src/server.js --name truth-lens-backend
pm2 startup
pm2 save
```

## 📊 Performance Considerations

- Rate limiting prevents API abuse
- Database indexes on frequently queried fields
- Proper error handling prevents server crashes
- Connection pooling for database
- Caching can be added for frequently accessed data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License

## 👨‍💻 Author

Agniva

## 🆘 Support

For issues and questions, please open an issue on the repository.

---

**Note**: This is a comprehensive backend system that requires proper API keys and configuration. Make sure to secure your environment variables and never commit them to version control.
#   T r u t h - L e n s - B a c k e n d  
 