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
  expect(urls).toHaveLength(routing.locales.length);
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
