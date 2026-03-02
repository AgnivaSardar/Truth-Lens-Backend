/**
 * Simulator Routes - Misinformation Simulator Game API
 */

const express = require('express');
const router = express.Router();
const simulatorController = require('../controllers/simulatorController');

// ============================================
// SCENARIO ROUTES
// ============================================

// Get all scenarios
router.get('/scenarios', simulatorController.getScenarios.bind(simulatorController));

// Get specific scenario
router.get('/scenarios/:id', simulatorController.getScenario.bind(simulatorController));

// Create new scenario (admin)
router.post('/scenarios', simulatorController.createScenario.bind(simulatorController));

// ============================================
// GAME ROUTES
// ============================================

// Start a new game
router.post('/games/start', simulatorController.startGame.bind(simulatorController));

// Get game details
router.get('/games/:id', simulatorController.getGame.bind(simulatorController));

// Make a choice at current decision point
router.post('/games/:id/choice', simulatorController.makeChoice.bind(simulatorController));

// Get user's game history
router.get('/games/user/:userId', simulatorController.getUserGames.bind(simulatorController));

// Get leaderboard
router.get('/leaderboard', simulatorController.getLeaderboard.bind(simulatorController));

// ============================================
// DETECTION MODE ROUTES
// ============================================

// Get all detection challenges
router.get('/detection/challenges', simulatorController.getDetectionChallenges.bind(simulatorController));

// Get specific challenge
router.get('/detection/challenges/:id', simulatorController.getDetectionChallenge.bind(simulatorController));

// Submit detection attempt
router.post('/detection/submit', simulatorController.submitDetection.bind(simulatorController));

// Get user's detection history
router.get('/detection/history/:userId', simulatorController.getUserDetectionHistory.bind(simulatorController));

// ============================================
// STATS ROUTES
// ============================================

// Get user statistics
router.get('/stats/:userId', simulatorController.getUserStats.bind(simulatorController));

module.exports = router;
