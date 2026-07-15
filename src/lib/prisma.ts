import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Neon requires a WebSocket polyfill in Node.js environments
if (typeof window === "undefined" && !global.WebSocket) {
  // @ts-expect-error polyfill ws
  global.WebSocket = ws;
}

let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  if (!process.env.DATABASE_URL) {
    // During build time, if no URL is present, we still need to instantiate PrismaClient without crashing.
    prisma = new PrismaClient({ log: ["query"] });
  } else {
    const neon = new Pool({ connectionString: process.env.DATABASE_URL });
    // @ts-expect-error Prisma neon pool type mismatch
    const adapter = new PrismaNeon(neon);
    prisma = new PrismaClient({ adapter, log: ["query"] });
  }
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
