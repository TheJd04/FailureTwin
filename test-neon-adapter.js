require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');
global.WebSocket = ws;

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  try {
    const neon = new Pool({ connectionString: process.env.DATABASE_URL });
    const res = await neon.query('SELECT 1 as val');
    console.log("Query result:", res.rows);
  } catch (e) {
    console.error("NEON ERROR:", e);
  }
}
main();
