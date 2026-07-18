import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Testing Library doesn't auto-clean when Vitest runs with globals but no
// framework-specific auto-cleanup entry point. Unmount between tests so a
// leaked DOM node from one test can't satisfy a query in the next.
afterEach(() => {
  cleanup();
});
