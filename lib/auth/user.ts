import type { TierId } from "@/lib/access";

export type Role = "student" | "coach";

/** The signed-in person, as every page and component sees them. Mirrors the planned `profiles` table. */
export type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  tier: TierId;
  /** What they're aiming for, from onboarding. */
  target: { role: string; season: string };
};

export function initials(user: Pick<CurrentUser, "firstName" | "lastName">) {
  return `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
}
