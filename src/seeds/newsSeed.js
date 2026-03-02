/**
 * News Seed Data
 * Populates initial news articles,trending topics, and viral claims
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const newsData = [
  // High Impact / Hot Topics
  {
    title: "Global Energy Prices",
    slug: "global-energy-prices",
    description: "Price volatility and policy shifts are reshaping household and industrial costs.",
    content: JSON.stringify({
      body: [
        {
          text: "Independent energy reports show a 7% decline in wholesale volatility over the last quarter.",
          status: "verified"
        },
        {
          text: "Some outlets claim consumer bills have universally dropped, but regional tariff data remains mixed.",
          status: "disputed"
        },
        {
          text: "Analysts attribute stabilization to strategic reserves, shipping normalization, and incremental demand balancing.",
          status: "normal"
        },
        {
          text: "Regulatory agencies confirmed that emergency subsidy policies are being phased gradually rather than abruptly.",
          status: "verified"
        }
      ],
      analysis: {
        confidence: "Medium",
        confidenceScore: 73,
        sourcesAnalyzed: 14,
        lastUpdated: "2026-03-02T08:30:00.000Z",
        politicalLean: 8,
        emotionalTone: 41,
        factDensity: {
          factual: 58,
          contextual: 27,
          opinion: 15
        },
        sourceReliability: [
          { source: "PolicyWire", score: 86 },
          { source: "Global Ledger", score: 78 },
          { source: "Public Brief", score: 82 },
          { source: "Open Desk", score: 69 },
          { source: "ViewPoint Now", score: 61 }
        ]
      },
      sourceComparison: [
        { source: "PolicyWire", politicalLean: "Center", reliability: 86, stance: "Supports" },
        { source: "Global Ledger", politicalLean: "Right", reliability: 78, stance: "Mixed" },
        { source: "Public Brief", politicalLean: "Center", reliability: 82, stance: "Supports" },
        { source: "Open Desk", politicalLean: "Left", reliability: 69, stance: "Mixed" },
        { source: "ViewPoint Now", politicalLean: "Right", reliability: 61, stance: "Challenges" }
      ]
    }),
    isHot: true,
    isTrending: true,
    source: "PolicyWire",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    category: "energy",
    impactScore: 92,
    trendScore: 81
  },
  {
    title: "Public Health Funding",
    slug: "public-health-funding",
    description: "Budget debates are affecting frontline infrastructure and long-term readiness.",
    content: JSON.stringify({
      body: [
        {
          text: "Public health allocations expand in preventive care but tighten in operations.",
          status: "verified"
        },
        {
          text: "Stakeholders debate the balance between infrastructure and emergency preparedness funding.",
          status: "normal"
        },
        {
          text: "Some reports show increased allocations for vaccination programs and community health centers.",
          status: "verified"
        }
      ],
      analysis: {
        confidence: "High",
        confidenceScore: 81,
        sourcesAnalyzed: 18,
        politicalLean: -4,
        emotionalTone: 35
      }
    }),
    isHot: true,
    isTrending: true,
    source: "Global Ledger",
    imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
    category: "health",
    impactScore: 88,
    trendScore: 74
  },
  {
    title: "AI Regulation Framework",
    slug: "ai-regulation-framework",
    description: "New compliance models are emerging across government and enterprise.",
    content: JSON.stringify({
      body: [
        {
          text: "Regulatory drafts require model risk documentation for high-impact deployments.",
          status: "verified"
        },
        {
          text: "Commentary claiming all open-source models will be banned is not supported by the current text.",
          status: "disputed"
        },
        {
          text: "Stakeholders are negotiating phased timelines for audits and incident disclosure.",
          status: "normal"
        }
      ],
      analysis: {
        confidence: "Medium",
        confidenceScore: 76,
        sourcesAnalyzed: 16
      }
    }),
    isHot: true,
    isTrending: true,
    source: "Public Brief",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    category: "technology",
    impactScore: 90,
    trendScore: 86
  },

  // Trending (not high impact)
  {
    title: "Election Information Integrity",
    slug: "election-information-integrity",
    description: "Cross-platform claims are being audited for source credibility and timing.",
    content: JSON.stringify({
      body: [
        {
          text: "Multiple fact-checking organizations are monitoring election-related claims across social media.",
          status: "verified"
        },
        {
          text: "Platforms have implemented new verification systems for political content.",
          status: "normal"
        }
      ]
    }),
    isHot: false,
    isTrending: true,
    source: "Open Desk",
    imageUrl: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80",
    category: "politics",
    impactScore: 85,
    trendScore: 89
  },
  {
    title: "Water Security Index",
    slug: "water-security-index",
    description: "Regional scarcity metrics are now tied directly to trade and health policy.",
    content: JSON.stringify({
      body: [
        {
          text: "New index measures water availability, quality, and access across regions.",
          status: "verified"
        },
        {
          text: "Policy makers are using this data to inform infrastructure investments.",
          status: "normal"
        }
      ]
    }),
    isHot: false,
    isTrending: true,
    source: "Global Ledger",
    imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
    category: "environment",
    impactScore: 79,
    trendScore: 77
  },

  // Viral Claims (for Fake or Not)
  {
    title: "Nationwide power prices dropped 40% in one week",
    slug: "power-prices-claim",
    description: "No verified grid or regulator dataset supports this scale of short-window decline.",
    content: JSON.stringify({
      body: [
        {
          text: "Claim circulating on social media suggests unprecedented energy price drop.",
          status: "disputed"
        },
        {
          text: "Energy regulators report no such widespread price changes in their data.",
          status: "verified"
        }
      ]
    }),
    isViral: true,
    verificationStatus: "Fake",
    source: "Truth Lens Analysis",
    category: "energy",
    isTrending: false,
    isHot: false
  },
  {
    title: "AI policy draft bans every open-source model",
    slug: "ai-ban-claim",
    description: "Current drafts focus on high-risk deployment controls, not blanket model bans.",
    content: JSON.stringify({
      body: [
        {
          text: "Viral post claims complete ban on open-source AI models.",
          status: "disputed"
        },
        {
          text: "Actual policy drafts focus on risk assessment and deployment controls for high-risk applications.",
          status: "verified"
        }
      ]
    }),
    isViral: true,
    verificationStatus: "Needs Context",
    source: "Truth Lens Analysis",
    category: "technology",
    isTrending: false,
    isHot: false
  },
  {
    title: "Preventive health funding expanded in the latest budget cycle",
    slug: "health-funding-claim",
    description: "Budget disclosures and multi-source reports indicate a measurable increase.",
    content: JSON.stringify({
      body: [
        {
          text: "Budget documents show increased allocation for preventive health programs.",
          status: "verified"
        },
        {
          text: "Multiple independent analyses confirm the expansion in funding.",
          status: "verified"
        }
      ]
    }),
    isViral: true,
    verificationStatus: "Likely True",
    source: "Truth Lens Analysis",
    category: "health",
    isTrending: false,
    isHot: false
  }
];

async function seedNews() {
  console.log('Starting news seed...');

  try {
    // Clear existing news
    await prisma.news.deleteMany({});
    console.log('Cleared existing news');

    // Create news articles
    for (const article of newsData) {
      await prisma.news.create({
        data: article
      });
      console.log(`Created: ${article.title}`);
    }

    console.log(`\n✅ Successfully seeded ${newsData.length} news articles`);
    console.log('\nBreakdown:');
    console.log(`  - High Impact: ${newsData.filter(n => n.isHot).length}`);
    console.log(`  - Trending: ${newsData.filter(n => n.isTrending).length}`);
    console.log(`  - Viral Claims: ${newsData.filter(n => n.isViral).length}`);

  } catch (error) {
    console.error('Error seeding news:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedNews()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedNews, newsData };
