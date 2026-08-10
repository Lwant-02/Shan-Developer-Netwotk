import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { AppShell } from "@/components/shell/app-shell";
import { SettingsForm } from "@/components/settings/settings-form";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getDeveloperByHandle } from "@/lib/developers";
import { cn } from "@/lib/utils";
import { mockCurrentUser } from "@/lib/current-user";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Settings" });

  return {
    title: t("title"),
    // Per-account configuration is not a content surface — keep it out of the index,
    // unlike every public read page here.
    robots: { index: false, follow: false },
  };
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Settings");
  const user = mockCurrentUser;
  // Prefilled from the public profile, so the form starts from exactly what other
  // members currently see.
  const developer = user ? getDeveloperByHandle(user.handle) : undefined;

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-2">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          {t("back")}
        </Link>

        <header className="flex flex-col gap-2">
          <h1 className="text-foreground text-2xl">{t("title")}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        {/* There is nothing to configure without an account, so the anonymous branch is
            the sign-in gate rather than an empty form. This is not a public read
            surface, so gating it here does not touch the anonymous-read rule. */}
        {user ? (
          <SettingsForm user={user} developer={developer} />
        ) : (
          <div className="border-border flex flex-col items-start gap-3 rounded-lg border p-5">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("signedOut")}
            </p>
            <SignInDialog>
              <button
                type="button"
                className={cn(
                  buttonVariants(),
                  "h-9 cursor-pointer font-normal",
                )}
              >
                {t("signIn")}
              </button>
            </SignInDialog>
          </div>
        )}
      </div>
    </AppShell>
  );
}
