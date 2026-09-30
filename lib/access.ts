import type { Tier } from "@/lib/site";

/**
 * What each tier unlocks. Every lock in the app asks `canAccess` or `limitFor`;
 * components never compare tiers themselves. Keep this in step with the tier
 * cards in lib/site.ts.
 */

export type TierId = Tier["id"];

export const tierOrder: readonly TierId[] = ["free", "pro", "elite"];

export type Feature =
  | "resume.fullReport"
  | "resume.coachReview"
  | "courses.allLessons"
  | "jobs.allMatches"
  | "coaching.sessions"
  | "coaching.asyncReviews"
  | "plan"
  | "applications.tracker"
  | "applications.autoApply";

/** The lowest tier that unlocks each feature. */
const minimumTier: Record<Feature, TierId> = {
  "resume.fullReport": "pro",
  "resume.coachReview": "elite",
  "courses.allLessons": "pro",
  "jobs.allMatches": "pro",
  "coaching.sessions": "pro",
  "coaching.asyncReviews": "elite",
  plan: "pro",
  "applications.tracker": "pro",
  "applications.autoApply": "pro",
};

export type Limit = "coachingSessionsPerMonth" | "applicationsPerMonth" | "visibleJobMatches";

const limits: Record<TierId, Record<Limit, number>> = {
  free: { coachingSessionsPerMonth: 0, applicationsPerMonth: 0, visibleJobMatches: 3 },
  pro: { coachingSessionsPerMonth: 1, applicationsPerMonth: 10, visibleJobMatches: Infinity },
  elite: { coachingSessionsPerMonth: 4, applicationsPerMonth: 100, visibleJobMatches: Infinity },
};

function rank(tier: TierId) {
  return tierOrder.indexOf(tier);
}

export function canAccess(user: { tier: TierId }, feature: Feature) {
  return rank(user.tier) >= rank(minimumTier[feature]);
}

/** The tier to point an upgrade button at when a feature is locked. */
export function requiredTier(feature: Feature): TierId {
  return minimumTier[feature];
}

export function limitFor(user: { tier: TierId }, limit: Limit) {
  return limits[user.tier][limit];
}
