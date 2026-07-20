import { expect, test } from "vitest";

import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { routing } from "@/i18n/routing";

// Indexability is a product rule: anonymous read access exists so content can be
// found. A sitemap missing a locale silently makes that locale unreachable.
test("sitemap covers every configured locale", () => {
  const urls = sitemap().map((entry) => entry.url);

  for (const locale of routing.locales) {
    expect(urls.some((url) => url.endsWith(`/${locale}`))).toBe(true);
  }
  // No locale is silently dropped from any route: each is represented the same
  // number of times (once per route).
  const counts = routing.locales.map(
    (l) => urls.filter((u) => new URL(u).pathname.startsWith(`/${l}`)).length
  );
  expect(new Set(counts).size).toBe(1);
});

// The static content routes (PBI-015) must be indexable in every locale.
test("sitemap includes the static content routes for every locale", () => {
  const urls = sitemap().map((entry) => entry.url);

  for (const locale of routing.locales) {
    for (const path of ["/about", "/terms", "/privacy"]) {
      expect(urls.some((url) => url.endsWith(`/${locale}${path}`))).toBe(true);
    }
  }
});

test("every sitemap entry declares all locale alternates", () => {
  for (const entry of sitemap()) {
    const languages = entry.alternates?.languages ?? {};
    expect(Object.keys(languages).sort()).toEqual([...routing.locales].sort());
  }
});

test("sitemap urls are absolute", () => {
  for (const entry of sitemap()) {
    expect(entry.url).toMatch(/^https?:\/\//);
  }
});

test("robots allows crawling and points at the sitemap", () => {
  const result = robots();

  expect(result.rules).toMatchObject({ userAgent: "*", allow: "/" });
  expect(result.sitemap).toMatch(/^https?:\/\/.*\/sitemap\.xml$/);
});
