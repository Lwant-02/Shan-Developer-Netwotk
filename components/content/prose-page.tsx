import { AppShell } from "@/components/shell/app-shell";
import { cn } from "@/lib/utils";

// The static informational pages (About, Terms, Privacy) as a single readable article
// inside the shared AppShell, so they keep the same left nav and right rail as every
// other page. One shell keeps the three consistent instead of three near-identical
// layouts (AGENTS.md: reuse before create).
export function ProsePage({
  title,
  lead,
  children,
  className,
}: {
  title: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AppShell>
      <article className={cn("flex flex-col gap-8 py-2", className)}>
        <header className="flex flex-col gap-3">
          {/* No bold: the AJ fonts are Regular-only, so size and colour carry the
              heading weight (AGENTS.md). Any string here can render in Shan. */}
          <h1 className="text-foreground text-2xl sm:text-3xl">{title}</h1>
          {lead ? (
            <p className="text-muted-foreground text-base leading-relaxed">
              {lead}
            </p>
          ) : null}
        </header>
        {children}
      </article>
    </AppShell>
  );
}

// A titled prose section. `heading`/`body` come straight from message strings.
export function ProseSection({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-foreground text-lg">{heading}</h2>
      <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
    </section>
  );
}
