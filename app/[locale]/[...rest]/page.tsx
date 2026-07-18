import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

// A segment's not-found.tsx only catches an explicit notFound(); unmatched URLs
// otherwise fall through to the root one, losing the locale.
export default async function CatchAll({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
