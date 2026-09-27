import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, guides } from "@/lib/guides";
import { ArrowGlyph } from "@/components/brand/glyphs";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { type: "article", title: guide.title, description: guide.description, publishedTime: guide.published },
  };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const { default: Content } = await import(`@/content/guides/${slug}.mdx`);
  const next = guides[(guides.indexOf(guide) + 1) % guides.length];
  const date = new Date(`${guide.published}T12:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <article className="mx-auto max-w-6xl px-5 sm:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mx-auto max-w-[44rem] pt-12 pb-10 md:pt-16">
        <Link
          href="/guides"
          className="group inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-slate uppercase hover:text-ink"
        >
          <ArrowGlyph className="size-3.5 rotate-180 transition-transform group-hover:-translate-x-0.5" />
          All guides
        </Link>
        <h1 className="mt-6 font-display text-[clamp(2.2rem,5.4vw,3.6rem)] leading-[1.02] font-bold tracking-[-0.03em]">
          {guide.title}
        </h1>
        <p className="mt-5 text-xl leading-relaxed text-ink-soft">{guide.description}</p>
        <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 border-t border-rule pt-5 font-mono text-xs tracking-wide text-slate uppercase">
          <span>{guide.topic}</span>
          <span>{guide.readingMinutes} min read</span>
          <time dateTime={guide.published}>{date}</time>
        </p>
      </header>

      <div className="mx-auto max-w-[44rem] pb-16">
        <Content />
      </div>

      <aside className="mx-auto mb-24 max-w-[44rem] border-t border-rule pt-8">
        <p className="eyebrow">Next guide</p>
        <Link href={`/guides/${next.slug}`} className="group mt-3 flex items-center justify-between gap-6">
          <span className="font-display text-2xl font-bold tracking-[-0.02em] group-hover:text-cobalt-deep">
            {next.title}
          </span>
          <span className="grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-rule-strong transition-colors group-hover:bg-ink group-hover:text-white">
            <ArrowGlyph />
          </span>
        </Link>
      </aside>
    </article>
  );
}
