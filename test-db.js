const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
  
  try {
    const user = await prisma.user.findFirst();
    console.log("DB connection successful, user:", user);
  } catch (e) {
    console.error("DB connection error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
