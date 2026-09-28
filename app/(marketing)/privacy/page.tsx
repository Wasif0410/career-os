import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Career OS collects on this website, why, and how to have it deleted.",
  alternates: { canonical: "/privacy" },
};

// Covers the marketing site and waitlist only. Replace with a reviewed policy before accounts and resumes go live.
export default function PrivacyPage() {
  const updated = "September 27, 2026";
  const contact = site.contactEmail;
  return (
    <article className="mx-auto max-w-[44rem] px-5 pt-14 pb-24 sm:px-8 md:pt-20">
      <p className="eyebrow">Last updated {updated}</p>
      <h1 className="text-display-l mt-5">
        Privacy
      </h1>
      <div className="mt-8 space-y-6 text-[1.05rem] leading-[1.75] text-ink-soft [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[1.75rem] [&_h2]:font-normal [&_h2]:text-ink">
        <p>
          This page covers the Career OS website and waitlist. We&apos;ll publish a full policy before accounts,
          resumes and applications go live.
        </p>
        <h2>What we collect</h2>
        <p>
          When you join the waitlist we store your email address, the target you picked if you chose one, which form
          you used, and when you signed up.
        </p>
        <h2>Why</h2>
        <p>
          To email you when your spot opens and to understand which roles students are aiming for. We don&apos;t sell
          your information or share it with employers.
        </p>
        <h2>Who processes it</h2>
        <p>
          Waitlist data is stored with Supabase. Confirmation emails are sent with Resend. Both process data on our
          behalf only.
        </p>
        <h2>Deleting your data</h2>
        <p>
          {contact ? (
            <>
              Email{" "}
              <a className="font-medium text-cobalt underline underline-offset-4" href={`mailto:${contact}`}>
                {contact}
              </a>{" "}
              from the address you signed up with and we&apos;ll remove it.
            </>
          ) : (
            "Reply to any email from us, from the address you signed up with, and we'll remove it."
          )}
        </p>
      </div>
    </article>
  );
}
