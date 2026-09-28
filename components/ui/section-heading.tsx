import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/** One heading style for every landing section, so sizes and spacing stay consistent. */
export function SectionHeading({
  id,
  title,
  lead,
  align = "center",
  className,
}: {
  id: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <Reveal className={cn(centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl", className)}>
      <h2 id={id} className="text-display-m">
        {title}
      </h2>
      {lead && <p className={cn("text-lead mt-5", centered && "mx-auto max-w-2xl")}>{lead}</p>}
    </Reveal>
  );
}
