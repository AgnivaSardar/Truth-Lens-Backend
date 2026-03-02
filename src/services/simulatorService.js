/**
 * Simulator Service - Branching Narrative Game Management
 * Handles database operations for decision-tree based misinformationgame
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const simulationEngine = require('./simulationEngine');

class SimulatorService {
  /**
   * Get all active scenarios
   */
  async getScenarios(difficulty = null, limit = 20) {
    const where = { isActive: true };
    if (difficulty) {
      where.difficulty = difficulty;
    }

    return await prisma.scenario.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get scenario by ID with its root node
   */
  async getScenarioById(id) {
    return await prisma.scenario.findUnique({
      where: { id },
      include: {
        decisionNodes: {
          where: { isRoot: true },
          include: {
            options: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  /**
   * Start a new simulation game
   */
  async startGame(scenarioId, userId = null) {
    // Get scenario with root node
    const scenario = await this.getScenarioById(scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }

    const rootNode = scenario.decisionNodes.find(n => n.isRoot);
    if (!rootNode) {
      throw new Error('Scenario has no starting point configured');
    }

    // Create new game
    const game = await prisma.simulationGame.create({
      data: {
        scenarioId,
        userId,
        currentNodeId: rootNode.id,
        pathTaken: [],
        phase: 'playing',
        engagementScore: 20,
        viralityScore: 15,
        outrageScore: 10,
        credibilityScore: 50,
      },
    });

    // Return game with current decision point
    return {
      game,
      currentNode: {
        id: rootNode.id,
        stepNumber: rootNode.stepNumber,
        question: rootNode.question,
        description: rootNode.description,
        options: rootNode.options.map(opt => ({
          id: opt.id,
          text: opt.optionText,
          order: opt.order,
        })),
      },
      scenario: {
        id: scenario.id,
        title: scenario.title,
        description: scenario.description,
        context: scenario.context,
        difficulty: scenario.difficulty,
      },
    };
  }

  /**
   * Make a choice and move to the next decision point
   */
  async makeChoice(gameId, optionId) {
    // Get current game state
    const game = await prisma.simulationGame.findUnique({
      where: { id: gameId },
      include: {
        scenario: true,
        choices: {
          include:{ option: true },
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    if (!game) {
      throw new Error('Game not found');
    }

    if (game.phase !== 'playing') {
      throw new Error('Game is no longer active');
    }

    // Get the chosen option
    const option = await prisma.decisionOption.findUnique({
      where: { id: optionId },
      include: {
        node: true,
        nextNode: {
          include: {
            options: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!option) {
      throw new Error('Invalid choice');
    }

    // Verify option belongs to current node
    if (option.nodeId !== game.currentNodeId) {
      throw new Error('Choice does not match current decision point');
    }

    // Update metrics based on choice
    const newEngagement = game.engagementScore + option.engagementDelta;
    const newVirality = game.viralityScore + option.viralityDelta;
    const newOutrage = game.outrageScore + option.ourageDelta;
    const newCredibility = game.credibilityScore + option.credibilityDelta;

    // Normalize to 0-100 range
    const metrics = {
      engagementScore: Math.max(0, Math.min(100, newEngagement)),
      viralityScore: Math.max(0, Math.min(100, newVirality)),
      outrageScore: Math.max(0, Math.min(100, newOutrage)),
      credibilityScore: Math.max(0, Math.min(100, newCredibility)),
    };

    // Save the choice
    const stepNumber = game.choices.length + 1;
    await prisma.gameChoice.create({
      data: {
        gameId,
        optionId,
        stepNumber,
      },
    });

    // Update path taken
    const pathTaken = game.pathTaken || [];
    pathTaken.push(optionId);

    // Check if this is a leaf node (game end)
    const isEnd = !option.nextNodeId || option.nextNode?.isLeaf;

    if (isEnd) {
      // Generate final news article
      const allChoices = await prisma.gameChoice.findMany({
        where: { gameId },
        include: { option: true },
        orderBy: { stepNumber: 'asc' },
      });

      const generatedNews = simulationEngine.generateNews(
        game.scenario,
        allChoices,
        metrics
      );

      const tactics = simulationEngine.analyzeTactics(allChoices);
      const realWorldExamples = simulationEngine.getRealWorldExamples(tactics, game.scenario);
      const consequences = simulationEngine.generateConsequences(metrics, tactics);
      const score = simulationEngine.calculateScore(metrics, tactics, game.scenario.difficulty);

      // Complete the game
      await prisma.simulationGame.update({
        where: { id: gameId },
        data: {
          ...metrics,
          pathTaken,
          phase: 'completed',
          generatedHeadline: generatedNews.headline,
          generatedContent: generatedNews.content,
          tacticsSummary: tactics,
          triggersUsed: tactics,
          realWorldExamples,
          consequences,
          score,
          completedAt: new Date(),
        },
      });

      return {
        gameComplete: true,
        finalResults: {
          headline: generatedNews.headline,
          content: generatedNews.content,
          metrics,
          tacticsUsed: tactics,
          realWorldExamples,
          consequences,
          score,
        },
      };
    }

    // Move to next node
    await prisma.simulationGame.update({
      where: { id: gameId },
      data: {
        ...metrics,
        pathTaken,
        currentNodeId: option.nextNodeId,
      },
    });

    return {
      gameComplete: false,
      currentMetrics: metrics,
      tacticUsed: {
        name: option.tacticUsed,
        explanation: option.explanation,
      },
      nextNode: {
        id: option.nextNode.id,
        stepNumber: option.nextNode.stepNumber,
        question: option.nextNode.question,
        description: option.nextNode.description,
        options: option.nextNode.options.map(opt => ({
          id: opt.id,
          text: opt.optionText,
          order: opt.order,
        })),
      },
    };
  }

  /**
   * Get game by ID with full details
   */
  async getGame(gameId) {
    const game = await prisma.simulationGame.findUnique({
      where: { id: gameId },
      include: {
        scenario: true,
        choices: {
          include: {
            option: {
              include: {
                node: true,
              },
            },
          },
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    if (!game) {
      return null;
    }

    // If game is in progress, include current node
    let currentNode = null;
    if (game.phase === 'playing' && game.currentNodeId) {
      currentNode = await prisma.decisionNode.findUnique({
        where: { id: game.currentNodeId },
        include: {
          options: {
            orderBy: { order: 'asc' },
          },
        },
      });
    }

    return {
      ...game,
      currentNode: currentNode ? {
        id: currentNode.id,
        stepNumber: currentNode.stepNumber,
        question: currentNode.question,
        description: currentNode.description,
        options: currentNode.options.map(opt => ({
          id: opt.id,
          text: opt.optionText,
          order: opt.order,
        })),
      } : null,
    };
  }

  /**
   * Get user's game history
   */
  async getUserGames(userId, limit = 10) {
    return await prisma.simulationGame.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        scenario: {
          select: {
            title: true,
            difficulty: true,
          },
        },
      },
    });
  }

  /**
   * Get leaderboard (top scores)
   */
  async getLeaderboard(limit = 10) {
    return await prisma.simulationGame.findMany({
      where: {
        phase: 'completed',
        userId: { not: null },
      },
      take: limit,
      orderBy: { score: 'desc' },
      select: {
        id: true,
        userId: true,
        score: true,
        viralityScore: true,
        engagementScore: true,
        completedAt: true,
        scenario: {
          select: {
            title: true,
            difficulty: true,
          },
        },
      },
    });
  }

  /**
   * Get statistics for user
   */
  async getUserStats(userId) {
    // Game stats
    const gamesPlayed = await prisma.simulationGame.count({
      where: { userId, phase: 'completed' },
    });

    const avgGameScore = await prisma.simulationGame.aggregate({
      where: { userId, phase: 'completed' },
      _avg: { score: true },
    });

    const highestGameScore = await prisma.simulationGame.aggregate({
      where: { userId, phase: 'completed' },
      _max: { score: true },
    });

    // Detection stats (keep for backward compatibility)
    const detectionsAttempted = await prisma.detectionAttempt.count({
      where: { userId, completed: true },
    });

    const avgDetectionScore = await prisma.detectionAttempt.aggregate({
      where: { userId, completed: true },
      _avg: { score: true, accuracy: true },
    });

    return {
      gamesPlayed,
      avgGameScore: avgGameScore._avg.score || 0,
      highestGameScore: highestGameScore._max.score || 0,
      detectionsAttempted,
      avgDetectionScore: avgDetectionScore._avg.score || 0,
      avgDetectionAccuracy: avgDetectionScore._avg.accuracy || 0,
    };
  }

  // === Detection Challenge methods (unchanged) ===

  async getDetectionChallenges(difficulty = null, category = null, limit = 20) {
    const where = { isActive: true };
    if (difficulty) where.difficulty = difficulty;
    if (category) where.category = category;

    return await prisma.detectionChallenge.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        difficulty: true,
        category: true,
        realExample: true,
        createdAt: true,
      },
    });
  }

  async getDetectionChallenge(id) {
    return await prisma.detectionChallenge.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        difficulty: true,
        category: true,
        realExample: true,
      },
    });
  }

  async submitDetection(challengeId, identifiedTactics, userId = null, timeSpent = null) {
    const challenge = await prisma.detectionChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new Error('Challenge not found');
    }

    const correctTactics = challenge.correctTactics;
    const totalTactics = correctTactics.length;

    const correctIdentified = identifiedTactics.filter((tactic) =>
      correctTactics.includes(tactic)
    );
    const correctCount = correctIdentified.length;
    const accuracy = totalTactics > 0 ? (correctCount / totalTactics) * 100 : 0;

    let score = accuracy;

    if (timeSpent && timeSpent < 60) {
      score += (60 - timeSpent) * 0.2;
    }

    const falsePositives = identifiedTactics.filter(
      (tactic) => !correctTactics.includes(tactic)
    );
    score -= falsePositives.length * 5;

    score = Math.max(0, Math.min(100, Math.round(score)));

    const attempt = await prisma.detectionAttempt.create({
      data: {
        challengeId,
        userId,
        identifiedTactics,
        correctCount,
        totalTactics,
        accuracy,
        timeSpent,
        score,
        completed: true,
      },
    });

    return {
      attempt,
      correctTactics,
      missed: correctTactics.filter((tactic) => !identifiedTactics.includes(tactic)),
      falsePositives,
      explanation: challenge.explanation,
      userScore: score,
      accuracy,
    };
  }

  async getUserDetectionHistory(userId, limit = 10) {
    return await prisma.detectionAttempt.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        challenge: {
          select: {
            title: true,
            difficulty: true,
            category: true,
          },
        },
      },
    });
  }
}

module.exports = new SimulatorService();
