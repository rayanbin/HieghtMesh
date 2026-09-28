'use client';

import { useState, useEffect, useRef } from 'react';
import { EXERCISES, Exercise } from '@/lib/exercises';

export default function ExercisesPage() {
  const [active, setActive] = useState<Exercise>(EXERCISES[0]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          10 Animated{' '}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Height Growth Exercises
          </span>
        </h1>
        <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Lightweight 2D SVG demonstrations with built-in 30-second timer presets. Perform daily to maximize your
          genetic height potential, decompress your spine, and improve posture.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Exercise grid (left) */}
        <div className="lg:col-span-4 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">All Exercises</h2>
          {EXERCISES.map(ex => (
            <button
              key={ex.id}
              onClick={() => setActive(ex)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition text-left ${
                active.id === ex.id
                  ? 'bg-blue-500/10 border-blue-500'
                  : 'bg-[#141414] border-white/10 hover:border-white/30'
              }`}
            >
              <div className={`w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold ${
                active.id === ex.id ? 'bg-blue-500 text-white' : 'bg-[#1a1a1a] text-slate-400'
              }`}>
                {EXERCISES.indexOf(ex) + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-100 truncate">{ex.name}</div>
                <div className="text-[10px] text-slate-500 flex items-center gap-2">
                  <span>{ex.category}</span>
                  <span>•</span>
                  <span>{ex.duration}s</span>
                  <span>•</span>
                  <span>{ex.difficulty}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Active exercise demo (right) */}
        <div className="lg:col-span-8">
          <ExerciseDemo key={active.id} exercise={active} />
        </div>
      </div>

      {/* Categories overview */}
      <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Stretching', 'Hanging', 'Posture', 'Strength'].map(cat => {
          const count = EXERCISES.filter(e => e.category === cat).length;
          const icons: Record<string, string> = { Stretching: '🧘', Hanging: '🤸', Posture: '🧍', Strength: '💪' };
          return (
            <div key={cat} className="bg-[#141414] border border-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{icons[cat]}</div>
              <div className="text-sm font-bold text-slate-100">{cat}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{count} exercises</div>
            </div>
          );
        })}
      </section>

      {/* YMYL Medical Disclaimer — subtle notice for exercise content */}
      <div className="mt-8 p-4 rounded-xl border" style={{ borderColor: 'rgba(245, 187, 128, 0.3)', background: 'rgba(245, 187, 128, 0.05)' }}>
        <p className="text-[12px] leading-relaxed flex items-start gap-2" style={{ color: 'var(--hm-on-surface-variant)' }}>
          <span className="flex-shrink-0 text-base" style={{ color: 'var(--hm-tertiary)' }}>⚠️</span>
          <span>
            <strong style={{ color: 'var(--hm-tertiary)' }}>Note:</strong> Consult a physician before starting any exercise program — especially if you have back injuries, joint problems, or are recovering from surgery. Stop immediately if you feel pain, dizziness, or discomfort.{' '}
            <a href="/disclaimer" className="underline font-semibold" style={{ color: 'var(--hm-primary)' }}>Read full medical disclaimer →</a>
          </span>
        </p>
      </div>
    </div>
  );
}

function ExerciseDemo({ exercise }: { exercise: Exercise }) {
  // Use a key trick: parent remounts this component when exercise changes,
  // so initial state reflects the new exercise.
  const [timer, setTimer] = useState(exercise.duration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            setRunning(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, timer]);

  function start() {
    if (timer === 0) setTimer(exercise.duration);
    setRunning(true);
  }
  function pause() { setRunning(false); }
  function reset() {
    setRunning(false);
    setTimer(exercise.duration);
  }

  const progress = ((exercise.duration - timer) / exercise.duration) * 100;

  return (
    <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-slate-100">{exercise.name}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge color="blue">{exercise.category}</Badge>
              <Badge color="slate">{exercise.difficulty}</Badge>
              <Badge color="slate">{exercise.duration}s hold</Badge>
            </div>
          </div>
          {/* Timer */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" stroke="#1a1a1a" strokeWidth="4" fill="none" />
                <circle
                  cx="32" cy="32" r="28"
                  stroke="#3b82f6" strokeWidth="4" fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white tabular-nums">
                {timer}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {!running ? (
                <button onClick={start} className="px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition">
                  ▶ Start
                </button>
              ) : (
                <button onClick={pause} className="px-3 py-1.5 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold transition">
                  ⏸ Pause
                </button>
              )}
              <button onClick={reset} className="px-3 py-1.5 rounded-md bg-[#1a1a1a] hover:bg-[#222] text-slate-300 text-xs font-bold transition">
                ↻ Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated SVG demo */}
      <div className="aspect-video bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 40px)',
        }} />
        <ExerciseAnimation id={exercise.id} running={running} />
      </div>

      {/* Body content */}
      <div className="p-5 space-y-5">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-2">Benefits</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{exercise.benefits}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-2">How to Perform</h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-3">{exercise.howTo}</p>
          <ol className="space-y-3">
            {exercise.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-md bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="font-semibold text-slate-200 text-sm">{step.name}</div>
                  <p className="text-slate-400 text-[13px] mt-0.5">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 pt-1">Targets:</span>
          {exercise.targetMuscles.map(m => (
            <span key={m} className="text-[11px] px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 font-semibold">{m}</span>
          ))}
        </div>

        {exercise.warnings && (
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex gap-3">
            <span className="text-yellow-400 text-lg">⚠️</span>
            <div>
              <div className="text-xs font-bold text-yellow-300 mb-0.5">Caution</div>
              <p className="text-[13px] text-yellow-100/80">{exercise.warnings}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: 'blue' | 'slate' }) {
  const cls = color === 'blue'
    ? 'bg-blue-500/20 text-blue-300'
    : 'bg-white/5 text-slate-400';
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{children}</span>;
}

/* ============================================================
   2D SVG/CSS animated exercise demos — realistic multi-joint human figures
   ============================================================ */

// Reusable realistic human figure. All joints are positioned in a 0..400 (x) / 0..300 (y) viewBox
// so animations look smooth and proportional. Colors and poses are passed in.
interface Pose {
  head: { x: number; y: number };
  neck: { x: number; y: number };
  torsoTop: { x: number; y: number };
  torsoBot: { x: number; y: number };
  shoulderL: { x: number; y: number };
  shoulderR: { x: number; y: number };
  elbowL: { x: number; y: number };
  elbowR: { x: number; y: number };
  handL: { x: number; y: number };
  handR: { x: number; y: number };
  hipL: { x: number; y: number };
  hipR: { x: number; y: number };
  kneeL: { x: number; y: number };
  kneeR: { x: number; y: number };
  footL: { x: number; y: number };
  footR: { x: number; y: number };
}

function HumanFigure({ pose, color = '#3b82f6', accent = '#60a5fa' }: { pose: Pose; color?: string; accent?: string }) {
  return (
    <g>
      {/* Legs (back layer) */}
      <line x1={pose.hipL.x} y1={pose.hipL.y} x2={pose.kneeL.x} y2={pose.kneeL.y} stroke={color} strokeWidth="14" strokeLinecap="round" />
      <line x1={pose.kneeL.x} y1={pose.kneeL.y} x2={pose.footL.x} y2={pose.footL.y} stroke={color} strokeWidth="13" strokeLinecap="round" />
      <line x1={pose.hipR.x} y1={pose.hipR.y} x2={pose.kneeR.x} y2={pose.kneeR.y} stroke={color} strokeWidth="14" strokeLinecap="round" />
      <line x1={pose.kneeR.x} y1={pose.kneeR.y} x2={pose.footR.x} y2={pose.footR.y} stroke={color} strokeWidth="13" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx={pose.footL.x} cy={pose.footL.y + 4} rx="10" ry="5" fill={color} />
      <ellipse cx={pose.footR.x} cy={pose.footR.y + 4} rx="10" ry="5" fill={color} />

      {/* Torso */}
      <line x1={pose.torsoTop.x} y1={pose.torsoTop.y} x2={pose.torsoBot.x} y2={pose.torsoBot.y} stroke={color} strokeWidth="28" strokeLinecap="round" />

      {/* Arms (front layer) */}
      <line x1={pose.shoulderL.x} y1={pose.shoulderL.y} x2={pose.elbowL.x} y2={pose.elbowL.y} stroke={accent} strokeWidth="11" strokeLinecap="round" />
      <line x1={pose.elbowL.x} y1={pose.elbowL.y} x2={pose.handL.x} y2={pose.handL.y} stroke={accent} strokeWidth="10" strokeLinecap="round" />
      <line x1={pose.shoulderR.x} y1={pose.shoulderR.y} x2={pose.elbowR.x} y2={pose.elbowR.y} stroke={accent} strokeWidth="11" strokeLinecap="round" />
      <line x1={pose.elbowR.x} y1={pose.elbowR.y} x2={pose.handR.x} y2={pose.handR.y} stroke={accent} strokeWidth="10" strokeLinecap="round" />
      {/* Hands */}
      <circle cx={pose.handL.x} cy={pose.handL.y} r="6" fill={accent} />
      <circle cx={pose.handR.x} cy={pose.handR.y} r="6" fill={accent} />

      {/* Neck */}
      <line x1={pose.neck.x} y1={pose.neck.y} x2={pose.torsoTop.x} y2={pose.torsoTop.y} stroke={color} strokeWidth="12" strokeLinecap="round" />
      {/* Head */}
      <circle cx={pose.head.x} cy={pose.head.y} r="16" fill={color} />
      {/* Hair / cap detail */}
      <path d={`M ${pose.head.x - 14} ${pose.head.y - 6} Q ${pose.head.x} ${pose.head.y - 22} ${pose.head.x + 14} ${pose.head.y - 6}`} stroke={accent} strokeWidth="3" fill="none" opacity="0.7" />
    </g>
  );
}

function Floor({ y = 260 }: { y?: number }) {
  return (
    <>
      <rect x="0" y={y} width="400" height="300" fill="#0a0a0a" />
      <line x1="0" y1={y} x2="400" y2={y} stroke="#1f2937" strokeWidth="1" />
      <line x1="0" y1={y + 8} x2="400" y2={y + 8} stroke="#1f2937" strokeWidth="0.5" opacity="0.5" />
    </>
  );
}

function ExerciseAnimation({ id, running }: { id: string; running: boolean }) {
  const animState = running ? 'running' : 'paused';
  const dur = '3s';

  // ============ 1. COBRA STRETCH ============
  if (id === 'cobra-stretch') {
    // Pose A: lying flat. Pose B: chest lifted high.
    const poseA: Pose = {
      head: { x: 90, y: 230 }, neck: { x: 110, y: 230 }, torsoTop: { x: 130, y: 230 }, torsoBot: { x: 280, y: 230 },
      shoulderL: { x: 130, y: 228 }, shoulderR: { x: 130, y: 232 },
      elbowL: { x: 110, y: 230 }, elbowR: { x: 110, y: 234 },
      handL: { x: 95, y: 235 }, handR: { x: 95, y: 240 },
      hipL: { x: 280, y: 228 }, hipR: { x: 280, y: 232 },
      kneeL: { x: 330, y: 230 }, kneeR: { x: 330, y: 232 },
      footL: { x: 380, y: 228 }, footR: { x: 380, y: 232 },
    };
    const poseB: Pose = {
      head: { x: 130, y: 165 }, neck: { x: 145, y: 180 }, torsoTop: { x: 160, y: 195 }, torsoBot: { x: 280, y: 230 },
      shoulderL: { x: 158, y: 195 }, shoulderR: { x: 162, y: 200 },
      elbowL: { x: 140, y: 215 }, elbowR: { x: 145, y: 220 },
      handL: { x: 125, y: 235 }, handR: { x: 130, y: 240 },
      hipL: { x: 280, y: 228 }, hipR: { x: 280, y: 232 },
      kneeL: { x: 330, y: 230 }, kneeR: { x: 330, y: 232 },
      footL: { x: 380, y: 228 }, footR: { x: 380, y: 232 },
    };
    return (
      <svg viewBox="0 0 400 280" className="w-full h-full max-w-2xl relative z-10">
        <Floor y={250} />
        <g style={{ animation: `cobraArc ${dur} ease-in-out infinite alternate`, animationPlayState: animState }}>
          <HumanFigure pose={poseA} />
        </g>
        <g style={{ animation: `cobraB ${dur} ease-in-out infinite alternate`, animationPlayState: animState, opacity: 0 }}>
          <HumanFigure pose={poseB} />
        </g>
        <style>{`
          @keyframes cobraArc { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes cobraB { 0% { opacity: 0; } 50% { opacity: 0; } 100% { opacity: 1; } }
        `}</style>
      </svg>
    );
  }

  // ============ 2. BAR HANGING ============
  if (id === 'bar-hanging') {
    const poseA: Pose = {
      head: { x: 200, y: 95 }, neck: { x: 200, y: 78 }, torsoTop: { x: 200, y: 75 }, torsoBot: { x: 200, y: 155 },
      shoulderL: { x: 188, y: 80 }, shoulderR: { x: 212, y: 80 },
      elbowL: { x: 188, y: 60 }, elbowR: { x: 212, y: 60 },
      handL: { x: 188, y: 45 }, handR: { x: 212, y: 45 },
      hipL: { x: 192, y: 155 }, hipR: { x: 208, y: 155 },
      kneeL: { x: 192, y: 215 }, kneeR: { x: 208, y: 215 },
      footL: { x: 188, y: 270 }, footR: { x: 212, y: 270 },
    };
    const poseB: Pose = { ...poseA, head: { x: 200, y: 100 }, torsoBot: { x: 200, y: 160 }, footL: { x: 188, y: 275 }, footR: { x: 212, y: 275 } };
    return (
      <svg viewBox="0 0 400 290" className="w-full h-full max-w-2xl relative z-10">
        {/* Bar */}
        <rect x="80" y="32" width="240" height="8" rx="4" fill="#64748b" />
        <rect x="80" y="40" width="6" height="22" fill="#475569" />
        <rect x="314" y="40" width="6" height="22" fill="#475569" />
        {/* Hands gripping bar */}
        <circle cx="188" cy="42" r="7" fill="#94a3b8" />
        <circle cx="212" cy="42" r="7" fill="#94a3b8" />
        <g style={{ animation: `hangA ${dur} ease-in-out infinite alternate`, animationPlayState: animState }}>
          <HumanFigure pose={poseA} />
        </g>
        <g style={{ animation: `hangB ${dur} ease-in-out infinite alternate`, animationPlayState: animState, opacity: 0 }}>
          <HumanFigure pose={poseB} />
        </g>
        <style>{`
          @keyframes hangA { 0% { opacity: 1; } 49% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes hangB { 0% { opacity: 0; } 49% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
        `}</style>
      </svg>
    );
  }

  // ============ 3. PELVIC TILT ============
  if (id === 'pelvic-tilt') {
    const poseA: Pose = {
      head: { x: 80, y: 215 }, neck: { x: 95, y: 215 }, torsoTop: { x: 110, y: 215 }, torsoBot: { x: 220, y: 225 },
      shoulderL: { x: 108, y: 215 }, shoulderR: { x: 112, y: 218 },
      elbowL: { x: 105, y: 235 }, elbowR: { x: 110, y: 240 },
      handL: { x: 100, y: 250 }, handR: { x: 105, y: 255 },
      hipL: { x: 218, y: 222 }, hipR: { x: 222, y: 226 },
      kneeL: { x: 270, y: 195 }, kneeR: { x: 275, y: 200 },
      footL: { x: 320, y: 230 }, footR: { x: 325, y: 234 },
    };
    const poseB: Pose = {
      ...poseA,
      torsoBot: { x: 220, y: 215 },
      hipL: { x: 218, y: 212 }, hipR: { x: 222, y: 216 },
      head: { x: 78, y: 210 }, neck: { x: 93, y: 210 },
    };
    return (
      <svg viewBox="0 0 400 280" className="w-full h-full max-w-2xl relative z-10">
        <Floor y={258} />
        <g style={{ animation: `tiltA ${dur} ease-in-out infinite alternate`, animationPlayState: animState }}>
          <HumanFigure pose={poseA} />
        </g>
        <g style={{ animation: `tiltB ${dur} ease-in-out infinite alternate`, animationPlayState: animState, opacity: 0 }}>
          <HumanFigure pose={poseB} />
        </g>
        <style>{`
          @keyframes tiltA { 0% { opacity: 1; } 49% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes tiltB { 0% { opacity: 0; } 49% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
        `}</style>
      </svg>
    );
  }

  // ============ 4. FORWARD BEND ============
  if (id === 'forward-bend') {
    const poseA: Pose = {
      head: { x: 200, y: 60 }, neck: { x: 200, y: 78 }, torsoTop: { x: 200, y: 80 }, torsoBot: { x: 200, y: 160 },
      shoulderL: { x: 188, y: 82 }, shoulderR: { x: 212, y: 82 },
      elbowL: { x: 188, y: 130 }, elbowR: { x: 212, y: 130 },
      handL: { x: 188, y: 175 }, handR: { x: 212, y: 175 },
      hipL: { x: 192, y: 160 }, hipR: { x: 208, y: 160 },
      kneeL: { x: 192, y: 215 }, kneeR: { x: 208, y: 215 },
      footL: { x: 188, y: 270 }, footR: { x: 212, y: 270 },
    };
    const poseB: Pose = {
      ...poseA,
      head: { x: 200, y: 165 }, neck: { x: 200, y: 145 }, torsoTop: { x: 200, y: 140 }, torsoBot: { x: 200, y: 160 },
      shoulderL: { x: 188, y: 140 }, shoulderR: { x: 212, y: 140 },
      elbowL: { x: 188, y: 175 }, elbowR: { x: 212, y: 175 },
      handL: { x: 188, y: 215 }, handR: { x: 212, y: 215 },
      kneeL: { x: 195, y: 215 }, kneeR: { x: 205, y: 215 },
    };
    return (
      <svg viewBox="0 0 400 280" className="w-full h-full max-w-2xl relative z-10">
        <Floor y={258} />
        <g style={{ animation: `bendA ${dur} ease-in-out infinite alternate`, animationPlayState: animState }}>
          <HumanFigure pose={poseA} />
        </g>
        <g style={{ animation: `bendB ${dur} ease-in-out infinite alternate`, animationPlayState: animState, opacity: 0 }}>
          <HumanFigure pose={poseB} />
        </g>
        <style>{`
          @keyframes bendA { 0% { opacity: 1; } 49% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes bendB { 0% { opacity: 0; } 49% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
        `}</style>
      </svg>
    );
  }

  // ============ 5. CAT-COW ============
  if (id === 'cat-cow') {
    // On hands and knees. Pose A: arched up (cat). Pose B: dipped down (cow).
    const poseA: Pose = {
      head: { x: 90, y: 140 }, neck: { x: 110, y: 150 }, torsoTop: { x: 130, y: 145 }, torsoBot: { x: 270, y: 165 },
      shoulderL: { x: 130, y: 145 }, shoulderR: { x: 132, y: 150 },
      elbowL: { x: 130, y: 195 }, elbowR: { x: 134, y: 200 },
      handL: { x: 130, y: 240 }, handR: { x: 134, y: 245 },
      hipL: { x: 268, y: 160 }, hipR: { x: 272, y: 168 },
      kneeL: { x: 270, y: 200 }, kneeR: { x: 275, y: 205 },
      footL: { x: 270, y: 245 }, footR: { x: 275, y: 250 },
    };
    const poseB: Pose = {
      ...poseA,
      head: { x: 80, y: 165 }, neck: { x: 100, y: 165 }, torsoTop: { x: 130, y: 170 }, torsoBot: { x: 270, y: 145 },
      shoulderL: { x: 130, y: 170 }, shoulderR: { x: 132, y: 175 },
      hipL: { x: 268, y: 150 }, hipR: { x: 272, y: 158 },
    };
    return (
      <svg viewBox="0 0 400 280" className="w-full h-full max-w-2xl relative z-10">
        <Floor y={258} />
        <g style={{ animation: `catA ${dur} ease-in-out infinite alternate`, animationPlayState: animState }}>
          <HumanFigure pose={poseA} />
        </g>
        <g style={{ animation: `catB ${dur} ease-in-out infinite alternate`, animationPlayState: animState, opacity: 0 }}>
          <HumanFigure pose={poseB} />
        </g>
        <style>{`
          @keyframes catA { 0% { opacity: 1; } 49% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes catB { 0% { opacity: 0; } 49% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
        `}</style>
      </svg>
    );
  }

  // ============ 6. PIKE STRETCH (seated forward fold) ============
  if (id === 'pike-stretch') {
    const poseA: Pose = {
      head: { x: 130, y: 145 }, neck: { x: 145, y: 145 }, torsoTop: { x: 160, y: 145 }, torsoBot: { x: 230, y: 175 },
      shoulderL: { x: 158, y: 145 }, shoulderR: { x: 162, y: 150 },
      elbowL: { x: 130, y: 155 }, elbowR: { x: 135, y: 160 },
      handL: { x: 100, y: 170 }, handR: { x: 105, y: 175 },
      hipL: { x: 228, y: 175 }, hipR: { x: 232, y: 178 },
      kneeL: { x: 290, y: 180 }, kneeR: { x: 295, y: 182 },
      footL: { x: 350, y: 180 }, footR: { x: 355, y: 182 },
    };
    const poseB: Pose = {
      ...poseA,
      head: { x: 90, y: 180 }, neck: { x: 110, y: 175 }, torsoTop: { x: 130, y: 170 }, torsoBot: { x: 230, y: 175 },
      elbowL: { x: 100, y: 180 }, elbowR: { x: 105, y: 185 },
      handL: { x: 75, y: 195 }, handR: { x: 80, y: 200 },
    };
    return (
      <svg viewBox="0 0 400 280" className="w-full h-full max-w-2xl relative z-10">
        <Floor y={220} />
        <g style={{ animation: `pikeA ${dur} ease-in-out infinite alternate`, animationPlayState: animState }}>
          <HumanFigure pose={poseA} />
        </g>
        <g style={{ animation: `pikeB ${dur} ease-in-out infinite alternate`, animationPlayState: animState, opacity: 0 }}>
          <HumanFigure pose={poseB} />
        </g>
        <style>{`
          @keyframes pikeA { 0% { opacity: 1; } 49% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes pikeB { 0% { opacity: 0; } 49% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
        `}</style>
      </svg>
    );
  }

  // ============ 7. WALL SLIDES ============
  if (id === 'wall-slide') {
    // Standing against wall, arms slide up and down
    const poseA: Pose = { // arms down (start)
      head: { x: 200, y: 60 }, neck: { x: 200, y: 78 }, torsoTop: { x: 200, y: 80 }, torsoBot: { x: 200, y: 165 },
      shoulderL: { x: 188, y: 82 }, shoulderR: { x: 212, y: 82 },
      elbowL: { x: 175, y: 130 }, elbowR: { x: 225, y: 130 },
      handL: { x: 175, y: 175 }, handR: { x: 225, y: 175 },
      hipL: { x: 192, y: 165 }, hipR: { x: 208, y: 165 },
      kneeL: { x: 192, y: 220 }, kneeR: { x: 208, y: 220 },
      footL: { x: 188, y: 275 }, footR: { x: 212, y: 275 },
    };
    const poseB: Pose = { // arms up (slide)
      ...poseA,
      shoulderL: { x: 188, y: 70 }, shoulderR: { x: 212, y: 70 },
      elbowL: { x: 175, y: 35 }, elbowR: { x: 225, y: 35 },
      handL: { x: 175, y: 15 }, handR: { x: 225, y: 15 },
    };
    return (
      <svg viewBox="0 0 400 290" className="w-full h-full max-w-2xl relative z-10">
        {/* Wall (left side) */}
        <rect x="0" y="0" width="20" height="290" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1" />
        <g style={{ animation: `slideA ${dur} ease-in-out infinite alternate`, animationPlayState: animState }}>
          <HumanFigure pose={poseA} />
        </g>
        <g style={{ animation: `slideB ${dur} ease-in-out infinite alternate`, animationPlayState: animState, opacity: 0 }}>
          <HumanFigure pose={poseB} />
        </g>
        <Floor y={285} />
        <style>{`
          @keyframes slideA { 0% { opacity: 1; } 49% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes slideB { 0% { opacity: 0; } 49% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
        `}</style>
      </svg>
    );
  }

  // ============ 8. SUPERMAN HOLD ============
  if (id === 'superman') {
    // Lying face down, arms and legs lift together
    const poseA: Pose = {
      head: { x: 80, y: 175 }, neck: { x: 100, y: 175 }, torsoTop: { x: 130, y: 175 }, torsoBot: { x: 260, y: 180 },
      shoulderL: { x: 128, y: 173 }, shoulderR: { x: 132, y: 178 },
      elbowL: { x: 80, y: 165 }, elbowR: { x: 85, y: 170 },
      handL: { x: 30, y: 155 }, handR: { x: 35, y: 160 },
      hipL: { x: 258, y: 178 }, hipR: { x: 262, y: 182 },
      kneeL: { x: 320, y: 175 }, kneeR: { x: 325, y: 180 },
      footL: { x: 370, y: 165 }, footR: { x: 375, y: 170 },
    };
    const poseB: Pose = {
      ...poseA,
      head: { x: 75, y: 145 }, neck: { x: 100, y: 150 }, torsoTop: { x: 130, y: 155 }, torsoBot: { x: 260, y: 160 },
      elbowL: { x: 70, y: 130 }, elbowR: { x: 75, y: 135 },
      handL: { x: 15, y: 110 }, handR: { x: 20, y: 115 },
      kneeL: { x: 325, y: 145 }, kneeR: { x: 330, y: 150 },
      footL: { x: 380, y: 125 }, footR: { x: 385, y: 130 },
    };
    return (
      <svg viewBox="0 0 400 280" className="w-full h-full max-w-2xl relative z-10">
        <Floor y={210} />
        <g style={{ animation: `supA ${dur} ease-in-out infinite alternate`, animationPlayState: animState }}>
          <HumanFigure pose={poseA} />
        </g>
        <g style={{ animation: `supB ${dur} ease-in-out infinite alternate`, animationPlayState: animState, opacity: 0 }}>
          <HumanFigure pose={poseB} />
        </g>
        <style>{`
          @keyframes supA { 0% { opacity: 1; } 49% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes supB { 0% { opacity: 0; } 49% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
        `}</style>
      </svg>
    );
  }

  // ============ 9. TRIANGLE POSE ============
  if (id === 'triangle-pose') {
    // Standing wide, tilted sideways
    const poseA: Pose = {
      head: { x: 130, y: 90 }, neck: { x: 145, y: 105 }, torsoTop: { x: 165, y: 120 }, torsoBot: { x: 220, y: 165 },
      shoulderL: { x: 163, y: 118 }, shoulderR: { x: 168, y: 122 },
      elbowL: { x: 130, y: 175 }, elbowR: { x: 230, y: 65 },
      handL: { x: 100, y: 235 }, handR: { x: 250, y: 25 },
      hipL: { x: 218, y: 162 }, hipR: { x: 225, y: 170 },
      kneeL: { x: 215, y: 220 }, kneeR: { x: 290, y: 220 },
      footL: { x: 210, y: 275 }, footR: { x: 320, y: 275 },
    };
    const poseB: Pose = {
      ...poseA,
      head: { x: 270, y: 90 }, neck: { x: 255, y: 105 }, torsoTop: { x: 235, y: 120 }, torsoBot: { x: 180, y: 165 },
      shoulderL: { x: 232, y: 118 }, shoulderR: { x: 237, y: 122 },
      elbowL: { x: 170, y: 65 }, elbowR: { x: 270, y: 175 },
      handL: { x: 150, y: 25 }, handR: { x: 300, y: 235 },
      hipL: { x: 175, y: 162 }, hipR: { x: 182, y: 170 },
      kneeL: { x: 110, y: 220 }, kneeR: { x: 185, y: 220 },
      footL: { x: 80, y: 275 }, footR: { x: 190, y: 275 },
    };
    return (
      <svg viewBox="0 0 400 290" className="w-full h-full max-w-2xl relative z-10">
        <Floor y={285} />
        <g style={{ animation: `triA ${dur} ease-in-out infinite alternate`, animationPlayState: animState }}>
          <HumanFigure pose={poseA} />
        </g>
        <g style={{ animation: `triB ${dur} ease-in-out infinite alternate`, animationPlayState: animState, opacity: 0 }}>
          <HumanFigure pose={poseB} />
        </g>
        <style>{`
          @keyframes triA { 0% { opacity: 1; } 49% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes triB { 0% { opacity: 0; } 49% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
        `}</style>
      </svg>
    );
  }

  // ============ 10. CHILD'S POSE ============
  if (id === 'child-pose') {
    // Kneeling folded forward, arms stretched out
    const poseA: Pose = {
      head: { x: 80, y: 200 }, neck: { x: 105, y: 200 }, torsoTop: { x: 130, y: 200 }, torsoBot: { x: 230, y: 215 },
      shoulderL: { x: 128, y: 200 }, shoulderR: { x: 132, y: 205 },
      elbowL: { x: 95, y: 200 }, elbowR: { x: 100, y: 205 },
      handL: { x: 55, y: 205 }, handR: { x: 60, y: 210 },
      hipL: { x: 228, y: 212 }, hipR: { x: 232, y: 218 },
      kneeL: { x: 275, y: 240 }, kneeR: { x: 280, y: 245 },
      footL: { x: 320, y: 230 }, footR: { x: 325, y: 235 },
    };
    const poseB: Pose = {
      ...poseA,
      head: { x: 75, y: 195 }, elbowL: { x: 90, y: 195 }, elbowR: { x: 95, y: 200 },
      handL: { x: 50, y: 200 }, handR: { x: 55, y: 205 },
    };
    return (
      <svg viewBox="0 0 400 280" className="w-full h-full max-w-2xl relative z-10">
        <Floor y={260} />
        <g style={{ animation: `cpA ${dur} ease-in-out infinite alternate`, animationPlayState: animState }}>
          <HumanFigure pose={poseA} />
        </g>
        <g style={{ animation: `cpB ${dur} ease-in-out infinite alternate`, animationPlayState: animState, opacity: 0 }}>
          <HumanFigure pose={poseB} />
        </g>
        <style>{`
          @keyframes cpA { 0% { opacity: 1; } 49% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes cpB { 0% { opacity: 0; } 49% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
        `}</style>
      </svg>
    );
  }

  return null;
}
