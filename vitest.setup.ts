import { createElement, type ReactNode } from "react";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// next-intl's locale-aware navigation (createNavigation) imports `next/navigation`,
// whose bare subpath export vite can't resolve under jsdom — the same class of
// build-time-only concern as next/font below. Tests don't exercise real routing, so
// stub the app's navigation module with a plain anchor and inert hooks.
vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href?: string;
    children?: ReactNode;
  } & Record<string, unknown>) =>
    createElement(
      "a",
      { href: typeof href === "string" ? href : "#", ...props },
      children
    ),
  usePathname: () => "/",
  useRouter: () => ({ push: () => {}, replace: () => {}, prefetch: () => {} }),
  getPathname: () => "/",
  redirect: () => {},
  permanentRedirect: () => {},
}));

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

// jsdom implements no Web Animations API; kbar's KBarAnimator calls element.animate
// on mount. The palette's behaviour under test is matching, not the open animation.
if (!Element.prototype.animate) {
  Element.prototype.animate = () =>
    ({
      finished: Promise.resolve(),
      cancel: () => {},
      finish: () => {},
      play: () => {},
      pause: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as Animation;
}

// kbar virtualises its result list, which observes the container's size. Without this
// jsdom shim the list renders intermittently and any test touching it is flaky.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

afterEach(() => {
  cleanup();
});
