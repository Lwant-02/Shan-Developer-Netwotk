import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next loads `.env.local` on its own; the Prisma CLI does not, and secrets live there
// because `.gitignore` only exempts `.env.example`. First file to define a key wins.
config({ path: [".env.local", ".env"], quiet: true });

// Migrations run against the **direct** Supabase connection (port 5432), not the pooler.
// Supavisor in transaction mode cannot hold the session-level advisory locks that
// `prisma migrate` takes, so pointing this at the pooled URL fails in ways that look like
// a hung migration rather than a misconfiguration.
//
// The application uses the pooled `DATABASE_URL` instead — see `lib/db.ts`. Prisma 7's
// config accepts no `directUrl` (that lived in the datasource block in v6), so the split
// is expressed here: the CLI reads `DIRECT_URL`, the runtime reads `DATABASE_URL`.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
