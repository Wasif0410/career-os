import type { Metadata } from "next";
import { TierCards } from "@/components/pricing/tier-cards";
import { PageHeader } from "@/components/ui/page-header";
import { Faq, type FaqItem } from "@/components/ui/faq";
import { Reveal } from "@/components/ui/reveal";
import { CheckGlyph } from "@/components/brand/glyphs";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free with your resume score. Upgrade to Pro or Elite for 1-1 coaching, a written plan, full job matches and applications sent for you.",
  alternates: { canonical: "/pricing" },
};

type Cell = boolean | string;
const rows: { feature: string; free: Cell; pro: Cell; elite: Cell }[] = [
  { feature: "Profile", free: "Basic", pro: "Full", elite: "Full" },
  { feature: "Resume score", free: "Score + top fix", pro: "Full report", elite: "Full report + coach review" },
  { feature: "Courses and guides", free: "First lesson of each", pro: true, elite: true },
  { feature: "Job matches", free: "Count + 3 shown", pro: "All, with fit scores", elite: "All, with fit scores" },
  { feature: "1-1 coaching", free: false, pro: "1 session a month", elite: "Up to 4 a month" },
  { feature: "Async reviews between sessions", free: false, pro: false, elite: true },
  { feature: "Written action plan", free: false, pro: true, elite: true },
  { feature: "Application tracker", free: false, pro: true, elite: true },
  { feature: "Applications sent for you", free: false, pro: "10 a month", elite: "100 a month" },
];

function Value({ v }: { v: Cell }) {
  if (v === true) return <CheckGlyph className="size-4 text-cobalt" />;
  if (v === false) return <span className="text-slate/60" aria-label="Not included">—</span>;
  return <span>{v}</span>;
}

const faq: FaqItem[] = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your billing page whenever you want. No emails to send, no one to call.",
  },
  {
    q: "What counts as one application credit?",
    a: "One credit is one application Career OS submits for you after you approve the job. Credits reset every billing cycle.",
  },
  {
    q: "Why are coaching spots limited?",
    a: "Two coaches can only prepare properly for so many students. We cap the number of students each month rather than cut the prep for each session.",
  },
  {
    q: "Can I switch plans?",
    a: "Yes. Upgrade or downgrade from your billing page. Upgrades unlock right away.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader title="Pay for the stage you're at.">
        Free shows where you stand. Pro adds a coach. Elite adds more of both.
      </PageHeader>

      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <TierCards />
      </section>

      <section aria-labelledby="compare-title" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-28">
        <Reveal>
          <h2 id="compare-title" className="font-display text-3xl font-bold tracking-[-0.02em] md:text-4xl">
            Compare plans
          </h2>
        </Reveal>
        <Reveal className="mt-8 overflow-x-auto rounded-[1.2rem] bg-surface ring-1 ring-rule">
          <table className="w-full min-w-[40rem] border-collapse text-left text-[0.93rem]">
            <thead>
              <tr className="border-b border-rule">
                <th scope="col" className="px-5 py-4 font-medium text-slate">
                  <span className="sr-only">Feature</span>
                </th>
                {["Free", "Pro", "Elite"].map((t) => (
                  <th scope="col" key={t} className="px-5 py-4 font-display text-lg font-bold">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.feature} className="border-b border-rule last:border-0">
                  <th scope="row" className="px-5 py-3.5 font-medium text-ink">
                    {r.feature}
                  </th>
                  <td className="px-5 py-3.5 text-ink-soft">
                    <Value v={r.free} />
                  </td>
                  <td className="px-5 py-3.5 text-ink-soft">
                    <Value v={r.pro} />
                  </td>
                  <td className="px-5 py-3.5 text-ink-soft">
                    <Value v={r.elite} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      <section aria-labelledby="billing-faq" className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <h2 id="billing-faq" className="font-display text-3xl font-bold tracking-[-0.02em] md:text-4xl">
              Billing questions
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <Faq items={faq} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
