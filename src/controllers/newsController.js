/**
 * News Controller
 * Handles CRUD operations for news and trending topics
 */

const prisma = require('../lib/db');

class NewsController {
  /**
   * Get all news with filtering and pagination
   */
  async getAllNews(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        trending,
        hot,
        category,
        search,
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      // Build filter
      const where = {};
      if (trending === 'true') where.isTrending = true;
      if (hot === 'true') where.isHot = true;
      if (category) where.category = category;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [news, total] = await Promise.all([
        prisma.news.findMany({
          where,
          skip,
          take,
          orderBy: { publishedAt: 'desc' },
        }),
        prisma.news.count({ where }),
      ]);

      res.json({
        success: true,
        data: news,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / take),
        },
      });
    } catch (error) {
      console.error('Get All News Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch news',
        message: error.message,
      });
    }
  }

  /**
   * Get trending news
   */
  async getTrendingNews(req, res) {
    try {
      const { limit = 10 } = req.query;

      const news = await prisma.news.findMany({
        where: { isTrending: true },
        take: parseInt(limit),
        orderBy: { publishedAt: 'desc' },
      });

      res.json({
        success: true,
        data: news,
      });
    } catch (error) {
      console.error('Get Trending News Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch trending news',
      });
    }
  }

  /**
   * Get hot news
   */
  async getHotNews(req, res) {
    try {
      const { limit = 10 } = req.query;

      const news = await prisma.news.findMany({
        where: { isHot: true },
        take: parseInt(limit),
        orderBy: { publishedAt: 'desc' },
      });

      res.json({
        success: true,
        data: news,
      });
    } catch (error) {
      console.error('Get Hot News Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch hot news',
      });
    }
  }

  /**
   * Get single news by ID
   */
  async getNewsById(req, res) {
    try {
      const { id } = req.params;

      const news = await prisma.news.findUnique({
        where: { id },
      });

      if (!news) {
        return res.status(404).json({
          success: false,
          error: 'News not found',
        });
      }

      res.json({
        success: true,
        data: news,
      });
    } catch (error) {
      console.error('Get News By ID Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch news',
      });
    }
  }

  /**
   * Create new news
   */
  async createNews(req, res) {
    try {
      const {
        title,
        description,
        content,
        isHot = false,
        isTrending = false,
        source,
        imageUrl,
        category,
        publishedAt,
      } = req.body;

      // Validation
      if (!title || !description || !content) {
        return res.status(400).json({
          success: false,
          error: 'Title, description, and content are required',
        });
      }

      const news = await prisma.news.create({
        data: {
          title,
          description,
          content,
          isHot,
          isTrending,
          source,
          imageUrl,
          category,
          publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        },
      });

      res.status(201).json({
        success: true,
        data: news,
      });
    } catch (error) {
      console.error('Create News Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create news',
        message: error.message,
      });
    }
  }

  /**
   * Update news
   */
  async updateNews(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const news = await prisma.news.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        data: news,
      });
    } catch (error) {
      console.error('Update News Error:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: 'News not found',
        });
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update news',
      });
    }
  }

  /**
   * Delete news
   */
  async deleteNews(req, res) {
    try {
      const { id } = req.params;

      await prisma.news.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'News deleted successfully',
      });
    } catch (error) {
      console.error('Delete News Error:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: 'News not found',
        });
      }
      res.status(500).json({
        success: false,
        error: 'Failed to delete news',
      });
    }
  }

  /**
   * Get news statistics
   */
  async getStats(req, res) {
    try {
      const [total, trending, hot] = await Promise.all([
        prisma.news.count(),
        prisma.news.count({ where: { isTrending: true } }),
        prisma.news.count({ where: { isHot: true } }),
      ]);

      res.json({
        success: true,
        data: {
          total,
          trending,
          hot,
        },
      });
    } catch (error) {
      console.error('Get Stats Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics',
      });
    }
  }

  /**
   * Get high-impact news (same as hot news with impact scoring)
   */
  async getHighImpactNews(req, res) {
    try {
      const { limit = 10 } = req.query;

      const news = await prisma.news.findMany({
        where: { isHot: true },
        take: parseInt(limit),
        orderBy: [
          { impactScore: 'desc' },
          { publishedAt: 'desc' }
        ],
      });

      res.json({
        success: true,
        data: news,
      });
    } catch (error) {
      console.error('Get High Impact News Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch high-impact news',
      });
    }
  }

  /**
   * Get news by slug/topic
   */
  async getNewsBySlug(req, res) {
    try {
      const { slug } = req.params;

      const news = await prisma.news.findFirst({
        where: { 
          OR: [
            { slug: slug },
            { category: slug }
          ]
        },
      });

      if (!news) {
        return res.status(404).json({
          success: false,
          error: 'News article not found',
        });
      }

      res.json({
        success: true,
        data: news,
      });
    } catch (error) {
      console.error('Get News By Slug Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch news article',
      });
    }
  }

  /**
   * Get viral claims (for Fake or Not section)
   */
  async getViralClaims(req, res) {
    try {
      const { limit = 10 } = req.query;

      const claims = await prisma.news.findMany({
        where: { isViral: true },
        take: parseInt(limit),
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          verificationStatus: true,
          publishedAt: true,
        }
      });

      res.json({
        success: true,
        data: claims,
      });
    } catch (error) {
      console.error('Get Viral Claims Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch viral claims',
      });
    }
  }
}

module.exports = new NewsController();
