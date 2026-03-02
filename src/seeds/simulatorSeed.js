/**
 * Seed Data for Misinformation Simulator
 * Run this script to populate initial scenarios and detection challenges
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedScenarios() {
  console.log('Seeding scenarios...');

  const scenarios = [
    {
      title: 'Fuel Price Crisis',
      description: 'Create a viral narrative about fuel price hike',
      context:
        'Fuel prices have increased by 5% this week. Your goal is to create misinformation that exaggerates this situation and spreads panic.',
      targetTopic: 'fuel_prices',
      difficulty: 'easy',
    },
    {
      title: 'Healthcare Reform Controversy',
      description: 'Spin a healthcare policy change to create outrage',
      context:
        'A new healthcare bill is being proposed. Create misleading content about its implications to sway public opinion.',
      targetTopic: 'healthcare',
      difficulty: 'medium',
    },
    {
      title: 'Election Interference',
      description: 'Create false narratives about election integrity',
      context:
        'Elections are approaching. Your task is to create misinformation that questions the legitimacy of the voting process.',
      targetTopic: 'election',
      difficulty: 'hard',
    },
    {
      title: 'Climate Change Denial',
      description: 'Spread doubt about climate science',
      context:
        'A major climate report was just released. Create content that dismisses scientific consensus and creates confusion.',
      targetTopic: 'climate',
      difficulty: 'medium',
    },
    {
      title: 'Vaccine Hesitancy Campaign',
      description: 'Generate fear around vaccination programs',
      context:
        'A new vaccine is being rolled out. Create misinformation to increase hesitancy and discourage uptake.',
      targetTopic: 'health',
      difficulty: 'hard',
    },
    {
      title: 'Economic Crash Panic',
      description: 'Create false alarm about economic collapse',
      context:
        'Stock market had a minor dip. Turn this into a panic-inducing narrative about imminent economic disaster.',
      targetTopic: 'economy',
      difficulty: 'medium',
    },
    {
      title: 'Celebrity Scandal Fabrication',
      description: 'Create a viral celebrity scandal from nothing',
      context:
        'A famous celebrity is having a normal day. Create a completely fabricated scandal that will go viral.',
      targetTopic: 'entertainment',
      difficulty: 'easy',
    },
    {
      title: 'Technology Conspiracy',
      description: 'Spread conspiracy theories about tech companies',
      context:
        'A tech company launched a new product. Create conspiracy theories about hidden surveillance and control.',
      targetTopic: 'technology',
      difficulty: 'medium',
    },
  ];

  const createdScenarios = [];
  for (const scenario of scenarios) {
    const created = await prisma.scenario.create({
      data: scenario,
    });
    createdScenarios.push(created);
    console.log(`✓ Created scenario: ${scenario.title}`);
  }

  return createdScenarios;
}

async function seedDetectionChallenges() {
  console.log('\nSeeding detection challenges...');

  const challenges = [
    {
      title: 'Fuel Price Panic Post',
      content:
        '🚨 BREAKING: Fuel prices to TRIPLE by next month! Government hiding the TRUTH from you! They don\'t want you to know about the SECRET oil shortage. Share before they DELETE this! #FuelCrisis #WakeUp #Truth',
      correctTactics: [
        'fear',
        'urgency',
        'conspiracy_framing',
        'exaggeration',
        'false_urgency',
      ],
      difficulty: 'easy',
      explanation:
        'This post uses fear-mongering (TRIPLE prices), false urgency (share before they DELETE), conspiracy framing (TRUTH, SECRET), and exaggeration (no evidence of tripling prices). These tactics bypass critical thinking by triggering emotional responses.',
      realExample: true,
      category: 'political',
    },
    {
      title: 'Healthcare Misinformation',
      content:
        'The new healthcare bill will FORCE everyone to give up their family doctors and use government-assigned physicians. This is government control over your body! They want to decide who lives and who dies. Stand up for freedom!',
      correctTactics: [
        'fear',
        'exaggeration',
        'us_vs_them',
        'misleading_interpretation',
      ],
      difficulty: 'medium',
      explanation:
        'This post misrepresents policy details, uses extreme language (lives/dies), creates an us-vs-them dynamic (government control vs. freedom), and exaggerates implications without factual basis.',
      realExample: true,
      category: 'health',
    },
    {
      title: 'Election Fraud Claims',
      content:
        'PROOF of election fraud! This video shows ballots being thrown away. Mainstream media WON\'T show you this! They want to SILENCE the truth. Repost everywhere before it gets removed! #StopTheSteal #ElectionFraud',
      correctTactics: [
        'misleading_evidence',
        'conspiracy_framing',
        'urgency',
        'media_distrust',
        'misleading_crop',
      ],
      difficulty: 'hard',
      explanation:
        'This uses decontextualized video (likely showing normal ballot disposal process), conspiracy framing (silencing truth), creates distrust in media, and uses urgency tactics. The video may be cropped to remove context that would explain the legitimate process.',
      realExample: true,
      category: 'political',
    },
    {
      title: 'Vaccine Conspiracy',
      content:
        '🚫 DO NOT get the new vaccine! It contains microchips to track you. Big Pharma and the government are working together. They already tested this on animals and ALL died. Wake up before it\'s too late! Share to save lives!',
      correctTactics: [
        'fear',
        'conspiracy_framing',
        'false_evidence',
        'urgency',
        'exaggeration',
      ],
      difficulty: 'medium',
      explanation:
        'Classic conspiracy theory combining multiple false claims (microchips, animal deaths) with fear tactics and false urgency. Uses emotional appeal to bypass fact-checking.',
      realExample: true,
      category: 'health',
    },
    {
      title: 'Climate Change Denial',
      content:
        'Scientists ADMIT climate change is a hoax! New leaked emails show they manipulated data all along. Follow the money - who profits from the "green" agenda? It\'s all about control and taxation. Don\'t be fooled!',
      correctTactics: [
        'misleading_interpretation',
        'conspiracy_framing',
        'cherry_picking',
        'false_evidence',
      ],
      difficulty: 'hard',
      explanation:
        'Misrepresents scientific disagreements as evidence of hoax, cherry-picks information, creates conspiracy narrative around financial motives, and uses fake "leaked emails" tactic to seem credible.',
      realExample: true,
      category: 'climate',
    },
    {
      title: 'Economic Panic',
      content:
        '💥 STOCK MARKET CRASH IMMINENT! Expert predicts total collapse within 48 hours. Banks are preparing for the worst. Get your money out NOW! This is not a drill. They warned us about 2008, this will be 10x worse!',
      correctTactics: ['fear', 'false_urgency', 'exaggeration', 'false_authority'],
      difficulty: 'easy',
      explanation:
        'Creates artificial urgency, uses vague "expert" authority, massively exaggerates threat, and includes specific but arbitrary timeline to seem credible.',
      realExample: false,
      category: 'political',
    },
  ];

  const createdChallenges = [];
  for (const challenge of challenges) {
    const created = await prisma.detectionChallenge.create({
      data: challenge,
    });
    createdChallenges.push(created);
    console.log(`✓ Created challenge: ${challenge.title}`);
  }

  return createdChallenges;
}

async function main() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Clear existing data (optional - comment out if you want to preserve data)
    console.log('Cleaning existing data...');
    await prisma.detectionAttempt.deleteMany();
    await prisma.detectionChallenge.deleteMany();
    await prisma.simulationChoice.deleteMany();
    await prisma.simulationGame.deleteMany();
    await prisma.scenario.deleteMany();
    console.log('✓ Cleanup complete\n');

    // Seed new data
    await seedScenarios();
    await seedDetectionChallenges();

    console.log('\n✅ Database seeded successfully!');
    console.log('\nYou can now:');
    console.log('  - Start playing games with scenarios');
    console.log('  - Try detection challenges');
    console.log('  - Test the simulator API endpoints\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { seedScenarios, seedDetectionChallenges };
