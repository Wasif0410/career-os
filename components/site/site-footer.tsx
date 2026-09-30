import Link from "next/link";
import { ArrowGlyph } from "@/components/brand/glyphs";
import { Logo } from "@/components/brand/logo";
import { Starfield } from "@/components/brand/starfield";
import { site } from "@/lib/site";

/**
 * The footer carries on from the closing section: same midnight, same stars,
 * one hairline between them. Brand on the left, links on the right, and the
 * wordmark set large at the bottom, fading into the sky.
 */
export function SiteFooter() {
  const columns = [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "/#journey" },
        { label: "Pricing", href: "/pricing" },
        { label: "Guides", href: "/guides" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Coaches", href: "/coaches" },
        { label: "Privacy", href: "/privacy" },
        ...(site.contactEmail ? [{ label: "Contact", href: `mailto:${site.contactEmail}` }] : []),
      ],
    },
    ...(site.socials.length ? [{ title: "Community", links: site.socials.map((s) => ({ ...s })) }] : []),
  ];

  return (
    <footer className="night relative isolate overflow-hidden">
      <Starfield seed={151} count={60} />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-12 border-t border-white/10 pt-16 pb-14 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo tone="dark" />
            <p className="mt-5 text-[0.95rem] leading-relaxed text-white/55">
              Coaching and software for CS students going after internships and new-grad roles.
            </p>
            <Link
              href="#waitlist"
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-sky transition-colors hover:text-white"
            >
              Join the waitlist
              <ArrowGlyph className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <nav aria-label="Footer" className="flex gap-16 sm:gap-24">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-medium tracking-[0.14em] text-white/40 uppercase">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {/^(https?:|mailto:)/.test(link.href) ? (
                        <a
                          href={link.href}
                          className="text-[0.95rem] text-white/75 transition-colors hover:text-white"
                          {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-[0.95rem] text-white/75 transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Career OS</p>
          <p>Made by students who landed the internships.</p>
        </div>
      </div>

      {/* The sign-off */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.16em] bg-[linear-gradient(180deg,rgb(255_255_255/0.16)_10%,rgb(255_255_255/0)_85%)] bg-clip-text px-3 pt-[0.08em] text-center font-display text-[clamp(4.5rem,20vw,18.5rem)] leading-[1.05] tracking-[-0.04em] whitespace-nowrap text-transparent select-none"
      >
        Career OS
      </p>
    </footer>
  );
}
