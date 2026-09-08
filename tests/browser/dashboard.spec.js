import { test, expect } from "@playwright/test";
test("complete warehouse walkthrough", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/analytics");
  await expect(page).toHaveURL(/login/);
  await page.getByRole("button", { name: "Sign in to dashboard" }).click();
  await expect(
    page.getByRole("heading", { name: "Warehouse overview" }),
  ).toBeVisible();
  await expect(page.locator(".status.live")).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(4);
  const timestamp = await page.locator(".live-bar small").textContent();
  await expect(page.locator(".live-bar small")).not.toHaveText(timestamp, {
    timeout: 6000,
  });
  await page.locator(".zone-select select").selectOption("1");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Details for Cold storage" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.locator(".zone-select select").selectOption("all");
  await page.screenshot({
    path: "tests/screenshots/overview.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Pause live" }).click();
  await expect(page.locator(".status.paused")).toBeVisible();
  await page.getByRole("link", { name: "Analytics", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Warehouse analytics" }),
  ).toBeVisible();
  await expect(page.locator(".recharts-surface")).toHaveCount(3);
  await page
    .getByRole("link", { name: /^Alerts/ })
    .first()
    .click();
  await expect(page.locator(".alert-row").first()).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search alerts" })
    .fill("nonexistent zone");
  await expect(page.getByText("No matching alerts")).toBeVisible();
  await page.getByRole("textbox", { name: "Search alerts" }).fill("");
  await page.locator(".alert-row").first().click();
  const acknowledge = page.getByRole("button", {
    name: "Acknowledge alert",
    exact: true,
  });
  if (await acknowledge.count()) {
    await acknowledge.click();
    await expect(
      page.getByRole("button", { name: "Acknowledged", exact: true }),
    ).toBeDisabled();
  }
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByRole("switch", { name: "Dark appearance" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("combobox", { name: "Summary refresh interval" })
    .selectOption("5");
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Summary refresh interval" }),
  ).toHaveValue("5");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.getByRole("link", { name: "Overview", exact: true }).click();
  await expect(page.locator(".status.live")).toBeVisible();
  await page.screenshot({ path: "tests/screenshots/dark.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "tests/screenshots/mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "View profile" }).click();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/login/);
  await page.goto("/");
  await expect(page).toHaveURL(/login/);
  expect(errors).toEqual([]);
});
test("polling continues while paused and revoked sessions clear the UI", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Password", { exact: true }).fill("incorrect");
  await page.getByRole("button", { name: "Sign in to dashboard" }).click();
  await expect(page.getByRole("alert")).toContainText("Check your email");
  await page.getByLabel("Password", { exact: true }).fill("Warehouse123!");
  await page.getByRole("button", { name: "Sign in to dashboard" }).click();
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Summary refresh interval" })
    .selectOption("5");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.getByRole("link", { name: "Analytics", exact: true }).click();
  const before = await page.locator(".section-note").first().textContent();
  await expect(page.locator(".section-note").first()).not.toHaveText(before, {
    timeout: 8000,
  });
  await page.request.post("/api/auth/logout");
  await expect(page).toHaveURL(/login/, { timeout: 8000 });
  await expect(
    page.getByRole("heading", { name: "Warehouse analytics" }),
  ).toHaveCount(0);
});
