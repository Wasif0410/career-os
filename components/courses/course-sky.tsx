"use client";

import dynamic from "next/dynamic";

// The shared sky reads the OS motion preference on first render. Mount this
// decorative layer on the client so reduced-motion users get matching markup.
const Starfield = dynamic(() => import("@/components/brand/starfield").then((module) => module.Starfield), {
  ssr: false,
});

export function CourseSky({ seed, count }: { seed: number; count: number }) {
  return <Starfield seed={seed} count={count} />;
}
