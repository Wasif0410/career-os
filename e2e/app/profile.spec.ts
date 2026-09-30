import { expect, test } from "@playwright/test";

test("/profile has a page", async ({ page }) => {
  const response = await page.goto("/profile");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Profile");
});
