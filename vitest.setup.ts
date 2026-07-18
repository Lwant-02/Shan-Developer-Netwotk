import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// next/font is a build-time transform with no runtime implementation, so importing
// it under Vitest throws. The stubs echo the requested CSS variable back, which is
// what components actually consume.
// The shape mirrors a real emitted class (`aj12_9f3b-module__xY__variable`) rather
// than a readable name: a plain `font-aj12` would look like a Tailwind font utility
// and get merged away by cn(), which the real hashed names never do.
const stub = ({ variable = "" }: { variable?: string }) => ({
  variable: `${variable.replace(/^--font-/, "")}_test-module__variable`,
  className: "",
  style: { fontFamily: "" },
});

vi.mock("next/font/google", () => ({ Google_Sans: vi.fn(stub) }));
vi.mock("next/font/local", () => ({ default: vi.fn(stub) }));

// jsdom has no matchMedia; motion's useReducedMotion calls it. Default to "no
// preference" so animated components render their final state under test.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

afterEach(() => {
  cleanup();
});
