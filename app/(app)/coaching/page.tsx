import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canAccess, limitFor, requiredTier } from "@/lib/access";
import { getCurrentUser } from "@/lib/auth/current-user";
import { callTypes, demoAway, demoBookings, demoOpenings, type CoachSlug } from "@/lib/mock/coaching";
import { demoToday } from "@/lib/mock/home";
import { coaches, tiers } from "@/lib/site";
import { CoachingBooking } from "./_components/coaching-booking";
import type { CoachInfo } from "./_components/ui";

export const metadata: Metadata = { title: "Coaching" };

/*
 * Book a call with Wasif or Abishek. Pro and Elite book within their calls a
 * month; Free can look at the openings. Every tier rule comes from lib/access.ts.
 */
export default async function CoachingPage() {
  const user = await getCurrentUser();
  if (!user) notFound();

  const canBook = canAccess(user, "coaching.sessions");
  const coachInfo: CoachInfo[] = coaches.map(({ slug, name, fullName, initials, focus, photo }) => ({
    slug: slug as CoachSlug,
    name,
    fullName,
    initials,
    focus,
    photo,
  }));

  // Keyed by plan so switching the demo plan starts the booking over with that plan's calls.
  return (
    <CoachingBooking
      key={user.tier}
      today={demoToday}
      bookings={canBook ? demoBookings : []}
      perMonth={limitFor(user, "coachingSessionsPerMonth")}
      canBook={canBook}
      upgradeName={tiers.find((t) => t.id === requiredTier("coaching.sessions"))?.name ?? "Pro"}
      coaches={coachInfo}
      callTypes={callTypes}
      openings={{ weekly: demoOpenings, away: demoAway }}
    />
  );
}
