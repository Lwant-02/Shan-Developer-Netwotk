import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";

import { db } from "@/lib/db";
import { ensureProfile } from "./ensure-profile";
import { loadCurrentUser } from "./load-current-user";

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set — see .env.example.`);
  return value;
}

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  secret: required("BETTER_AUTH_SECRET"),
  advanced: { database: { generateId: () => crypto.randomUUID() } },
  session: {
    expiresIn: 60 * 60 * 24 * 14,
    disableSessionRefresh: true,
  },
  account: {
    accountLinking: { enabled: true, updateUserInfoOnLink: false },
  },
  socialProviders: {
    google: {
      clientId: required("GOOGLE_CLIENT_ID"),
      clientSecret: required("GOOGLE_CLIENT_SECRET"),
    },
    github: {
      clientId: required("GITHUB_CLIENT_ID"),
      clientSecret: required("GITHUB_CLIENT_SECRET"),
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await ensureProfile(user);
        },
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => ({
      session,
      user: await loadCurrentUser(user),
    })),
    nextCookies(),
  ],
});
