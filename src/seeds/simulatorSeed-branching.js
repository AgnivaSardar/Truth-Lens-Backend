/**
 * Seed Data for Branching Narrative Misinformation Simulator
 * Creates decision trees with binary choices leading to different fake news outcomes
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  __internal: {
    engine: {}
  }
});

async function seedFuelPriceScenario() {
  console.log('Creating Fuel Price Crisis decision tree...');

  // Create scenario
  const scenario = await prisma.scenario.create({
    data: {
      title: 'Fuel Price Crisis',
      description: 'Navigate choices that create viral misinformation about a fuel price increase',
      context: 'Fuel prices have increased by 5% this week. Each choice you make will shape how your fake news story develops.',
      targetTopic: 'fuel_prices',
      difficulty: 'easy',
      isActive: true,
    },
  });

  // Step 1: Root node - Framing choice
  const step1 = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 1,
      question: 'Fuel prices increased 5%. How do you frame this story?',
      description: 'Your first decision sets the narrative tone',
      isRoot: true,
      isLeaf: false,
    },
  });

  // Step 1 Options
  const step1OptionA = await prisma.decisionOption.create({
    data: {
      nodeId: step1.id,
      optionText: 'Frame it as government conspiracy and corruption',
      explanation: 'Blame hidden powers and secret agendas',
      tacticUsed: 'conspiracy_framing',
      engagementDelta: 15,
      viralityDelta: 20,
      ourageDelta: 25,
      credibilityDelta: -20,
      order: 1,
    },
  });

  const step1OptionB = await prisma.decisionOption.create({
    data: {
      nodeId: step1.id,
      optionText: 'Focus on emotional family budget impact',
      explanation: 'Use personal stories to generate sympathy',
      tacticUsed: 'emotional_anecdote',
      engagementDelta: 20,
      viralityDelta: 15,
      ourageDelta: 15,
      credibilityDelta: -10,
      order: 2,
    },
  });

  // Step 2A: Conspiracy path
  const step2A = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 2,
      question: 'How do you add urgency to the conspiracy angle?',
      description: 'Amplify the narrative with time pressure or false data',
      isRoot: false,
      isLeaf: false,
    },
  });

  await prisma.decisionOption.update({
    where: { id: step1OptionA.id },
    data: { nextNodeId: step2A.id },
  });

  const step2AOptionA = await prisma.decisionOption.create({
    data: {
      nodeId: step2A.id,
      optionText: 'Claim prices will TRIPLE by next month',
      explanation: 'Create false urgency with exaggerated predictions',
      tacticUsed: 'false_urgency',
      engagementDelta: 18,
      viralityDelta: 25,
      ourageDelta: 20,
      credibilityDelta: -25,
      order: 1,
    },
  });

  const step2AOptionB = await prisma.decisionOption.create({
    data: {
      nodeId: step2A.id,
      optionText: 'Use misleading statistics and graphs',
      explanation: 'Present data out of context to support your narrative',
      tacticUsed: 'misleading_statistics',
      engagementDelta: 12,
      viralityDelta: 15,
      ourageDelta: 15,
      credibilityDelta: -15,
      order: 2,
    },
  });

  // Step 3A-A: Conspiracy + Urgency (leaf)
  const step3AA = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 3,
      question: 'Final touch: Add fear or authority?',
      description: 'Complete your fake news story',
      isRoot: false,
      isLeaf: true,
    },
  });

  await prisma.decisionOption.update({
    where: { id: step2AOptionA.id },
    data: { nextNodeId: step3AA.id },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3AA.id,
      optionText: 'Use fear mongering about economic collapse',
      explanation: 'Paint a catastrophic picture',
      tacticUsed: 'fear_mongering',
      engagementDelta: 20,
      viralityDelta: 30,
      ourageDelta: 30,
      credibilityDelta: -30,
      order: 1,
    },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3AA.id,
      optionText: 'Quote unnamed "industry insiders"',
      explanation: 'Add false credibility with fake experts',
      tacticUsed: 'false_authority',
      engagementDelta: 15,
      viralityDelta: 20,
      ourageDelta: 15,
      credibilityDelta: -20,
      order: 2,
    },
  });

  // Step 3A-B: Conspiracy + Statistics (leaf)
  const step3AB = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 3,
      question: 'How do you make the statistics more viral?',
      description: 'Push your narrative to maximum spread',
      isRoot: false,
      isLeaf: true,
    },
  });

  await prisma.decisionOption.update({
    where: { id: step2AOptionB.id },
    data: { nextNodeId: step3AB.id },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3AB.id,
      optionText: 'Add dramatic imagery of suffering',
      explanation: 'Emotional visuals amplify impact',
      tacticUsed: 'dramatic_imagery',
      engagementDelta: 18,
      viralityDelta: 25,
      ourageDelta: 20,
      credibilityDelta: -10,
      order: 1,
    },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3AB.id,
      optionText: 'Create "us vs them" division',
      explanation: 'Pit groups against each other',
      tacticUsed: 'us_vs_them',
      engagementDelta: 16,
      viralityDelta: 22,
      ourageDelta: 25,
      credibilityDelta: -15,
      order: 2,
    },
  });

  // Step 2B: Emotional path
  const step2B = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 2,
      question: 'How do you amplify the emotional impact?',
      description: 'Make the story more shareable',
      isRoot: false,
      isLeaf: false,
    },
  });

  await prisma.decisionOption.update({
    where: { id: step1OptionB.id },
    data: { nextNodeId: step2B.id },
  });

  const step2BOptionA = await prisma.decisionOption.create({
    data: {
      nodeId: step2B.id,
      optionText: 'Use extreme exaggeration of impact',
      explanation: 'Turn a minor issue into a crisis',
      tacticUsed: 'exaggeration',
      engagementDelta: 15,
      viralityDelta: 18,
      ourageDelta: 18,
      credibilityDelta: -18,
      order: 1,
    },
  });

  const step2BOptionB = await prisma.decisionOption.create({
    data: {
      nodeId: step2B.id,
      optionText: 'Add selective facts that support fear',
      explanation: 'Cherry-pick data to build your case',
      tacticUsed: 'selective_facts',
      engagementDelta: 12,
      viralityDelta: 15,
      ourageDelta: 12,
      credibilityDelta: -12,
      order: 2,
    },
  });

  // Step 3B-A: Emotional + Exaggeration (leaf)
  const step3BA = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 3,
      question: 'Final step: Headline style?',
      description: 'Complete your fake news article',
      isRoot: false,
      isLeaf: true,
    },
  });

  await prisma.decisionOption.update({
    where: { id: step2BOptionA.id },
    data: { nextNodeId: step3BA.id },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3BA.id,
      optionText: 'Sensational clickbait headline',
      explanation: 'Grab attention with shocking words',
      tacticUsed: 'clickbait_headline',
      engagementDelta: 22,
      viralityDelta: 28,
      ourageDelta: 10,
      credibilityDelta: -8,
      order: 1,
    },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3BA.id,
      optionText: 'Emotional language throughout',
      explanation: 'Use charged words to trigger reactions',
      tacticUsed: 'emotional_language',
      engagementDelta: 18,
      viralityDelta: 20,
      ourageDelta: 15,
      credibilityDelta: -10,
      order: 2,
    },
  });

  // Step 3B-B: Emotional + Selective Facts (leaf)
  const step3BB = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 3,
      question: 'How do you present your "evidence"?',
      description: 'Make your fake news seem credible',
      isRoot: false,
      isLeaf: true,
    },
  });

  await prisma.decisionOption.update({
    where: { id: step2BOptionB.id },
    data: { nextNodeId: step3BB.id },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3BB.id,
      optionText: 'Mix real facts with false conclusions',
      explanation: 'Use truth to sell lies',
      tacticUsed: 'misleading_statistics',
      engagementDelta: 14,
      viralityDelta: 18,
      ourageDelta: 12,
      credibilityDelta: -8,
      order: 1,
    },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3BB.id,
      optionText: 'Add false urgency call-to-action',
      explanation: 'Make people act before thinking',
      tacticUsed: 'false_urgency',
      engagementDelta: 16,
      viralityDelta: 20,
      ourageDelta: 15,
      credibilityDelta: -12,
      order: 2,
    },
  });

  console.log('✓ Fuel Price Crisis decision tree created with 8 possible outcomes');
  return scenario;
}

async function seedHealthcareScenario() {
  console.log('\nCreating Healthcare Reform decision tree...');

  const scenario = await prisma.scenario.create({
    data: {
      title: 'Healthcare Reform Controversy',
      description: 'Make strategic choices to create viral healthcare misinformation',
      context: 'A new healthcare bill is being debated. Navigate the decision tree to see how misinformation spreads.',
      targetTopic: 'healthcare',
      difficulty: 'medium',
      isActive: true,
    },
  });

  // Step 1: Root
  const step1 = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 1,
      question: 'A healthcare bill is proposed. What angle do you take?',
      description: 'Choose your initial narrative strategy',
      isRoot: true,
      isLeaf: false,
    },
  });

  const step1OptionA = await prisma.decisionOption.create({
    data: {
      nodeId: step1.id,
      optionText: 'Claim it threatens your access to doctors',
      explanation: 'Use fear of losing healthcare freedom',
      tacticUsed: 'fear_mongering',
      engagementDelta: 18,
      viralityDelta: 22,
      ourageDelta: 20,
      credibilityDelta: -18,
      order: 1,
    },
  });

  const step1OptionB = await prisma.decisionOption.create({
    data: {
      nodeId: step1.id,
      optionText: 'Frame it as corporate conspiracy',
      explanation: 'Suggest hidden profit motives',
      tacticUsed: 'conspiracy_framing',
      engagementDelta: 16,
      viralityDelta: 25,
      ourageDelta: 22,
      credibilityDelta: -22,
      order: 2,
    },
  });

  // Step 2A: Fear path
  const step2A = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 2,
      question: 'How do you escalate the fear?',
      description: 'Deepen the emotional response',
      isRoot: false,
      isLeaf: false,
    },
  });

  await prisma.decisionOption.update({
    where: { id: step1OptionA.id },
    data: { nextNodeId: step2A.id },
  });

  const step2AOptionA = await prisma.decisionOption.create({
    data: {
      nodeId: step2A.id,
      optionText: 'Share fake patient horror stories',
      explanation: 'Emotional anecdotes override logic',
      tacticUsed: 'emotional_anecdote',
      engagementDelta: 20,
      viralityDelta: 18,
      ourageDelta: 18,
      credibilityDelta: -15,
      order: 1,
    },
  });

  const step2AOptionB = await prisma.decisionOption.create({
    data: {
      nodeId: step2A.id,
      optionText: 'Use misleading cost statistics',
      explanation: 'Present numbers without context',
      tacticUsed: 'misleading_statistics',
      engagementDelta: 14,
      viralityDelta: 16,
      ourageDelta: 14,
      credibilityDelta: -12,
      order: 2,
    },
  });

  // Step 3A-A (leaf)
  const step3AA = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 3,
      question: 'Final push for maximum virality?',
      description: 'Complete the fake news narrative',
      isRoot: false,
      isLeaf: true,
    },
  });

  await prisma.decisionOption.update({
    where: { id: step2AOptionA.id },
    data: { nextNodeId: step3AA.id },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3AA.id,
      optionText: 'Add "us vs them" political division',
      explanation: 'Make it partisan for more shares',
      tacticUsed: 'us_vs_them',
      engagementDelta: 18,
      viralityDelta: 25,
      ourageDelta: 28,
      credibilityDelta: -15,
      order: 1,
    },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3AA.id,
      optionText: 'Quote fake medical "experts"',
      explanation: 'False authority boosts credibility',
      tacticUsed: 'false_authority',
      engagementDelta: 15,
      viralityDelta: 18,
      ourageDelta: 12,
      credibilityDelta: -10,
      order: 2,
    },
  });

  // Step 3A-B (leaf)
  const step3AB = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 3,
      question: 'How to make statistics go viral?',
      description: 'Choose your final manipulation tactic',
      isRoot: false,
      isLeaf: true,
    },
  });

  await prisma.decisionOption.update({
    where: { id: step2AOptionB.id },
    data: { nextNodeId: step3AB.id },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3AB.id,
      optionText: 'Exaggerate costs to extreme levels',
      explanation: 'Turn manageable into catastrophic',
      tacticUsed: 'exaggeration',
      engagementDelta: 16,
      viralityDelta: 20,
      ourageDelta: 20,
      credibilityDelta: -18,
      order: 1,
    },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3AB.id,
      optionText: 'Create false sense of urgency',
      explanation: 'Act now or lose everything',
      tacticUsed: 'false_urgency',
      engagementDelta: 14,
      viralityDelta: 18,
      ourageDelta: 16,
      credibilityDelta: -14,
      order: 2,
    },
  });

  // Step 2B: Conspiracy path
  const step2B = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 2,
      question: 'How do you deepen the conspiracy narrative?',
      description: 'Build distrust in institutions',
      isRoot: false,
      isLeaf: false,
    },
  });

  await prisma.decisionOption.update({
    where: { id: step1OptionB.id },
    data: { nextNodeId: step2B.id },
  });

  const step2BOptionA = await prisma.decisionOption.create({
    data: {
      nodeId: step2B.id,
      optionText: 'Claim "leaked documents" prove corruption',
      explanation: 'Fake evidence for fake claims',
      tacticUsed: 'false_authority',
      engagementDelta: 17,
      viralityDelta: 24,
      ourageDelta: 25,
      credibilityDelta: -20,
      order: 1,
    },
  });

  const step2BOptionB = await prisma.decisionOption.create({
    data: {
      nodeId: step2B.id,
      optionText: 'Cherry-pick facts to support theory',
      explanation: 'Ignore contradicting evidence',
      tacticUsed: 'selective_facts',
      engagementDelta: 14,
      viralityDelta: 18,
      ourageDelta: 18,
      credibilityDelta: -16,
      order: 2,
    },
  });

  // Step 3B-A (leaf)
  const step3BA = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 3,
      question: 'Final conspiracy element?',
      description: 'Seal the narrative',
      isRoot: false,
      isLeaf: true,
    },
  });

  await prisma.decisionOption.update({
    where: { id: step2BOptionA.id },
    data: { nextNodeId: step3BA.id },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3BA.id,
      optionText: 'Call for "sharing before censorship"',
      explanation: 'Urgency + conspiracy validation',
      tacticUsed: 'false_urgency',
      engagementDelta: 20,
      viralityDelta: 30,
      ourageDelta: 22,
      credibilityDelta: -25,
      order: 1,
    },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3BA.id,
      optionText: 'Add emotional patient testimonial',
      explanation: 'Humanize the conspiracy',
      tacticUsed: 'emotional_anecdote',
      engagementDelta: 18,
      viralityDelta: 22,
      ourageDelta: 18,
      credibilityDelta: -15,
      order: 2,
    },
  });

  // Step 3B-B (leaf)
  const step3BB = await prisma.decisionNode.create({
    data: {
      scenarioId: scenario.id,
      stepNumber: 3,
      question: 'How to present your cherry-picked facts?',
      description: 'Final narrative touch',
      isRoot: false,
      isLeaf: true,
    },
  });

  await prisma.decisionOption.update({
    where: { id: step2BOptionB.id },
    data: { nextNodeId: step3BB.id },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3BB.id,
      optionText: 'Use dramatic imagery of "victims"',
      explanation: 'Visual emotion amplifies message',
      tacticUsed: 'dramatic_imagery',
      engagementDelta: 16,
      viralityDelta: 22,
      ourageDelta: 18,
      credibilityDelta: -12,
      order: 1,
    },
  });

  await prisma.decisionOption.create({
    data: {
      nodeId: step3BB.id,
      optionText: 'Create divisive "us vs them" framing',
      explanation: 'Polarization increases engagement',
      tacticUsed: 'us_vs_them',
      engagementDelta: 15,
      viralityDelta: 20,
      ourageDelta: 22,
      credibilityDelta: -14,
      order: 2,
    },
  });

  console.log('✓ Healthcare Reform decision tree created with 8 possible outcomes');
  return scenario;
}

async function seedDetectionChallenges() {
  console.log('\nSeeding detection challenges...');

  const challenges = [
    {
      title: 'Fuel Price Panic Post',
      content:
        '🚨 BREAKING: Fuel prices to TRIPLE by next month! Government hiding the TRUTH from you! They don\'t want you to know about the SECRET oil shortage. Share before they DELETE this! #FuelCrisis #WakeUp #Truth',
      correctTactics: [
        'fear_mongering',
        'conspiracy_framing',
        'false_urgency',
        'exaggeration',
        'clickbait_headline',
      ],
      difficulty: 'easy',
      explanation:
        'This post uses multiple manipulation tactics: fear mongering (TRIPLE), conspiracy framing (hiding TRUTH, SECRET), false urgency (share before DELETE), exaggeration (TRIPLE prices), and clickbait style.',
      realExample: true,
      category: 'economy',
    },
    {
      title: 'Healthcare "Expert" Warning',
      content:
        'Dr. Anonymous, a healthcare insider, reveals that the new bill will deny treatment to 90% of patients. Insurance companies PROFIT while you SUFFER. Wake up, America! The mainstream media won\'t cover this.',
      correctTactics: [
        'false_authority',
        'misleading_statistics',
        'emotional_language',
        'conspiracy_framing',
        'us_vs_them',
      ],
      difficulty: 'medium',
      explanation:
        'Uses false authority (unnamed "Dr. Anonymous"), misleading statistics (90% without context), emotional language (PROFIT, SUFFER), conspiracy framing (media won\'t cover), and us vs them (you vs insurance companies).',
      realExample: true,
      category: 'health',
    },
    {
      title: 'Election Integrity Post',
      content:
        'BOMBSHELL: Anonymous sources confirm systematic voting machine manipulation in swing states. 200,000+ votes flipped. #StopTheSteal. Patriots must investigate NOW before evidence is destroyed!',
      correctTactics: [
        'conspiracy_framing',
        'false_authority',
        'misleading_statistics',
        'false_urgency',
        'emotional_language',
      ],
      difficulty: 'hard',
      explanation:
        'Combines conspiracy framing (systematic manipulation), false authority (anonymous sources), misleading statistics (200,000 without verification), false urgency (before evidence destroyed), and emotional language (BOMBSHELL, Patriots).',
      realExample: true,
      category: 'politics',
    },
  ];

  for (const challenge of challenges) {
    await prisma.detectionChallenge.create({
      data: challenge,
    });
    console.log(`✓ Created detection challenge: ${challenge.title}`);
  }
}

async function main() {
  try {
    console.log('🌱 Starting seed process for branching narrative simulator...\n');

    // Clear existing data
    console.log('Cleaning existing data...');
    await prisma.gameChoice.deleteMany({});
    await prisma.simulationGame.deleteMany({});
    await prisma.decisionOption.deleteMany({});
    await prisma.decisionNode.deleteMany({});
    await prisma.detectionAttempt.deleteMany({});
    await prisma.detectionChallenge.deleteMany({});
    await prisma.scenario.deleteMany({});
    console.log('✓ Database cleaned\n');

    // Seed scenarios with decision trees
    await seedFuelPriceScenario();
    await seedHealthcareScenario();

    // Seed detection challenges
    await seedDetectionChallenges();

    console.log('\n✅ Seed completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Start a game with one of the scenarios');
    console.log('2. Make binary choices at each step');
    console.log('3. See different fake news articles based on your path');
    console.log('4. Try detection challenges to identify manipulation tactics\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
