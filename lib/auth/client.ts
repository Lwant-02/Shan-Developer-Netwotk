"use client";

import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";

import type { auth } from "./config";

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
});
