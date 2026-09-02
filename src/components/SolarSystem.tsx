import { useMemo, useState } from "react";
import { PLANETS, SUN, type CelestialBody } from "../data/bodies";

const TAU = Math.PI * 2;
const CX = 400;
const CY = 312;
const K = 0.72; // 纵向压缩，营造轻微的透视感

interface Props {
  days: number;
  selectedId: string | null;
  showOrbits: boolean;
  showLabels: boolean;
  reducedMotion: boolean;
  onSelect: (id: string) => void;
}

function positionOf(b: CelestialBody, days: number): [number, number] {
  if (b.orbitRx === 0) return [CX, CY];
  const ang = b.startAngle - (days / b.periodDays) * TAU;
  return [CX + Math.cos(ang) * b.orbitRx, CY + Math.sin(ang) * b.orbitRx * K];
}

/** 土星光环前半弧（覆盖在行星上方的那一半） */
function ringFront(px: number, py: number, R: number, S: number, deg: number): string {
  const a = (deg * Math.PI) / 180;
  const pt = (phi: number): [number, number] => [
    px + R * Math.cos(phi) * Math.cos(a) - S * Math.sin(phi) * Math.sin(a),
    py + R * Math.cos(phi) * Math.sin(a) + S * Math.sin(phi) * Math.cos(a),
  ];
  const [x0, y0] = pt(0);
  const [x1, y1] = pt(Math.PI);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${S} ${deg} 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

export default function SolarSystem({
  days,
  selectedId,
  showOrbits,
  showLabels,
  reducedMotion,
  onSelect,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const belt = useMemo(() => {
    let s = 20260207;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    return Array.from({ length: 150 }, () => {
      const r = 158 + rand() * 40;
      const a = rand() * TAU;
      return {
        x: CX + Math.cos(a) * r,
        y: CY + Math.sin(a) * r * K,
        r: 0.5 + rand() * 0.95,
        o: 0.2 + rand() * 0.42,
      };
    });
  }, []);

  const selected = selectedId !== null && selectedId !== "sun";
  const selBody = selected ? PLANETS.find((p) => p.id === selectedId) : undefined;
  const selPos = selBody ? positionOf(selBody, days) : null;

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 800 640"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="太阳系轨道模拟图：太阳与八大行星"
    >
      <defs>
        {PLANETS.map((b) => (
          <radialGradient key={b.id} id={`grad-${b.id}`} cx="36%" cy="30%" r="80%">
            <stop offset="0%" stopColor={b.colorLight} />
            <stop offset="52%" stopColor={b.color} />
            <stop offset="100%" stopColor={b.colorDeep} />
          </radialGradient>
        ))}
        <radialGradient id="grad-sun" cx="42%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#fff7dc" />
          <stop offset="45%" stopColor="#ffd479" />
          <stop offset="100%" stopColor="#ff9330" />
        </radialGradient>
        <radialGradient id="sun-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,196,96,0.5)" />
          <stop offset="42%" stopColor="rgba(255,150,60,0.16)" />
          <stop offset="78%" stopColor="rgba(255,120,50,0.04)" />
          <stop offset="100%" stopColor="rgba(255,120,50,0)" />
        </radialGradient>
      </defs>

      {/* 柯伊伯带（示意） */}
      <ellipse
        cx={CX}
        cy={CY}
        rx={374}
        ry={374 * K}
        fill="none"
        stroke="#3a4a77"
        strokeWidth="1"
        strokeDasharray="1 9"
        opacity="0.35"
      />

      {/* 轨道线 */}
      {showOrbits &&
        PLANETS.map((b) => {
          const active = b.id === selectedId || b.id === hoveredId;
          return (
            <ellipse
              key={b.id}
              className="orbit-path"
              cx={CX}
              cy={CY}
              rx={b.orbitRx}
              ry={b.orbitRx * K}
              fill="none"
              stroke={b.id === selectedId ? "#e9b45f" : "#2c3d6b"}
              strokeWidth={b.id === selectedId ? 1.4 : 1}
              opacity={b.id === selectedId ? 0.95 : active ? 0.85 : 0.6}
            />
          );
        })}

      {/* 小行星带 */}
      <g className={reducedMotion ? undefined : "belt-spin"} opacity="0.85">
        {belt.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#8d99bd" opacity={d.o} />
        ))}
      </g>

      {/* 选中行星的日-行连线（测距感） */}
      {selPos && (
        <line
          x1={CX}
          y1={CY}
          x2={selPos[0]}
          y2={selPos[1]}
          stroke="#e9b45f"
          strokeWidth="1"
          strokeDasharray="2 7"
          opacity="0.55"
        />
      )}

      {/* 太阳 */}
      <g
        className="planet-node"
        role="button"
        tabIndex={0}
        aria-label="太阳 SUN"
        onClick={() => onSelect("sun")}
        onKeyDown={(e) => e.key === "Enter" && onSelect("sun")}
        onMouseEnter={() => setHoveredId("sun")}
        onMouseLeave={() => setHoveredId(null)}
      >
        <circle cx={CX} cy={CY} r={44} fill="transparent" />
        <circle
          cx={CX}
          cy={CY}
          r={82}
          fill="url(#sun-halo)"
          className={reducedMotion ? undefined : "sun-pulse"}
        />
        {selectedId === "sun" && (
          <circle
            className={reducedMotion ? undefined : "dash-spin"}
            cx={CX}
            cy={CY}
            r={42}
            fill="none"
            stroke="#ffc46b"
            strokeWidth="1.3"
            strokeDasharray="3 7"
            strokeLinecap="round"
            opacity="0.9"
          />
        )}
        <circle cx={CX} cy={CY} r={SUN.radius} fill="url(#grad-sun)" />
        <circle cx={CX} cy={CY} r={SUN.radius} fill="none" stroke="#ffe9b8" strokeWidth="0.8" opacity="0.6" />
        {showLabels && (
          <text
            className="body-label"
            x={CX}
            y={CY + SUN.radius + 17}
            textAnchor="middle"
            fontSize="11.5"
            fontWeight={selectedId === "sun" ? 700 : 500}
            fill={selectedId === "sun" || hoveredId === "sun" ? "#ffd98a" : "#8b93b8"}
          >
            太阳
          </text>
        )}
      </g>

      {/* 八大行星 */}
      {PLANETS.map((b) => {
        const [px, py] = positionOf(b, days);
        const active = b.id === selectedId || b.id === hoveredId;
        const R = b.radius;
        const bandCount = b.bands ?? 0;

        return (
          <g
            key={b.id}
            className={reducedMotion ? "cursor-pointer" : "planet-node"}
            role="button"
            tabIndex={0}
            aria-label={`${b.name} ${b.english}`}
            onClick={() => onSelect(b.id)}
            onKeyDown={(e) => e.key === "Enter" && onSelect(b.id)}
            onMouseEnter={() => setHoveredId(b.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {b.id === selectedId && (
              <circle
                className={reducedMotion ? undefined : "dash-spin"}
                cx={px}
                cy={py}
                r={R + (b.ring ? 26 : 8)}
                fill="none"
                stroke="#ffc46b"
                strokeWidth="1.2"
                strokeDasharray="3 7"
                strokeLinecap="round"
                opacity="0.9"
              />
            )}

            {/* 点击热区 */}
            <circle cx={px} cy={py} r={R + 11} fill="transparent" />

            {/* 土星光环（后半，先画） */}
            {b.ring && (
              <g>
                <ellipse
                  cx={px}
                  cy={py}
                  rx={R * 2.05}
                  ry={R * 0.62}
                  transform={`rotate(-16 ${px} ${py})`}
                  fill="none"
                  stroke="#d9c08c"
                  strokeWidth="2.8"
                  opacity="0.65"
                />
                <ellipse
                  cx={px}
                  cy={py}
                  rx={R * 1.62}
                  ry={R * 0.47}
                  transform={`rotate(-16 ${px} ${py})`}
                  fill="none"
                  stroke="#c8ac74"
                  strokeWidth="1.1"
                  opacity="0.45"
                />
              </g>
            )}

            {/* 行星球体 */}
            <circle cx={px} cy={py} r={R} fill={`url(#grad-${b.id})`} />
            <circle cx={px} cy={py} r={R} fill="none" stroke={b.colorDeep} strokeWidth="0.8" opacity="0.85" />

            {/* 木星 / 土星 云带 */}
            {bandCount > 0 && (
              <g clipPath={`url(#clip-${b.id})`} opacity="0.32">
                {Array.from({ length: bandCount }, (_, i) => {
                  const off = (i - (bandCount - 1) / 2) * R * 0.5;
                  return (
                    <line
                      key={i}
                      x1={px - R}
                      y1={py + off}
                      x2={px + R}
                      y2={py + off}
                      stroke={b.colorDeep}
                      strokeWidth={R * 0.16}
                    />
                  );
                })}
              </g>
            )}
            {b.bands && (
              <clipPath id={`clip-${b.id}`}>
                <circle cx={px} cy={py} r={R} />
              </clipPath>
            )}

            {/* 土星光环（前半，覆盖球体） */}
            {b.ring && (
              <g>
                <path
                  d={ringFront(px, py, R * 2.05, R * 0.62, -16)}
                  fill="none"
                  stroke="#e3cd9a"
                  strokeWidth="2.8"
                  opacity="0.85"
                />
                <path
                  d={ringFront(px, py, R * 1.62, R * 0.47, -16)}
                  fill="none"
                  stroke="#d4ba82"
                  strokeWidth="1.1"
                  opacity="0.6"
                />
              </g>
            )}

            {/* 地球的月球 */}
            {b.hasMoon &&
              (() => {
                const ma = 2.1 - (days / 27.3) * TAU;
                const mx = px + Math.cos(ma) * 15;
                const my = py + Math.sin(ma) * 15 * K;
                return (
                  <g>
                    <ellipse
                      cx={px}
                      cy={py}
                      rx={15}
                      ry={15 * K}
                      fill="none"
                      stroke="#3a4a77"
                      strokeWidth="0.7"
                      strokeDasharray="2 3"
                      opacity="0.55"
                    />
                    <circle cx={mx} cy={my} r={1.8} fill="#c9d2e8" />
                  </g>
                );
              })()}

            {/* 名称标签 */}
            {showLabels && (
              <g>
                <text
                  className="body-label"
                  x={px}
                  y={py + R + (b.ring ? 15 : 15)}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={active ? 700 : 500}
                  fill={active ? "#ffd98a" : "#7f8db4"}
                >
                  {b.name}
                </text>
                {b.id === selectedId && (
                  <text
                    className="body-label"
                    x={px}
                    y={py + R + 26}
                    textAnchor="middle"
                    fontSize="6.5"
                    letterSpacing="2.4"
                    fill="#8a97bd"
                  >
                    {b.english}
                  </text>
                )}
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
