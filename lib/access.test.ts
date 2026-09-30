import { describe, expect, it } from "vitest";
import { canAccess, limitFor, requiredTier, tierOrder, type Feature, type TierId } from "./access";
import { tiers } from "./site";

const free = { tier: "free" as const };
const pro = { tier: "pro" as const };
const elite = { tier: "elite" as const };

describe("canAccess", () => {
  it("keeps every paid feature locked on Free", () => {
    const features: Feature[] = ["resume.fullReport", "coaching.sessions", "plan", "applications.tracker"];
    for (const feature of features) expect(canAccess(free, feature)).toBe(false);
  });

  it("unlocks the Pro features on Pro but not the Elite-only ones", () => {
    expect(canAccess(pro, "resume.fullReport")).toBe(true);
    expect(canAccess(pro, "coaching.sessions")).toBe(true);
    expect(canAccess(pro, "resume.coachReview")).toBe(false);
    expect(canAccess(pro, "coaching.asyncReviews")).toBe(false);
  });

  it("unlocks everything on Elite", () => {
    expect(canAccess(elite, "resume.coachReview")).toBe(true);
    expect(canAccess(elite, "coaching.asyncReviews")).toBe(true);
  });

  it("never locks a feature on a higher tier that a lower tier has", () => {
    const features: Feature[] = [
      "resume.fullReport",
      "resume.coachReview",
      "courses.allLessons",
      "jobs.allMatches",
      "coaching.sessions",
      "coaching.asyncReviews",
      "plan",
      "applications.tracker",
      "applications.autoApply",
    ];
    for (const feature of features) {
      const unlocked = tierOrder.map((tier) => canAccess({ tier }, feature));
      expect(unlocked).toEqual([...unlocked].sort());
    }
  });
});

describe("requiredTier", () => {
  it("points locked features at the cheapest tier that unlocks them", () => {
    expect(requiredTier("plan")).toBe("pro");
    expect(requiredTier("resume.coachReview")).toBe("elite");
  });
});

describe("limitFor", () => {
  it("matches the numbers on the pricing cards", () => {
    expect(limitFor(free, "applicationsPerMonth")).toBe(0);
    expect(limitFor(pro, "applicationsPerMonth")).toBe(10);
    expect(limitFor(elite, "applicationsPerMonth")).toBe(100);
    expect(limitFor(pro, "coachingSessionsPerMonth")).toBe(1);
    expect(limitFor(elite, "coachingSessionsPerMonth")).toBe(4);
    expect(limitFor(free, "visibleJobMatches")).toBe(3);
  });

  it("covers every tier on the pricing page", () => {
    const ids: TierId[] = tiers.map((t) => t.id);
    expect(ids).toEqual([...tierOrder]);
  });
});
