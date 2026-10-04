import { expect, type Page, test } from "@playwright/test";

const lane = (page: Page, name: string) => page.getByRole("region", { name, exact: true });
const card = (page: Page, text: string) => page.getByRole("button", { name: new RegExp(`^${text}, `) });
const details = (page: Page) => page.getByRole("dialog");

async function asPro(page: Page) {
  // No entrance animations, so cards are where they'll stay.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/plan");
  await page.getByRole("button", { name: "Pro", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pro", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Assigned by Wasif · open a card for its steps")).toBeVisible();
  // Moving cards needs the page to be interactive.
  await page.waitForLoadState("networkidle");
}

test.describe("plan (/plan, demo mode)", () => {
  test("a Free student gets starter steps on the board and sees what a coach adds", async ({ page }) => {
    const response = await page.goto("/plan");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Plan · Career OS");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Plan");
    await expect(page.getByText("Starter steps from your resume score")).toBeVisible();
    await expect(lane(page, "To do").getByRole("listitem")).toHaveCount(3);
    await expect(page.getByRole("navigation", { name: "Choose a week" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "See Pro" })).toHaveAttribute("href", "/pricing");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

    await page.waitForLoadState("networkidle");
    await card(page, "Take the first resume lesson").click();
    await details(page).getByRole("combobox").selectOption("Tonight");
    await expect(details(page).getByText("You picked:")).toBeVisible();
  });

  test("with Pro, the week's board, the coach's note, the gaps and the month", async ({ page }) => {
    await asPro(page);
    await expect(page.getByRole("heading", { name: "This week's tasks" })).toBeVisible();
    await expect(lane(page, "To do").getByRole("listitem")).toHaveCount(1);
    await expect(lane(page, "In progress").getByRole("listitem")).toHaveCount(1);
    await expect(lane(page, "Done").getByRole("listitem")).toHaveCount(2);
    await expect(page.getByRole("region", { name: "Note from Wasif" })).toContainText("Impact is the gap now");
    await expect(page.getByRole("heading", { name: "Top three gaps" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "October goals" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  });

  test("a card opens its steps, and finishing it moves it to Done for good", async ({ page }) => {
    await asPro(page);
    await card(page, "Rewrite your top three bullets").click();
    await expect(details(page).getByRole("heading", { name: "Rewrite your top three bullets" })).toBeVisible();
    const step = details(page).getByRole("checkbox", { name: "Lead with the result, then how you got there" });
    await step.click();
    await expect(step).toHaveAttribute("aria-checked", "true");
    await expect(details(page).getByText("2 of 3")).toBeVisible();

    await details(page).getByRole("button", { name: "Mark done" }).click();
    await expect(details(page).getByRole("button", { name: "Not done yet" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(details(page)).toHaveCount(0);
    await expect(lane(page, "Done").getByRole("listitem")).toHaveCount(3);
    await expect(page.getByText("3 of 4 done")).toBeVisible();

    await page.reload();
    await expect(lane(page, "Done").getByRole("listitem")).toHaveCount(3);
  });

  test("a card can be dragged to another column", async ({ page, isMobile }) => {
    test.skip(isMobile, "Dragging is for a mouse; phones use the buttons in the card's window");
    await asPro(page);
    await card(page, "Approve this week's matches").dragTo(lane(page, "In progress"));
    await expect(lane(page, "In progress").getByRole("listitem")).toHaveCount(2);
    await expect(lane(page, "To do").getByText("Nothing left to start")).toBeVisible();
  });

  test("the arrows look back at earlier weeks, which can't be changed, and ahead to the next", async ({ page }) => {
    await asPro(page);
    const nav = page.getByRole("navigation", { name: "Choose a week" });

    await nav.getByRole("button", { name: "Previous week" }).click();
    await expect(page.getByRole("heading", { name: "Week 5 tasks" })).toBeVisible();
    await expect(page.getByText("You're looking back at week 5")).toBeVisible();
    await expect(lane(page, "Done").getByRole("listitem")).toHaveCount(5);
    await expect(page.getByRole("region", { name: "Note from Wasif" })).toContainText("The ML project works");
    await card(page, "Record a 2-minute demo").click();
    await expect(details(page).getByRole("button", { name: /Mark done|Not done yet|Start this task/ })).toHaveCount(0);
    await page.keyboard.press("Escape");

    await nav.getByRole("button", { name: "Previous week" }).click();
    await expect(lane(page, "Not finished").getByRole("listitem")).toHaveCount(1);

    await page.getByRole("button", { name: "Back to this week" }).click();
    await expect(page.getByRole("heading", { name: "This week's tasks" })).toBeVisible();

    await nav.getByRole("button", { name: "Next week" }).click();
    await expect(page.getByText("Not planned yet")).toBeVisible();
    await expect(nav.getByRole("button", { name: "Next week" })).toBeDisabled();

    await page
      .getByRole("group", { name: "Jump to a week" })
      .getByRole("button", { name: /^Week 2,/ })
      .click();
    await expect(page.getByRole("heading", { name: "Week 2 tasks" })).toBeVisible();
  });
});
