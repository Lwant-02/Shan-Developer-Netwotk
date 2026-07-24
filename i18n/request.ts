import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    // A single reference time for all `relativeTime` formatting, shared by Server and
    // Client Components (NextIntlClientProvider inherits it). Without it next-intl falls
    // back to render-time per call — warning noise, and a server/client hydration drift
    // for relative times rendered on both sides (e.g. the event card in EventsBrowser).
    now: new Date(),
  };
});
