import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import Page from "@/app/page";

// Anonymous read access is a product requirement, not a nicety: the home page
// must render with no session at all. Rendering the component in isolation —
// no auth provider, no session context — is the unit-level version of that
// guarantee. See AGENTS.md.
test("home page renders for an anonymous visitor", () => {
  render(<Page />);

  expect(screen.getByText(/Shan Developer Netwrok/i)).toBeDefined();
});

// Shan script is first-class content. If a refactor drops the Shan string or
// mangles it (a common casualty of encoding or font work), this fails.
test("home page renders Shan script content", () => {
  const { container } = render(<Page />);

  // U+1000–U+109F is the Myanmar block, which Shan is written in.
  expect(container.textContent).toMatch(/[က-႟]/);
});
