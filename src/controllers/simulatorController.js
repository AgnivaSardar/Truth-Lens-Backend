/**
 * Simulator Controller - Branching Narrative Game
 * Handles HTTP requests for step-by-step misinformation simulator
 */

const simulatorService = require('../services/simulatorService');

class SimulatorController {
  /**
   * GET /api/simulator/scenarios
   * Get available scenarios
   */
  async getScenarios(req, res, next) {
    try {
      const { difficulty, limit } = req.query;
      
      const scenarios = await simulatorService.getScenarios(
        difficulty,
        limit ? parseInt(limit) : 20
      );

      res.json({
        success: true,
        data: scenarios,
        count: scenarios.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/simulator/scenarios/:id
   * Get specific scenario
   */
  async getScenario(req, res, next) {
    try {
      const { id } = req.params;
      
      const scenario = await simulatorService.getScenarioById(id);
      
      if (!scenario) {
        return res.status(404).json({
          success: false,
          error: 'Scenario not found',
        });
      }

      res.json({
        success: true,
        data: scenario,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/simulator/scenarios
   * Create new scenario (admin only)
   */
  async createScenario(req, res, next) {
    try {
      const { title, description, context, targetTopic, difficulty } = req.body;

      if (!title || !description || !context || !targetTopic) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: title, description, context, targetTopic',
        });
      }

      const scenario = await simulatorService.createScenario({
        title,
        description,
        context,
        targetTopic,
        difficulty: difficulty || 'medium',
      });

      res.status(201).json({
        success: true,
        data: scenario,
        message: 'Scenario created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/simulator/games/start
   * Start a new simulation game - returns first decision point
   */
  async startGame(req, res, next) {
    try {
      const { scenarioId, userId } = req.body;

      if (!scenarioId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: scenarioId',
        });
      }

      const gameData = await simulatorService.startGame(scenarioId, userId);

      res.status(201).json({
        success: true,
        data: gameData,
        message: 'Game started! You will make choices that lead to different types of fake news.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/simulator/games/:id/choice
   * Make a choice at current decision point and move to next step
   */
  async makeChoice(req, res, next) {
    try {
      const { id } = req.params;
      const { optionId } = req.body;

      if (!optionId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: optionId',
        });
      }

      const result = await simulatorService.makeChoice(id, optionId);

      if (result.gameComplete) {
        return res.json({
          success: true,
          gameComplete: true,
          data: result.finalResults,
          message: 'Game complete! See the fake news article you created.',
        });
      }

      res.json({
        success: true,
        gameComplete: false,
        data: {
          currentMetrics: result.currentMetrics,
          tacticUsed: result.tacticUsed,
          nextNode: result.nextNode,
        },
        message: 'Choice recorded. Next decision point ready.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET/api/simulator/games/:id
   * Get game details with current state
   */
  async getGame(req, res, next) {
    try {
      const { id } = req.params;
      
      const game = await simulatorService.getGame(id);
      
      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Game not found',
        });
      }

      res.json({
        success: true,
        data: game,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/simulator/games/user/:userId
   * Get user's game history
   */
  async getUserGames(req, res, next) {
    try {
      const { userId } = req.params;
      const { limit } = req.query;
      
      const games = await simulatorService.getUserGames(
        userId,
        limit ? parseInt(limit) : 10
      );

      res.json({
        success: true,
        data: games,
        count: games.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/simulator/leaderboard
   * Get top scores
   */
  async getLeaderboard(req, res, next) {
    try {
      const { limit } = req.query;
      
      const leaderboard = await simulatorService.getLeaderboard(
        limit ? parseInt(limit) : 10
      );

      res.json({
        success: true,
        data: leaderboard,
        count: leaderboard.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/simulator/stats/:userId
   * Get user statistics
   */
  async getUserStats(req, res, next) {
    try {
      const { userId } = req.params;
      
      const stats = await simulatorService.getUserStats(userId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // === Detection Challenge Methods (Unchanged) ===

  /**
   * GET /api/simulator/detection/challenges
   * Get detection challenges
   */
  async getDetectionChallenges(req, res, next) {
    try {
      const { difficulty, category, limit } = req.query;
      
      const challenges = await simulatorService.getDetectionChallenges(
        difficulty,
        category,
        limit ? parseInt(limit) : 20
      );

      res.json({
        success: true,
        data: challenges,
        count: challenges.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/simulator/detection/challenges/:id
   * Get specific detection challenge
   */
  async getDetectionChallenge(req, res, next) {
    try {
      const { id } = req.params;
      
      const challenge = await simulatorService.getDetectionChallenge(id);
      
      if (!challenge) {
        return res.status(404).json({
          success: false,
          error: 'Challenge not found',
        });
      }

      res.json({
        success: true,
        data: challenge,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/simulator/detection/submit
   * Submit detection attempt
   */
  async submitDetection(req, res, next) {
    try {
      const { challengeId, identifiedTactics, userId, timeSpent } = req.body;

      if (!challengeId || !Array.isArray(identifiedTactics)) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: challengeId, identifiedTactics (array)',
        });
      }

      const result = await simulatorService.submitDetection(
        challengeId,
        identifiedTactics,
        userId,
        timeSpent
      );

      res.json({
        success: true,
        data: result,
        message: `You scored ${result.userScore}/100! Accuracy: ${result.accuracy.toFixed(1)}%`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/simulator/detection/history/:userId
   * Get user's detection history
   */
  async getUserDetectionHistory(req, res, next) {
    try {
      const { userId } = req.params;
      const { limit } = req.query;
      
      const history = await simulatorService.getUserDetectionHistory(
        userId,
        limit ? parseInt(limit) : 10
      );

      res.json({
        success: true,
        data: history,
        count: history.length,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SimulatorController();
