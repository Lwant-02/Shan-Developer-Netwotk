import { redirect } from "@/i18n/navigation";

// Bare /create has no composer of its own — Post is the default type. Send it there so a
// typed-in or stale /create URL lands somewhere real rather than the 404.
export default async function CreateIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/create/post", locale });
}
