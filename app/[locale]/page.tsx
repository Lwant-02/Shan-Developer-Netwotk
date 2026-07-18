import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Home />;
}

// Split out because Vitest cannot render async Server Components; this keeps the
// markup unit-testable.
export function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex justify-center items-center">
      {t("greeting")} - {t("description")}
    </div>
  );
}
