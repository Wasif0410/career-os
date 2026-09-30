import { expect, test } from "@playwright/test";

test("/plan has a page", async ({ page }) => {
  const response = await page.goto("/plan");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Plan");
});
