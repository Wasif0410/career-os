import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { ArrowGlyph } from "@/components/brand/glyphs";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description: "Free, practical guides for CS students on targeting roles, fixing resumes and reading application results.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <>
      <PageHeader title="Free guides you can act on tonight." />

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 md:pb-32">
        <ul className="border-t border-rule">
          {guides.map((guide, i) => (
            <Reveal as="li" key={guide.slug} delay={i * 0.05} className="border-b border-rule">
              <Link
                href={`/guides/${guide.slug}`}
                className="group grid gap-3 py-8 md:grid-cols-[10rem_1fr_auto] md:items-baseline md:gap-10"
              >
                <p className="font-mono text-xs tracking-wide text-slate uppercase">
                  {guide.topic} · {guide.readingMinutes} min
                </p>
                <div>
                  <h2 className="font-display text-[clamp(1.6rem,3vw,2.3rem)] leading-tight tracking-[-0.02em] transition-colors group-hover:text-cobalt-deep">
                    {guide.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-ink-soft">{guide.description}</p>
                </div>
                <span className="hidden size-11 place-items-center rounded-full ring-1 ring-rule-strong transition-colors group-hover:bg-ink group-hover:text-white md:grid">
                  <ArrowGlyph className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
