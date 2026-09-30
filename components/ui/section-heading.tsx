import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * One heading pattern for every section: a serif title that ends in an italic,
 * blue phrase, and a supporting line. Three compositions, so the page doesn't
 * repeat itself: split (title left, lead right), stacked, and centred.
 */
export function SectionHeading({
  id,
  title,
  muted,
  lead,
  aside,
  dark = false,
  stacked = false,
  center = false,
  className,
}: {
  id: string;
  title: string;
  /** End of the title, set in blue italic. */
  muted?: string;
  lead?: React.ReactNode;
  /** Extra content under the lead, such as a link. */
  aside?: React.ReactNode;
  dark?: boolean;
  /** Put the lead under the title instead of beside it. */
  stacked?: boolean;
  /** Centre the title and the lead. */
  center?: boolean;
  className?: string;
}) {
  const heading = (
    <h2 id={id} className={cn("text-display-m max-w-[20ch]", center && "mx-auto")}>
      {title}
      {muted && (
        <>
          {" "}
          <em className={cn("block", dark ? "text-sky" : "text-cobalt")}>{muted}</em>
        </>
      )}
    </h2>
  );

  if (center) {
    return (
      <Reveal className={cn("text-center", className)}>
        {heading}
        {lead && (
          <p className={cn("text-lead mx-auto mt-6 max-w-[34rem] [text-wrap:balance]", dark && "text-white/65")}>
            {lead}
          </p>
        )}
        {aside && <div className="mt-6 flex justify-center">{aside}</div>}
      </Reveal>
    );
  }

  return (
    <Reveal
      className={cn(
        "grid gap-x-16 gap-y-5",
        !stacked && "lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end",
        className,
      )}
    >
      {heading}
      {(lead || aside) && (
        <div className={cn(!stacked && "lg:pb-1.5")}>
          {lead && <p className={cn("text-lead max-w-[34rem]", dark && "text-white/65")}>{lead}</p>}
          {aside && <div className={cn(lead && "mt-6")}>{aside}</div>}
        </div>
      )}
    </Reveal>
  );
}
