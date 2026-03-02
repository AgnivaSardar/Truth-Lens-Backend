/**
 * Shared Database Instance
 * Ensures a single Prisma client is used across the application
 */

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Create a single pool for the entire application
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Maximum number of connections in the pool
});

// Create adapter and client
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ 
  adapter,
  log: ['warn', 'error'], // Only log warnings and errors
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;
