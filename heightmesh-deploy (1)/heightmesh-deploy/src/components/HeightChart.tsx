'use client';

import { useMemo } from 'react';
import {
  Character,
  computeRulerMax,
  computeStep,
  computeFtStep,
  cmToFtIn,
  formatMetric,
  formatImperial,
  CM_PER_FOOT,
  silhouetteSVG,
} from '@/lib/height-data';

interface Props {
  characters: Character[];
  zoom: number;
  editMode: boolean;
  onRemove: (id: number) => void;
}

const CANVAS_USABLE_PX = 480;
const FLOOR_PX = 80;
const TOP_PAD = 56;
const MIN_HEIGHT = 540;

export default function HeightChart({ characters, zoom, editMode, onRemove }: Props) {
  const maxCm = useMemo(
    () => computeRulerMax(characters.length ? Math.max(...characters.map(c => c.height)) : 0),
    [characters],
  );
  const step = useMemo(() => computeStep(maxCm), [maxCm]);
  const ftStep = useMemo(() => computeFtStep(maxCm), [maxCm]);
  const pxPerCm = (CANVAS_USABLE_PX * zoom) / maxCm;
  const rulerHeight = maxCm * pxPerCm;
  const innerH = Math.max(MIN_HEIGHT, rulerHeight + FLOOR_PX + TOP_PAD);

  // Generate ruler ticks
  const cmTicks: number[] = [];
  for (let v = 0; v <= maxCm + 0.001; v += step) cmTicks.push(v);
  const ftTicks: number[] = [];
  const maxFt = maxCm / CM_PER_FOOT;
  for (let ft = 0; ft <= maxFt + 0.001; ft += ftStep) ftTicks.push(ft);

  const scaleLabel = maxCm >= 1000 ? `${(maxCm / 100).toFixed(0)} m` : `${maxCm.toFixed(0)} cm`;

  return (
    <div
      id="chartCard"
      className="relative border overflow-hidden rounded-xl"
      style={{ background: 'var(--hm-surface-container-lowest)', borderColor: 'var(--hm-outline-variant)' }}
    >
      {/* Top toolbar */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5">
        <span className="text-[10px] mr-1 hidden sm:inline label-sm">Zoom</span>
        <span className="text-[10px] tnum" style={{ color: 'var(--hm-on-surface-variant)' }}>{Math.round(zoom * 100)}%</span>
      </div>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 text-[11px] font-semibold tnum hidden sm:block" style={{ color: 'var(--hm-on-surface-variant)' }}>
        Scale: 0 – {scaleLabel}
      </div>

      {/* Canvas scroll area */}
      <div
        className="overflow-auto scrollbar-thin"
        style={{ height: '70vh', minHeight: 540 }}
      >
        <div id="canvasInner" className="relative hm-chart-grid" style={{ height: innerH, minWidth: '100%', background: 'var(--hm-surface-container-lowest)' }}>
          {/* Grid lines — horizontal measurement references at every 10cm/6in */}
          <div
            className="absolute left-20 right-20 pointer-events-none"
            style={{ bottom: FLOOR_PX, height: rulerHeight }}
          >
            {cmTicks.map((v, i) => {
              const y = (maxCm - v) * pxPerCm;
              const isMajor = i % 5 === 0;
              return (
                <div
                  key={`g-${i}`}
                  className="absolute left-0 right-0 h-px"
                  style={{ top: y, background: isMajor ? 'rgba(72, 125, 151, 0.12)' : 'rgba(138, 146, 151, 0.05)' }}
                />
              );
            })}
          </div>

          {/* Left ruler (cm / m) — HeightMesh primary #487d97 for ticks */}
          <div
            className="absolute left-0 w-20 z-10 border-r"
            style={{ bottom: FLOOR_PX, height: rulerHeight, background: 'var(--hm-surface-container-low)', borderColor: 'var(--hm-outline-variant)' }}
          >
            <div className="absolute right-1 top-0 bottom-0 w-px" style={{ background: 'var(--hm-outline-variant)' }} />
            {cmTicks.map((v, i) => {
              const y = (maxCm - v) * pxPerCm;
              const isMajor = i % 5 === 0;
              const tickW = isMajor ? 14 : 7;
              const labelTxt = v >= 1000 ? `${(v / 100).toFixed(step < 100 ? 1 : 0)} m` : `${v.toFixed(0)} cm`;
              return (
                <div key={`l-${i}`} className="absolute right-1" style={{ top: y }}>
                  <div style={{ width: tickW, height: 1, background: isMajor ? 'var(--hm-primary)' : 'var(--hm-outline-variant)' }} />
                  {isMajor && (
                    <span className="absolute right-5 -translate-y-1/2 text-[10px] font-bold tnum whitespace-nowrap" style={{ color: 'var(--hm-on-surface)' }}>
                      {labelTxt}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right ruler (ft / in) */}
          <div
            className="absolute right-0 w-20 z-10 border-l"
            style={{ bottom: FLOOR_PX, height: rulerHeight, background: 'var(--hm-surface-container-low)', borderColor: 'var(--hm-outline-variant)' }}
          >
            <div className="absolute left-1 top-0 bottom-0 w-px" style={{ background: 'var(--hm-outline-variant)' }} />
            {ftTicks.map((ft, i) => {
              const cmVal = ft * CM_PER_FOOT;
              const y = (maxCm - cmVal) * pxPerCm;
              const isMajor = i % 5 === 0;
              const tickW = isMajor ? 14 : 7;
              const labelTxt = ft >= 20 ? `${ft.toFixed(0)} ft` : `${ft.toFixed(0)}'`;
              return (
                <div key={`r-${i}`} className="absolute left-1" style={{ top: y }}>
                  <div style={{ width: tickW, height: 1, background: isMajor ? 'var(--hm-primary)' : 'var(--hm-outline-variant)' }} />
                  {isMajor && (
                    <span className="absolute left-5 -translate-y-1/2 text-[10px] font-bold tnum whitespace-nowrap" style={{ color: 'var(--hm-on-surface)' }}>
                      {labelTxt}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Character row */}
          <div
            id="charRow"
            className="absolute left-20 right-20 flex items-end justify-center gap-3 sm:gap-5 px-4"
            style={{ bottom: FLOOR_PX }}
          >
            {characters.map(c => {
              const pxH = Math.max(8, c.height * pxPerCm);
              const metricLabel = formatMetric(c.height);
              const imperialLabel = formatImperial(c.height);
              const isCalcTarget = c.isCalcTarget === true;
              const isObject = c.type === 'object' && c.icon;

              let body;
              if (isObject) {
                const fontSize = Math.max(28, Math.min(180, pxH * 0.85));
                body = (
                  <div className="flex items-end justify-center" style={{ height: pxH }}>
                    <span style={{ fontSize, lineHeight: 1 }}>{c.icon}</span>
                  </div>
                );
              } else {
                body = (
                  <div style={{ width: 60, height: pxH }}
                       dangerouslySetInnerHTML={{ __html: silhouetteSVG(c.type, c.color) }} />
                );
              }

              // Reflection: positioned absolutely below the body (top-full) so it
              // projects into the floor area WITHOUT lifting the silhouette off the baseline.
              const reflection = !isObject ? (
                <div
                  className="absolute left-1/2 -translate-x-1/2 pointer-events-none overflow-hidden"
                  style={{ top: '100%', width: 60, height: Math.min(pxH * 0.5, 70) }}
                >
                  <div
                    style={{
                      width: 60, height: pxH,
                      transform: 'scaleY(-1)',
                      transformOrigin: 'top center',
                      opacity: 0.32,
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 90%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 90%)',
                    }}
                    dangerouslySetInnerHTML={{ __html: silhouetteSVG(c.type, c.color) }}
                  />
                </div>
              ) : null;

              return (
                <div
                  key={c.id}
                  className={`flex flex-col items-center group animate-pop-in ${isCalcTarget ? 'ring-2 ring-blue-400/60 rounded-lg' : ''}`}
                >
                  {/* Profile image badge (above info card) for celebrities with imageUrl */}
                  {c.imageUrl && (
                    <div className="relative mb-1.5">
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-lg shadow-blue-500/30"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ background: 'var(--hm-primary)', borderColor: 'var(--hm-surface-container-lowest)' }}>
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {/* Character info card — HeightMesh Level 1 surface */}
                  <div className="relative px-2.5 py-1.5 mb-2 text-center min-w-[70px] max-w-[120px] backdrop-blur border rounded-lg" style={{ background: 'rgba(25, 28, 30, 0.92)', borderColor: 'var(--hm-outline-variant)' }}>
                    {editMode && (
                      <button
                        onClick={() => onRemove(c.id)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white flex items-center justify-center transition shadow-md"
                        style={{ background: 'var(--hm-error)' }}
                        aria-label="Remove"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    <div className="text-[11px] font-bold truncate" style={{ color: 'var(--hm-on-surface)' }}>{c.name}</div>
                    <div className="text-[10px] font-bold tnum leading-tight" style={{ color: c.color }}>{metricLabel}</div>
                    <div className="text-[9px] font-semibold tnum leading-tight" style={{ color: 'var(--hm-on-surface-variant)' }}>{imperialLabel}</div>
                    {isCalcTarget && <div className="text-[9px] font-bold mt-0.5" style={{ color: 'var(--hm-primary)' }}>TARGET</div>}
                  </div>
                  {/* Body + reflection wrapper: relative so reflection's top:100% anchors to body's feet */}
                  <div className="relative">
                    {body}
                    {reflection}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Baseline — HeightMesh primary #487d97 solid ground line at 0 cm / 0'0" */}
          <div className="absolute left-0 right-0 h-px z-20" style={{ bottom: FLOOR_PX, background: 'var(--hm-primary)', boxShadow: '0 0 6px rgba(72, 125, 151, 0.4)' }} />
          <div className="absolute left-0 right-0 h-1 z-20" style={{ bottom: FLOOR_PX - 1, background: 'rgba(72, 125, 151, 0.15)' }} />

          {/* Floor background — atmospheric gradient below baseline */}
          <div className="absolute left-0 right-0 bottom-0 z-0" style={{ height: FLOOR_PX, background: 'linear-gradient(to bottom, transparent, rgba(12, 15, 16, 0.6) 40%, var(--hm-surface-container-lowest))' }}>
            <div className="absolute inset-x-0 top-0 h-3 opacity-40" style={{
              backgroundImage: 'repeating-linear-gradient(to right, var(--hm-outline-variant) 0 1px, transparent 1px 30px)',
            }} />
          </div>

          {/* Empty state */}
          {characters.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <div className="text-center" style={{ color: 'var(--hm-outline)' }}>
                <div className="text-5xl mb-3 opacity-40">📊</div>
                <p className="text-sm font-semibold" style={{ color: 'var(--hm-on-surface-variant)' }}>Your comparison chart will appear here.</p>
                <p className="text-xs mt-1" style={{ color: 'var(--hm-outline)' }}>Add a person, celebrity, or entity to start.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar { height: 8px; width: 8px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #141414; border-radius: 8px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #333; border-radius: 8px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #555; }
        .animate-pop-in { animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
