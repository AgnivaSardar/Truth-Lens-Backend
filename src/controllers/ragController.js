/**
 * RAG Controller
 * Handles RAG-based information search and retrieval
 */

const ragService = require('../services/ragService');

class RAGController {
  /**
   * Search for information using RAG
   */
  async search(req, res) {
    try {
      const { query, userId } = req.body;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Query is required',
        });
      }

      const result = await ragService.search(query, userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('RAG Search Error:', error);
      res.status(500).json({
        success: false,
        error: 'Search failed',
        message: error.message,
      });
    }
  }

  /**
   * Get search history for a user
   */
  async getHistory(req, res) {
    try {
      const { userId, limit = 10 } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
      }

      const history = await ragService.getSearchHistory(userId, parseInt(limit));

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      console.error('Get Search History Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch search history',
      });
    }
  }

  /**
   * Index new content for RAG
   */
  async indexContent(req, res) {
    try {
      const { content, metadata } = req.body;

      if (!content) {
        return res.status(400).json({
          success: false,
          error: 'Content is required',
        });
      }

      await ragService.indexContent(content, metadata);

      res.json({
        success: true,
        message: 'Content indexed successfully',
      });
    } catch (error) {
      console.error('Index Content Error:', error);
      res.status(500).json({
        success: false,
        error: 'Content indexing failed',
        message: error.message,
      });
    }
  }
}

module.exports = new RAGController();
