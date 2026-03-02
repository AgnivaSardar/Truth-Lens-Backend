/**
 * RAG (Retrieval-Augmented Generation) Service
 * Handles information retrieval and generation based on stored knowledge
 * Uses vector embeddings and LLMs for intelligent search
 */

const axios = require('axios');
const prisma = require('../lib/db');

class RAGService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.vectorStore = []; // In production, use a proper vector DB like Pinecone, Weaviate, or Qdrant
  }

  /**
   * Search for information using RAG
   * @param {string} query - User's search query
   * @param {string} userId - Optional user ID
   * @returns {Promise<{answer: string, sources: array, relevance: number}>}
   */
  async search(query, userId = null) {
    try {
      // 1. Get embeddings for the query
      const queryEmbedding = await this.getEmbedding(query);

      // 2. Search for relevant documents (in production, use vector search)
      const relevantDocs = await this.findRelevantDocuments(queryEmbedding);

      // 3. Generate answer using LLM with context
      const answer = await this.generateAnswer(query, relevantDocs);

      // 4. Store search history
      await this.storeSearchHistory(query, answer, userId);

      return {
        answer: answer.text,
        sources: relevantDocs.map(doc => doc.source),
        relevance: answer.relevance,
        relatedQueries: answer.relatedQueries,
      };
    } catch (error) {
      console.error('RAG Search Error:', error);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Get embedding vector for text
   * @param {string} text 
   * @returns {Promise<number[]>}
   */
  async getEmbedding(text) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          model: 'text-embedding-ada-002',
          input: text,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.data[0].embedding;
    } catch (error) {
      console.error('Embedding Error:', error);
      throw error;
    }
  }

  /**
   * Find relevant documents based on query embedding
   * In production, this would use a vector database
   * @param {number[]} queryEmbedding 
   * @returns {Promise<array>}
   */
  async findRelevantDocuments(queryEmbedding) {
    try {
      // For now, get recent fact checks and news as context
      const [factChecks, news] = await Promise.all([
        prisma.factCheck.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.news.findMany({
          take: 5,
          where: { isTrending: true },
          orderBy: { publishedAt: 'desc' },
        }),
      ]);

      // Combine into relevant documents
      const docs = [
        ...factChecks.map(fc => ({
          content: `${fc.originalText}\n${fc.explanation}`,
          source: 'Fact Check Database',
          metadata: {
            type: 'fact-check',
            status: fc.verificationStatus,
            confidence: fc.confidence,
          },
        })),
        ...news.map(n => ({
          content: `${n.title}\n${n.description}`,
          source: n.source || 'News Database',
          metadata: {
            type: 'news',
            category: n.category,
            isHot: n.isHot,
          },
        })),
      ];

      // In production, calculate cosine similarity with queryEmbedding
      // and return top K most similar documents
      return docs.slice(0, 3);
    } catch (error) {
      console.error('Document Retrieval Error:', error);
      return [];
    }
  }

  /**
   * Generate answer using LLM with retrieved context
   * @param {string} query 
   * @param {array} documents 
   * @returns {Promise<object>}
   */
  async generateAnswer(query, documents) {
    try {
      const context = documents
        .map((doc, idx) => `[${idx + 1}] ${doc.content}\nSource: ${doc.source}`)
        .join('\n\n');

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant that answers questions based on provided context.
              Always cite your sources using [1], [2], etc. when referencing the context.
              If the context doesn't contain enough information, acknowledge that and provide what you can.
              Be concise but thorough. Respond in JSON format with:
              {
                "text": "your answer with citations",
                "relevance": number (0-1),
                "relatedQueries": ["related query 1", "related query 2"]
              }`,
            },
            {
              role: 'user',
              content: `Context:\n${context}\n\nQuestion: ${query}`,
            },
          ],
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Answer Generation Error:', error);
      return {
        text: 'I apologize, but I could not generate an answer at this time.',
        relevance: 0,
        relatedQueries: [],
      };
    }
  }

  /**
   * Store search history in database
   * @param {string} query 
   * @param {object} result 
   * @param {string} userId 
   */
  async storeSearchHistory(query, result, userId = null) {
    try {
      await prisma.searchHistory.create({
        data: {
          query,
          results: result,
          userId,
        },
      });
    } catch (error) {
      console.error('Error storing search history:', error);
      // Don't throw - this is non-critical
    }
  }

  /**
   * Get search history for a user
   * @param {string} userId 
   * @param {number} limit 
   * @returns {Promise<array>}
   */
  async getSearchHistory(userId, limit = 10) {
    try {
      return await prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Error fetching search history:', error);
      return [];
    }
  }

  /**
   * Index new content for RAG (add to vector store)
   * In production, this would add embeddings to a vector database
   * @param {string} content 
   * @param {object} metadata 
   */
  async indexContent(content, metadata = {}) {
    try {
      const embedding = await this.getEmbedding(content);
      
      // In production, store in vector DB
      this.vectorStore.push({
        content,
        embedding,
        metadata,
        timestamp: new Date(),
      });

      console.log('Content indexed successfully');
    } catch (error) {
      console.error('Content Indexing Error:', error);
    }
  }
}

module.exports = new RAGService();
