import { expect, test } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { AdminOverview } from "@/components/admin/admin-overview";
import { ReportQueue } from "@/components/admin/report-queue";
import { LeftNav } from "@/components/shell/left-nav";
import { listReports } from "@/lib/reports";
import en from "@/messages/en.json";

// A fixed reference time keeps the relative-time render independent of the wall clock.
const now = new Date("2026-08-01T12:00:00Z");

function renderAt(node: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={en} now={now}>
      {node}
    </NextIntlClientProvider>,
  );
}

// The point of the PBI: Report has shipped on posts, projects, and events since
// PBI-010/020/021 with nothing on the other end. Each row must reach the reported thing.
test("the queue links each report to the content it is about", () => {
  const { container } = renderAt(
    <ReportQueue reports={listReports()} now={now} />,
  );

  expect(
    container.querySelector('a[href$="/post/shan-word-segmentation-search"]'),
  ).not.toBeNull();
  expect(
    container.querySelector('a[href$="/projects/shan-dates"]'),
  ).not.toBeNull();
  expect(
    container.querySelector('a[href$="/events/beginner-git-workshop"]'),
  ).not.toBeNull();
});

// Identity safety (AGENTS.md; design.md "Safety and pseudonymity"). A report names two
// pseudonymous handles and nothing more — an admin screen must not become a richer
// dossier than the public profile.
test("the queue exposes no email", () => {
  const { container } = renderAt(
    <ReportQueue reports={listReports()} now={now} />,
  );

  expect(container.textContent).not.toMatch(/@[\w-]+\.\w{2,}/);
  expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
});

// Deleting someone's work and banning a member are not mis-click actions: both confirm
// first, and the confirmation has to say plainly that nothing is stored — an admin must
// never walk away believing a takedown happened.
test("destructive actions confirm first and admit they persist nothing", () => {
  renderAt(<ReportQueue reports={listReports()} now={now} />);

  fireEvent.click(screen.getAllByRole("button", { name: en.Admin.actions })[0]);
  fireEvent.click(screen.getByRole("menuitem", { name: en.Admin.actionBan }));

  expect(
    screen.getByRole("heading", { name: en.Admin.confirmBanTitle }),
  ).toBeDefined();
  expect(screen.getByText(en.Admin.notWired)).toBeDefined();
});

// Resolving is local state only (the PBI-023 "mark all as read" shape). The row leaves
// the queue, the count drops, and the surface says the change was not saved.
test("resolving a report clears it locally and says nothing was stored", () => {
  renderAt(<ReportQueue reports={listReports()} now={now} />);

  const before = listReports().length;
  const allTab = () =>
    screen.getByRole("tab", { name: new RegExp(`^${en.Admin.filterAll}`) });
  expect(within(allTab()).getByText(/^\d+$/).textContent).toBe(String(before));

  fireEvent.click(screen.getAllByRole("button", { name: en.Admin.actions })[0]);
  fireEvent.click(
    screen.getByRole("menuitem", { name: en.Admin.actionDismiss }),
  );

  expect(within(allTab()).getByText(/^\d+$/).textContent).toBe(
    String(before - 1),
  );
  expect(screen.getByText(/Nothing was saved/)).toBeDefined();
});

// The one control on the queue. Each tab carries its own count, so the filter is
// verifiable without reaching into hidden panels.
test("the type filter counts match the reports of each type", () => {
  renderAt(<ReportQueue reports={listReports()} now={now} />);

  const count = (name: string) =>
    within(screen.getByRole("tab", { name: new RegExp(`^${name}`) })).getByText(
      /^\d+$/,
    ).textContent;

  expect(count(en.Admin.filterAll)).toBe(String(listReports().length));
  expect(count(en.Admin.filter_post)).toBe(String(listReports("post").length));
  expect(count(en.Admin.filter_project)).toBe(
    String(listReports("project").length),
  );
  expect(count(en.Admin.filter_event)).toBe(
    String(listReports("event").length),
  );
});

// The cold-start instrument — "is anyone here?" answered without browsing four pages.
test("the overview shows community counts and recent joins", () => {
  renderAt(<AdminOverview />);

  expect(screen.getByText(en.Admin.members)).toBeDefined();
  expect(screen.getByText(en.Admin.recentJoins)).toBeDefined();
});

// what the live site ships: no admin entry for anyone.
test("the left nav shows no admin entry without a moderator user", () => {
  renderAt(<LeftNav />);

  expect(screen.queryByText(en.Nav.admin)).toBeNull();
  expect(screen.getByText(en.Nav.privacy)).toBeDefined();
});
