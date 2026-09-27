import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { site } from "@/lib/site";

export function SiteFooter() {
  const columns = [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "/#how-it-works" },
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
    <footer className="border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-[0.92rem] leading-relaxed text-slate">
            Coaching and software for CS students going after internships and new-grad roles.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="eyebrow">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  {/^(https?:|mailto:)/.test(link.href) ? (
                    <a
                      href={link.href}
                      className="text-[0.92rem] text-ink-soft transition-colors hover:text-cobalt"
                      {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-[0.92rem] text-ink-soft transition-colors hover:text-cobalt">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 font-mono text-xs text-slate sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Career OS</p>
          <p>Coached by people. Scored by software.</p>
        </div>
      </div>
    </footer>
  );
}
