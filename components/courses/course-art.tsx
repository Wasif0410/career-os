/*
 * Cover illustrations, one per course, drawn as line work in the book's ink
 * with a single accent. Each picture is the course's idea, not decoration:
 * a route across a star chart, a ruled page, a network, a contribution graph,
 * a drafted cube, orbits leaving a square. Coordinates are fixed, so the
 * server and the browser draw identical markup.
 */

const r2 = (n: number) => Math.round(n * 100) / 100;

/** A four-point star centred on (x, y). */
function sparkle(x: number, y: number, s: number) {
  return `M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`;
}

function StarChart({ accent }: { accent: string }) {
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const a = (i * 5 * Math.PI) / 180;
    const outer = i % 9 === 0 ? 112 : 105;
    return [150 + Math.cos(a) * 100, 120 + Math.sin(a) * 100, 150 + Math.cos(a) * outer, 120 + Math.sin(a) * outer];
  });
  const route = [
    [70, 178],
    [112, 152],
    [146, 128],
    [180, 98],
  ];
  const dust = [
    [40, 40],
    [68, 22],
    [246, 30],
    [270, 92],
    [262, 186],
    [226, 214],
    [96, 214],
    [30, 126],
    [118, 70],
    [196, 160],
    [160, 192],
    [84, 108],
  ];
  return (
    <>
      <g fill="none" stroke="currentColor" strokeWidth="0.9">
        <circle cx="150" cy="120" r="100" opacity="0.45" />
        <circle cx="150" cy="120" r="66" opacity="0.35" strokeDasharray="1.5 4" />
        <circle cx="150" cy="120" r="32" opacity="0.3" />
        {ticks.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={r2(x1)} y1={r2(y1)} x2={r2(x2)} y2={r2(y2)} opacity={i % 9 === 0 ? 0.7 : 0.35} />
        ))}
        <polyline points={route.map((p) => p.join(",")).join(" ")} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="180" y1="98" x2="214" y2="66" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
        <circle cx="216" cy="64" r="12" stroke={accent} strokeWidth="1.3" />
      </g>
      {dust.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.4 : 0.9} fill="currentColor" opacity="0.55" />
      ))}
      {route.slice(1).map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.6" fill="currentColor" />
      ))}
      <circle cx="70" cy="178" r="4.5" fill="currentColor" />
      <path d={sparkle(216, 64, 9)} fill={accent} />
    </>
  );
}

function RuledPage({ accent }: { accent: string }) {
  const rules = Array.from({ length: 14 }, (_, i) => 16 + i * 16);
  // y, length of the line of "text", and whether it starts with a bullet.
  const text: [number, number, boolean][] = [
    [64, 178, true],
    [80, 142, false],
    [112, 190, true],
    [128, 126, false],
    [160, 164, true],
    [176, 78, false],
  ];
  return (
    <>
      <g stroke="currentColor" strokeWidth="0.8" opacity="0.3">
        {rules.map((y) => (
          <line key={y} x1="18" y1={y} x2="284" y2={y} />
        ))}
      </g>
      <g stroke={accent} strokeWidth="0.9" opacity="0.8">
        <line x1="44" y1="6" x2="44" y2="234" />
        <line x1="47.5" y1="6" x2="47.5" y2="234" />
      </g>
      <rect x="64" y="104" width="214" height="16" fill={accent} opacity="0.45" />
      <g stroke="currentColor" strokeLinecap="round">
        <line x1="62" y1="31" x2="176" y2="31" strokeWidth="6" />
        {text.map(([y, length]) => (
          <line key={y} x1="74" y1={y - 6} x2={74 + length} y2={y - 6} strokeWidth="3.4" opacity="0.85" />
        ))}
      </g>
      {text
        .filter(([, , bullet]) => bullet)
        .map(([y]) => (
          <rect key={y} x="60" y={y - 8.5} width="5" height="5" fill="currentColor" />
        ))}
      <path d="M262 196l7 7 13-15" fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
    </>
  );
}

function Network({ accent }: { accent: string }) {
  const you = [150, 120];
  const near = [
    [96, 92],
    [206, 86],
    [214, 156],
    [112, 170],
    [150, 58],
    [172, 190],
  ];
  const far = [
    [46, 62],
    [56, 140],
    [252, 46],
    [270, 118],
    [248, 206],
    [62, 212],
    [148, 226],
    [198, 20],
    [100, 22],
  ];
  const links = [
    [0, 0],
    [0, 1],
    [0, 8],
    [4, 8],
    [4, 7],
    [1, 2],
    [1, 3],
    [2, 3],
    [2, 4],
    [5, 6],
    [3, 5],
    [3, 1],
  ];
  return (
    <>
      <g stroke="currentColor" fill="none">
        {near.map(([x, y]) => (
          <line key={`y${x}`} x1={you[0]} y1={you[1]} x2={x} y2={y} strokeWidth="1.1" opacity="0.75" />
        ))}
        {links.map(([a, b], i) => (
          <line key={i} x1={near[a][0]} y1={near[a][1]} x2={far[b][0]} y2={far[b][1]} strokeWidth="0.8" opacity="0.4" />
        ))}
        <path d="M96 92L150 58L206 86M112 170L172 190L214 156" strokeWidth="0.8" opacity="0.25" />
        <circle cx={you[0]} cy={you[1]} r="17" stroke={accent} strokeWidth="1.4" />
      </g>
      {far.map(([x, y]) => (
        <circle key={`f${x}`} cx={x} cy={y} r="2.8" fill="currentColor" opacity="0.7" />
      ))}
      {near.map(([x, y], i) => (
        <circle key={`n${x}`} cx={x} cy={y} r="5" fill={i === 1 || i === 3 ? accent : "currentColor"} />
      ))}
      <circle cx={you[0]} cy={you[1]} r="9" fill="currentColor" />
    </>
  );
}

// A year of activity that builds over time: sparse on the left, steady on the right.
const contributions = (() => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const cols = 17;
  return Array.from({ length: cols * 7 }, (_, i) => {
    const col = Math.floor(i / 7);
    const row = i % 7;
    const level = Math.max(0, Math.min(4, Math.floor((rand() * 0.75 + (col / (cols - 1)) * 0.85) * 4.6 - 1.4)));
    return { x: 16 + col * 16, y: 26 + row * 16, level };
  });
})();

function ContributionGraph({ accent }: { accent: string }) {
  const opacity = [0.1, 0.32, 0.55, 0.78, 1];
  return (
    <>
      {contributions.map(({ x, y, level }) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="12"
          height="12"
          rx="2"
          fill={level ? accent : "currentColor"}
          opacity={opacity[level]}
        />
      ))}
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <line x1="20" y1="200" x2="282" y2="200" opacity="0.55" />
        <path d="M94 200C108 200 108 172 124 172H170C186 172 186 200 200 200" stroke={accent} />
      </g>
      {[40, 94, 200].map((x) => (
        <circle key={x} cx={x} cy="200" r="4.5" fill="var(--cloth)" stroke="currentColor" strokeWidth="1.4" />
      ))}
      <circle cx="146" cy="172" r="4.5" fill="var(--cloth)" stroke={accent} strokeWidth="1.4" />
      <circle cx="262" cy="200" r="5.5" fill={accent} />
    </>
  );
}

function Blueprint({ accent }: { accent: string }) {
  const grid = Array.from({ length: 15 }, (_, i) => 10 + i * 20);
  const rows = Array.from({ length: 12 }, (_, i) => 10 + i * 20);
  return (
    <>
      <g stroke="currentColor" strokeWidth="0.6" opacity="0.16">
        {grid.map((x) => (
          <line key={`x${x}`} x1={x} y1="0" x2={x} y2="240" />
        ))}
        {rows.map((y) => (
          <line key={`y${y}`} x1="0" y1={y} x2="300" y2={y} />
        ))}
      </g>
      <path d="M150 56L203.7 87L150 118L96.3 87Z" fill={accent} opacity="0.22" />
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M150 56L203.7 87V149L150 180L96.3 149V87Z" />
        <path d="M96.3 87L150 118L203.7 87M150 118V180" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.8">
        <path d="M72 87V149M66 87H78M66 149H78" />
        <path d="M72 93l-3 6h6zM72 143l-3-6h6z" fill="currentColor" stroke="none" />
        <path d="M150 196L203.7 165M146 189l8 14M199.7 158l8 14" />
      </g>
      <g fill="none" stroke={accent} strokeWidth="1.1">
        <circle cx="244" cy="44" r="10" />
        <path d="M244 28V60M228 44H260" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.6">
        <circle cx="48" cy="206" r="7" />
        <path d="M48 195V217M37 206H59" />
      </g>
    </>
  );
}

function Orbits({ accent }: { accent: string }) {
  const orbits = [
    { rx: 62, ry: 24, tilt: -16, at: 205, size: 4.5, fill: "currentColor" },
    { rx: 104, ry: 44, tilt: 12, at: 330, size: 7, fill: accent },
    { rx: 136, ry: 76, tilt: -30, at: 120, size: 4, fill: "currentColor" },
  ];
  const point = (rx: number, ry: number, tilt: number, at: number) => {
    const t = (at * Math.PI) / 180;
    const p = (tilt * Math.PI) / 180;
    return [
      r2(150 + rx * Math.cos(t) * Math.cos(p) - ry * Math.sin(t) * Math.sin(p)),
      r2(120 + rx * Math.cos(t) * Math.sin(p) + ry * Math.sin(t) * Math.cos(p)),
    ];
  };
  return (
    <>
      <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55">
        {orbits.map(({ rx, ry, tilt }) => (
          <ellipse key={rx} cx="150" cy="120" rx={rx} ry={ry} transform={`rotate(${tilt} 150 120)`} />
        ))}
      </g>
      <rect x="133" y="103" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.6" />
      {orbits.map(({ rx, ry, tilt, at, size, fill }) => {
        const [x, y] = point(rx, ry, tilt, at);
        return <circle key={rx} cx={x} cy={y} r={size} fill={fill} />;
      })}
      {[
        [34, 30],
        [268, 36],
        [282, 200],
        [28, 214],
        [210, 222],
        [86, 18],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="1.2" fill="currentColor" opacity="0.6" />
      ))}
    </>
  );
}

const art: Record<string, (props: { accent: string }) => React.ReactNode> = {
  "career-direction": StarChart,
  resume: RuledPage,
  linkedin: Network,
  github: ContributionGraph,
  projects: Blueprint,
  "beyond-tech": Orbits,
};

export function CourseArt({ slug, accent, className }: { slug: string; accent: string; className?: string }) {
  const Art = art[slug] ?? StarChart;
  return (
    <svg viewBox="0 0 300 240" className={className} aria-hidden>
      <Art accent={accent} />
    </svg>
  );
}
