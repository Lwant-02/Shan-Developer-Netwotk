import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./generated/prisma/client";

// The one Prisma client (PBI-027). Prisma 7 connects through a driver adapter rather than
// its own engine, so the pool lives here.
//
// `DATABASE_URL` is the **pooled** Supabase connection (Supavisor, port 6543). Serverless
// functions each open their own connections, and Postgres runs out of them long before
// Vercel runs out of functions — the pooler is what stops that. Migrations use the direct
// connection instead; see `prisma.config.ts` for why they cannot share one.
//
// The global cache exists because Next's dev server re-evaluates modules on every edit; a
// fresh client per reload exhausts the connection limit within a few minutes. Production
// gets a single module instance, so it skips the cache.

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set — copy .env.example to .env.local and fill in the Supabase connection strings.",
    );
  }

  // Supavisor runs in transaction mode on 6543, handing each connection to whoever needs
  // it next — so a *named* prepared statement created on one request is gone by the next.
  // node-postgres only creates named statements when a query passes `name`, which this
  // adapter does not, so there is nothing to disable here. Worth knowing rather than
  // discovering under load: the symptom would be "prepared statement does not exist",
  // and it would never reproduce in dev.
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
