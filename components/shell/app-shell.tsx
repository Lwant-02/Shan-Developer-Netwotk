import { CurrentUserProvider } from "@/components/auth/current-user";
import { Toaster } from "@/components/ui/sonner";
import { FeedbackLauncher } from "@/components/feedback/feedback-launcher";
import { LeftNav } from "./left-nav";
import { NavCollapse } from "./nav-collapse";
import { RightRail } from "./right-rail";
import { TopNav } from "./top-nav";

// The shared three-region shell — top nav, a sticky left rail, a centred main column,
// and a sticky right rail — used by every page so the chrome stays constant across
// routes. Only the `children` in the main column change. The rails collapse out on
// their existing breakpoints (left below `lg`, right below `xl`); on mobile the nav
// lives in the TopNav drawer.
// `CurrentUserProvider` takes `children` as a slot, so pages inside stay Server
// Components and stay statically prerendered.
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CurrentUserProvider>
      <TopNav />
      {/* Full-bleed shell: the sidebar is flush to the viewport edge and divided by a
          rule, rather than a centred container with gutters on both sides. */}
      <div className="flex flex-1">
        <aside className="border-border sticky top-16 hidden h-[calc(100dvh-4rem)] shrink-0 border-r py-6 lg:block">
          <NavCollapse>
            <LeftNav />
          </NavCollapse>
        </aside>

        <div className="flex min-w-0 flex-1 justify-center gap-8 px-4 py-6 sm:px-6 xl:px-8">
          <main className="w-full max-w-3xl min-w-0">{children}</main>

          <aside className="hidden w-84 shrink-0 xl:block">
            <div className="sticky top-22">
              <RightRail />
            </div>
          </aside>
        </div>
      </div>

      <FeedbackLauncher />
      <Toaster position="bottom-center" />
    </CurrentUserProvider>
  );
}
