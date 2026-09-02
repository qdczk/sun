import type { CelestialBody } from "../data/bodies";

const EARTH_D = 12756;

interface Props {
  body: CelestialBody | null;
  onClose: () => void;
}

export default function DetailPanel({ body, onClose }: Props) {
  const open = body !== null;
  const scale = body ? Math.max(body.diameterKm, EARTH_D) : 1;
  const pct = body ? Math.max((body.diameterKm / scale) * 100, 1.4) : 0;
  const earthPct = body ? Math.max((EARTH_D / scale) * 100, 1.4) : 0;
  const ratio = body ? body.diameterKm / EARTH_D : 1;

  return (
    <aside
      aria-hidden={!open}
      className={`fixed z-50 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]
        inset-x-3 bottom-3 max-h-[62vh]
        sm:inset-x-auto sm:right-5 sm:top-24 sm:bottom-6 sm:w-[362px] sm:max-h-none
        ${open ? "translate-x-0 translate-y-0" : "translate-y-[130%] sm:translate-y-0 sm:translate-x-[120%]"}`}
    >
      {body && (
        <div
          key={body.id}
          className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-panel/95 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-md"
        >
          {/* 头部 */}
          <div className="relative shrink-0 border-b border-line2 px-5 pb-4 pt-5">
            <button
              onClick={onClose}
              aria-label="关闭详情面板"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md border border-line text-dim transition hover:border-solar/60 hover:text-star"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <div className="panel-item flex items-center gap-2" style={{ animationDelay: "0.02s" }}>
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: body.color, boxShadow: `0 0 12px ${body.color}99` }}
              />
              <span className="rounded-full border border-line px-2 py-0.5 text-[10px] tracking-wider text-dim">
                {body.badge}
              </span>
            </div>

            <h2 className="panel-item mt-2.5 text-[32px] font-black leading-none tracking-wide text-star" style={{ animationDelay: "0.06s" }}>
              {body.name}
            </h2>
            <div
              className="panel-item mt-1.5 font-display text-[10px] font-bold tracking-[0.42em] text-solar"
              style={{ animationDelay: "0.1s" }}
            >
              {body.english}
            </div>
          </div>

          {/* 滚动内容 */}
          <div className="panel-scroll grow overflow-y-auto px-5 py-4">
            <p
              className="panel-item text-[13px] leading-relaxed text-[#b9c4e2]"
              style={{ animationDelay: "0.14s" }}
            >
              {body.intro}
            </p>

            {/* 数据网格 */}
            <div className="panel-item mt-4 grid grid-cols-2 gap-2" style={{ animationDelay: "0.18s" }}>
              {body.stats.map((s) => (
                <div key={s.label} className="rounded-md border border-line2 bg-cell px-3 py-2.5 transition-colors hover:border-line">
                  <div className="text-[10px] tracking-wider text-dim">{s.label}</div>
                  <div className="mt-0.5 break-words font-display text-[13px] font-bold leading-snug text-star">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* 直径对比 */}
            <div className="panel-item mt-4" style={{ animationDelay: "0.24s" }}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-[11px] font-bold tracking-wider text-dim">直径对比</span>
                <span className="font-display text-[10px] text-solar">
                  {ratio >= 1 ? `≈ 地球的 ${ratio >= 10 ? ratio.toFixed(0) : ratio.toFixed(1)} 倍` : `≈ 地球的 ${(ratio * 100).toFixed(0)}%`}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="mb-1 flex justify-between text-[10px] text-dim">
                    <span style={{ color: body.color }}>{body.name}</span>
                    <span className="font-display">{body.diameterKm.toLocaleString()} km</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#16203e]">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${body.colorDeep}, ${body.colorLight})`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-[10px] text-dim">
                    <span>地球（参照）</span>
                    <span className="font-display">12,756 km</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#16203e]">
                    <div
                      className="h-full rounded-full bg-[#6f7fae] transition-[width] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                      style={{ width: `${earthPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 趣味事实 */}
            <div
              className="panel-item mt-4 rounded-md border-l-2 border-solar bg-[#131a33] p-3"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="mb-1 font-display text-[9px] font-bold tracking-[0.3em] text-solar">
                DID YOU KNOW · 趣味事实
              </div>
              <p className="text-[12.5px] leading-relaxed text-[#cdd6ee]">{body.fact}</p>
            </div>

            <p className="panel-item mt-4 pb-2 text-[10px] leading-relaxed text-faint" style={{ animationDelay: "0.34s" }}>
              * 数据为近似均值，参考 NASA 行星事实表。演示中的天体尺寸与轨道间距经过压缩处理，并非真实比例。
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
