# Database Seeding Guide

## Overview

Truth Lens uses seed scripts to populate the database with initial data for development and testing. All seed files are located in `backend/src/seeds/`.

## Available Seeds

### 1. News Seed (`newsSeed.js`)
Populates news articles, high-impact topics, trending topics, and viral claims.

**Command:**
```bash
cd backend
npm run seed:news
```

**Data Created:**
- 3 High-impact topics (energy, health, AI)
- 2 Trending topics (election integrity, water security)  
- 3 Viral claims with verification statuses
- Complete article content with analysis and source comparisons

**Database Tables:**
- `News` - 8 articles total

### 2. Simulator Seed (`simulatorSeed.js`)
Populates simulator scenarios and detection challenges.

**Command:**
```bash
cd backend
npm run seed:simulator
```

**Data Created:**
- 8 Scenarios across different topics (fuel, healthcare, election, climate, vaccine, economy, entertainment, technology)
- 12 Detection challenges for fake news identification practice

**Database Tables:**
- `Scenario` - 8 scenarios
- `DetectionChallenge` - 12 challenges

### 3. Seed All Data
Run both seeds in sequence.

**Command:**
```bash
cd backend
npm run seed:all
```

## Database Requirements

Before seeding, ensure:

1. **PostgreSQL is running**
2. **Database exists** (specified in `DATABASE_URL`)
3. **Schema is synced**:
   ```bash
   npm run prisma:push
   # OR
   npm run prisma:migrate
   ```

## Seed Data Structure

### News Articles

Each news article contains:
- `title` - Article headline
- `slug` - URL-friendly identifier (e.g., "global-energy-prices")
- `description` - Short summary
- `content` - JSON structure with:
  - `body[]` - Array of paragraphs with verification status
  - `analysis` - Confidence scores, fact density, source reliability
  - `sourceComparison` - Political lean and reliability of sources
- `impactScore` - 0-100 (for high-impact ranking)
- `trendScore` - 0-100 (for trending ranking)
- `isHot`, `isTrending`, `isViral` - Boolean flags
- `verificationStatus` - For viral claims: "Fake", "Likely True", "Needs Context"

**Example:**
```javascript
{
  title: "Global Energy Prices",
  slug: "global-energy-prices",
  description: "Price volatility and policy shifts...",
  content: JSON.stringify({
    body: [
      { text: "Energy reports show...", status: "verified" },
      { text: "Some outlets claim...", status: "disputed" }
    ],
    analysis: { confidence: "Medium", confidenceScore: 73, ... },
    sourceComparison: [...]
  }),
  isHot: true,
  isTrending: true,
  impactScore: 92,
  trendScore: 81
}
```

### Simulator Scenarios

Each scenario contains:
- `title` - Scenario name
- `description` - Brief description
- `context` - Background story
- `targetTopic` - Topic category (fuel_prices, healthcare, election, etc.)
- `difficulty` - "easy", "medium", or "hard"

**Example:**
```javascript
{
  title: 'Fuel Price Crisis',
  description: 'Create a viral narrative about fuel price hike',
  context: 'Fuel prices have increased by 5%...',
  targetTopic: 'fuel_prices',
  difficulty: 'easy'
}
```

### Detection Challenges

Each challenge contains:
- `title` - Challenge name
- `content` - Fake news content to analyze
- `correctTactics` - Array of manipulation tactics used
- `explanation` - Why it's misleading
- `difficulty` - "easy", "medium", or "hard"
- `category` - Topic category

**Example:**
```javascript
{
  title: 'Fuel Price Panic Post',
  content: '🚨 BREAKING: Fuel prices to TRIPLE...',
  correctTactics: ['fear_mongering', 'false_urgency', 'exaggeration'],
  explanation: 'Uses fear and urgency to manipulate...',
  difficulty: 'easy',
  category: 'economy'
}
```

## Resetting Data

To clear and reseed the database:

```bash
cd backend

# Clear specific table (example using Prisma Studio or raw SQL)
npx prisma studio  # Manual deletion through UI

# Reseed
npm run seed:all
```

**Warning:** This will delete all existing data in the affected tables.

## Custom Seeding

### Adding New News Articles

1. Edit `backend/src/seeds/newsSeed.js`
2. Add new article object to `newsData` array
3. Run `npm run seed:news`

**Template:**
```javascript
{
  title: "Your Article Title",
  slug: "your-article-slug",
  description: "Brief summary",
  content: JSON.stringify({
    body: [
      { text: "Paragraph 1", status: "verified|disputed|normal" }
    ],
    analysis: {
      confidence: "High|Medium|Low",
      confidenceScore: 75,
      sourcesAnalyzed: 10
    },
    sourceComparison: []
  }),
  isHot: false,
  isTrending: true,
  source: "Source Name",
  imageUrl: "https://...",
  category: "politics|health|technology|economy|environment",
  impactScore: 85,
  trendScore: 78
}
```

### Adding New Scenarios

1. Edit `backend/src/seeds/simulatorSeed.js`
2. Add new scenario to `scenarios` array in `seedScenarios()`
3. Run `npm run seed:simulator`

### Adding New Detection Challenges

1. Edit `backend/src/seeds/simulatorSeed.js`
2. Add new challenge to `challenges` array in `seedDetectionChallenges()`
3. Run `npm run seed:simulator`

## Verification

After seeding, verify data was created:

```bash
# View data in Prisma Studio
npm run prisma:studio

# Or check via API
curl http://localhost:3000/api/news/trending
curl http://localhost:3000/api/simulator/scenarios
curl http://localhost:3000/api/simulator/detection/challenges
```

## Troubleshooting

### Error: Database Connection Failed
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database exists

### Error: Table doesn't exist
- Run `npm run prisma:push` to sync schema
- Or run `npm run prisma:migrate`

### Error: Unique constraint violation
- Data already exists with the same slug/ID
- Clear database or modify seed data to use unique identifiers

### Seed script hangs
- Check for database locks
- Ensure previous seed process completed
- Restart PostgreSQL if needed

## Production Seeding

For production deployment:

1. **Don't run seed scripts** - Production data should come from real sources
2. **Manual data entry** - Use admin APIs to create content
3. **Data migration** - If needed, copy from staging to production
4. **Backup first** - Always backup before any data operations

## Seed Data Maintenance

- Review seed data periodically
- Update content to reflect current topics
- Add new scenarios as misinformation tactics evolve
- Keep verification statuses updated
- Maintain consistent data quality

## Related Documentation

- [Database Schema](../prisma/schema.prisma)
- [API Testing Routes](../TESTING_ROUTES.md)
- [Integration Guide](../../INTEGRATION_GUIDE.md)
- [Backend Architecture](../TECHNICAL_ARCHITECTURE.md)
