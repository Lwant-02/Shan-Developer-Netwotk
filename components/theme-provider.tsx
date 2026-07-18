import { ThemeProvider as NextThemesProvider } from "next-themes";

// No `"use client"` here, deliberately. next-themes' own provider carries it, so this
// wrapper stays a Server Component and its pre-paint <script> is only ever rendered on
// the server. Marking this file client makes React re-render that script on every
// client navigation, which React 19 rejects: "Encountered a script tag while rendering
// React component".
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    // `disableTransitionOnChange` is deliberately off: it suppresses every
    // transition while the class flips, which would cancel the body's colour
    // transition on theme switch.
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
