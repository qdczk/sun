import { useCallback, useEffect, useRef, useState } from "react";
import Starfield from "./components/Starfield";
import SolarSystem from "./components/SolarSystem";
import DetailPanel from "./components/DetailPanel";
import ControlDock from "./components/ControlDock";
import { bodyById } from "./data/bodies";

function usePrefersReducedMotion(): boolean {
  const [prm, setPrm] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrm(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrm(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return prm;
}

function formatElapsed(days: number): { main: string; sub: string } {
  const d = Math.floor(days);
  if (days < 365.25) return { main: `${d.toLocaleString()} 天`, sub: "地球日" };
  const y = days / 365.25;
  return {
    main: `${y >= 100 ? y.toFixed(0) : y.toFixed(1)} 年`,
    sub: `≈ ${d.toLocaleString()} 地球日`,
  };
}

const NEBULA_BG = [
  "radial-gradient(1100px 700px at 78% 16%, rgba(43,66,128,0.34), transparent 62%)",
  "radial-gradient(900px 620px at 12% 82%, rgba(122,58,40,0.2), transparent 66%)",
  "radial-gradient(720px 520px at 28% 18%, rgba(38,108,108,0.16), transparent 60%)",
  "radial-gradient(560px 420px at 90% 86%, rgba(88,60,140,0.14), transparent 64%)",
  "linear-gradient(180deg, #04070f 0%, #070d1e 52%, #04070f 100%)",
].join(", ");

export default function App() {
  const reducedMotion = usePrefersReducedMotion();

  const [days, setDays] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(20);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // 公转模拟主循环
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      setDays((d) => d + dt * speedRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // 快捷键：空格播放/暂停，Esc 关闭档案
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "Escape") {
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSelect = useCallback((id: string) => setSelectedId(id), []);
  const selectedBody = bodyById(selectedId);
  const elapsed = formatElapsed(days);

  return (
    <div className="relative h-dvh w-full select-none overflow-hidden bg-void font-body text-star">
      {/* 星云底色 */}
      <div className="absolute inset-0" style={{ backgroundImage: NEBULA_BG }} />

      {/* 星野（三层视差） */}
      <div className="absolute inset-0 z-0">
        <Starfield reducedMotion={reducedMotion} />
      </div>

      {/* 流星 */}
      <div className="shooting-star" style={{ top: "12%", right: "-4%", animationDelay: "2.5s" }} />
      <div className="shooting-star" style={{ top: "34%", right: "-8%", animationDelay: "8.5s", width: 120 }} />

      {/* 轨道主舞台 */}
      <div className="absolute inset-0 z-10 px-1 pb-[186px] pt-[96px] sm:px-3 md:pb-[150px] md:pt-[104px]">
        <SolarSystem
          days={days}
          selectedId={selectedId}
          showOrbits={showOrbits}
          showLabels={showLabels}
          reducedMotion={reducedMotion}
          onSelect={handleSelect}
        />
      </div>

      <div className="vignette pointer-events-none absolute inset-0 z-[15]" />

      {/* HUD 头部 */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 bg-gradient-to-b from-void/95 via-void/60 to-transparent px-4 pb-9 pt-3.5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-display text-[10px] font-bold tracking-[0.42em] text-solar">
                SOLAR ORRERY
              </span>
              <span className="h-px w-8 bg-solar/40" />
              <span className="text-[10px] tracking-[0.24em] text-dim">交互式天文教学演示</span>
            </div>
            <h1 className="mt-1 text-[22px] font-black leading-tight tracking-wide sm:text-[27px]">
              太阳系<span className="text-solar">轨道</span>观测站
            </h1>
            <p className="mt-0.5 hidden text-[11px] text-dim sm:block">
              太阳 · 八大行星 · 实时公转模拟
            </p>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-display text-[9px] font-bold tracking-[0.3em] text-faint">
              MISSION TIME · 已航行
            </div>
            <div className="font-display text-lg font-bold tabular-nums leading-tight text-glowgold sm:text-[22px]">
              {elapsed.main}
            </div>
            <div className="text-[10px] tabular-nums text-dim">{elapsed.sub}</div>
            <div className="mt-1 flex items-center justify-end gap-1.5 text-[11px] text-dim">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  playing
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] motion-safe:animate-pulse"
                    : "bg-slate-500"
                }`}
              />
              {playing ? "公转进行中" : "已暂停"}
            </div>
          </div>
        </div>
      </header>

      {/* 引导提示 */}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-[196px] z-20 flex justify-center transition-opacity duration-700 md:bottom-[158px] ${
          selectedId ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-center gap-2.5 rounded-full border border-line bg-panel/85 px-4 py-2 text-xs text-dim backdrop-blur-sm">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="text-solar">
            <circle cx="7" cy="7" r="2.2" fill="currentColor" />
            <circle cx="7" cy="7" r="5.6" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" className="motion-safe:animate-pulse" />
          </svg>
          点击任意行星或太阳，建立观测档案
        </div>
      </div>

      <ControlDock
        playing={playing}
        onTogglePlay={() => setPlaying((p) => !p)}
        speed={speed}
        onSpeed={setSpeed}
        showOrbits={showOrbits}
        onToggleOrbits={() => setShowOrbits((v) => !v)}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels((v) => !v)}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      <DetailPanel body={selectedBody} onClose={() => setSelectedId(null)} />

      {/* 颗粒噪点 */}
      <div className="noise-overlay pointer-events-none absolute inset-0 z-[70]" />
    </div>
  );
}
