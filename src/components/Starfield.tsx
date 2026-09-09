import { useEffect, useMemo, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
  delay: number;
  dur: number;
  tw: boolean;
  c: string;
}

function makeStars(n: number, seed: number, rMin: number, rMax: number, colors: string[]): Star[] {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return Array.from({ length: n }, () => ({
    x: rand() * 1000,
    y: rand() * 1000,
    r: rMin + rand() * (rMax - rMin),
    o: 0.35 + rand() * 0.55,
    delay: rand() * 6,
    dur: 2.6 + rand() * 4.2,
    tw: rand() > 0.6,
    c: colors[Math.floor(rand() * colors.length)],
  }));
}

function Layer({
  stars,
  reducedMotion,
  groupRef,
}: {
  stars: Star[];
  reducedMotion: boolean;
  groupRef: React.MutableRefObject<SVGGElement | null>;
}) {
  return (
    <g ref={groupRef}>
      {stars.map((st, i) => (
        <circle
          key={i}
          cx={st.x}
          cy={st.y}
          r={st.r}
          fill={st.c}
          opacity={st.o}
          className={st.tw && !reducedMotion ? "star" : undefined}
          style={
            st.tw && !reducedMotion
              ? { animationDuration: `${st.dur}s`, animationDelay: `${st.delay}s` }
              : undefined
          }
        />
      ))}
    </g>
  );
}

export default function Starfield({ reducedMotion }: { reducedMotion: boolean }) {
  const far = useMemo(() => makeStars(72, 11, 0.5, 1.0, ["#c9d4f2"]), []);
  const mid = useMemo(() => makeStars(52, 29, 0.9, 1.5, ["#dbe4fa", "#ffe6bf"]), []);
  const near = useMemo(() => makeStars(26, 47, 1.4, 2.1, ["#e8eeff", "#ffd9a0", "#bcd0ff"]), []);

  const g1 = useRef<SVGGElement | null>(null);
  const g2 = useRef<SVGGElement | null>(null);
  const g3 = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      tgt.x = e.clientX / window.innerWidth - 0.5;
      tgt.y = e.clientY / window.innerHeight - 0.5;
    };
    const tick = () => {
      cur.x += (tgt.x - cur.x) * 0.045;
      cur.y += (tgt.y - cur.y) * 0.045;
      g1.current?.setAttribute("transform", `translate(${cur.x * -8} ${cur.y * -6})`);
      g2.current?.setAttribute("transform", `translate(${cur.x * -17} ${cur.y * -12})`);
      g3.current?.setAttribute("transform", `translate(${cur.x * -30} ${cur.y * -21})`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <Layer stars={far} reducedMotion={reducedMotion} groupRef={g1} />
      <Layer stars={mid} reducedMotion={reducedMotion} groupRef={g2} />
      <Layer stars={near} reducedMotion={reducedMotion} groupRef={g3} />
    </svg>
  );
}
