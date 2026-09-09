import type { CSSProperties } from "react";
import { ALL_BODIES } from "../data/bodies";

const PRESETS = [2, 20, 90, 365];
const MIN_SPEED = 0.5;
const MAX_SPEED = 500;

const speedToSlider = (speed: number) =>
  Math.round((1000 * Math.log(speed / MIN_SPEED)) / Math.log(MAX_SPEED / MIN_SPEED));
const sliderToSpeed = (t: number) => MIN_SPEED * Math.pow(MAX_SPEED / MIN_SPEED, t / 1000);

interface Props {
  playing: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSpeed: (v: number) => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function Toggle({
  on,
  label,
  onClick,
}: {
  on: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors
        ${on ? "border-solar/70 bg-solar/10 text-glowgold" : "border-line text-dim hover:border-faint hover:text-star"}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full transition-colors ${on ? "bg-solar shadow-[0_0_6px_rgba(255,181,71,0.9)]" : "bg-faint"}`}
      />
      {label}
    </button>
  );
}

export default function ControlDock({
  playing,
  onTogglePlay,
  speed,
  onSpeed,
  showOrbits,
  onToggleOrbits,
  showLabels,
  onToggleLabels,
  selectedId,
  onSelect,
}: Props) {
  const t = speedToSlider(speed);
  const speedLabel = speed >= 10 ? Math.round(speed).toLocaleString() : speed.toFixed(1);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3">
      <div className="pointer-events-auto w-full max-w-[1080px] overflow-hidden rounded-xl border border-line bg-panel/95 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-md">
        {/* 天体速览 */}
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto border-b border-line2 px-3 py-2">
          <span className="mr-1 shrink-0 font-display text-[9px] font-bold tracking-[0.28em] text-faint">
            BODIES
          </span>
          {ALL_BODIES.map((b) => {
            const active = b.id === selectedId;
            return (
              <button
                key={b.id}
                onClick={() => onSelect(b.id)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs transition-all
                  ${active ? "border-solar/70 bg-solar/10 text-star" : "border-transparent text-dim hover:border-line hover:text-star"}`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: b.color, boxShadow: active ? `0 0 10px ${b.color}` : `0 0 6px ${b.color}55` }}
                />
                {b.name}
              </button>
            );
          })}
        </div>

        {/* 控制区 */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 px-4 py-3">
          <button
            onClick={onTogglePlay}
            aria-label={playing ? "暂停公转模拟" : "播放公转模拟"}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-solar text-[#241100] shadow-[0_0_26px_rgba(255,181,71,0.35)] transition hover:scale-105 hover:brightness-110 active:scale-95"
          >
            {playing ? (
              <svg width="15" height="16" viewBox="0 0 15 16" fill="currentColor" aria-hidden="true">
                <rect x="1.5" y="1" width="4.4" height="14" rx="1.2" />
                <rect x="9.1" y="1" width="4.4" height="14" rx="1.2" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M3.5 1.9a1 1 0 0 1 1.53-.85l9.2 6.1a1 1 0 0 1 0 1.7l-9.2 6.1a1 1 0 0 1-1.53-.85V1.9Z" />
              </svg>
            )}
          </button>

          {/* 速度 */}
          <div className="min-w-[230px] max-w-[430px] flex-1">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-[10px] tracking-[0.22em] text-dim">模拟速率</span>
              <span className="font-display text-[11px] font-bold text-solar">
                {speedLabel} <span className="text-dim">天 / 秒</span>
              </span>
            </div>
            <input
              type="range"
              className="range-solar w-full"
              min={0}
              max={1000}
              value={t}
              aria-label="调节模拟速率"
              onChange={(e) => {
                const v = sliderToSpeed(Number(e.target.value));
                onSpeed(v >= 10 ? Math.round(v) : Math.round(v * 10) / 10);
              }}
              style={{ "--fill": `${t / 10}%` } as CSSProperties}
            />
            <div className="mt-1.5 flex items-center gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => onSpeed(p)}
                  className={`rounded border px-2 py-0.5 font-display text-[10px] transition-colors
                    ${speed === p ? "border-solar/80 bg-solar/15 text-glowgold" : "border-line text-dim hover:border-faint hover:text-star"}`}
                >
                  {p}
                </button>
              ))}
              <span className="ml-1 text-[10px] text-faint">1 秒 ≈ N 地球日</span>
            </div>
          </div>

          {/* 图层开关 */}
          <div className="flex items-center gap-2">
            <Toggle on={showOrbits} label="轨道线" onClick={onToggleOrbits} />
            <Toggle on={showLabels} label="名称标签" onClick={onToggleLabels} />
          </div>

          <div className="ml-auto hidden items-center gap-2 text-[10px] text-faint lg:flex">
            <kbd className="rounded border border-line px-1.5 py-0.5 font-display text-[9px]">SPACE</kbd>
            播放 / 暂停
            <kbd className="ml-2 rounded border border-line px-1.5 py-0.5 font-display text-[9px]">ESC</kbd>
            关闭档案
          </div>
        </div>
      </div>
    </div>
  );
}
