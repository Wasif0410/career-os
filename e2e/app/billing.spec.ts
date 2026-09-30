import { expect, test } from "@playwright/test";

test("/billing has a page", async ({ page }) => {
  const response = await page.goto("/billing");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Billing");
});
