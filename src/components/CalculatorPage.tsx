'use client';

import { useState, useMemo } from 'react';
import { Character, ftInToCm, cmToFtIn, formatImperial } from '@/lib/height-data';

interface Props {
  characters: Character[];
  onAdd: (char: Omit<Character, 'id'>) => void;
  onToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

// Lifestyle quiz answer options
type Activity = 'low' | 'moderate' | 'high';
type Screen = 'high' | 'moderate' | 'low';
type Diet = 'poor' | 'average' | 'good';

interface CalcResult {
  fatherCm: number;
  motherCm: number;
  gender: 'boy' | 'girl';
  // Genetic midpoint (pure formula)
  geneticMid: number;
  // Genetic range: ±10 cm
  geneticLower: number;
  geneticUpper: number;
  // Lifestyle-adjusted target (within genetic range)
  adjustedTarget: number;
  // Lifestyle score 0-100
  lifestyleScore: number;
  // Adjustment applied (cm)
  adjustment: number;
  // Lifestyle breakdown
  breakdown: { genetics: number; lifestyle: number };
}

export default function CalculatorPage({ characters, onAdd, onToast }: Props) {
  const [fatherUnit, setFatherUnit] = useState<'cm' | 'ft'>('cm');
  const [motherUnit, setMotherUnit] = useState<'cm' | 'ft'>('cm');
  const [fatherCm, setFatherCm] = useState('');
  const [fatherFt, setFatherFt] = useState('');
  const [fatherIn, setFatherIn] = useState('');
  const [motherCm, setMotherCm] = useState('');
  const [motherFt, setMotherFt] = useState('');
  const [motherIn, setMotherIn] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');

  // Lifestyle quiz
  const [activity, setActivity] = useState<Activity>('moderate');
  const [screen, setScreen] = useState<Screen>('moderate');
  const [diet, setDiet] = useState<Diet>('average');

  const [result, setResult] = useState<CalcResult | null>(null);

  function getFatherCm(): number | null {
    if (fatherUnit === 'cm') {
      const v = parseFloat(fatherCm);
      return v && v >= 100 && v <= 250 ? v : null;
    }
    const f = parseFloat(fatherFt) || 0;
    const i = parseFloat(fatherIn) || 0;
    const v = ftInToCm(f, i);
    return v >= 100 && v <= 250 ? v : null;
  }
  function getMotherCm(): number | null {
    if (motherUnit === 'cm') {
      const v = parseFloat(motherCm);
      return v && v >= 100 && v <= 250 ? v : null;
    }
    const f = parseFloat(motherFt) || 0;
    const i = parseFloat(motherIn) || 0;
    const v = ftInToCm(f, i);
    return v >= 100 && v <= 250 ? v : null;
  }

  // Lifestyle score: 0-100. 50 = neutral (untouched defaults = 0 cm adjustment).
  // Higher than 50 = positive adjustment (max +4 cm at score 100).
  // Lower than 50 = negative adjustment (min -4 cm at score 0).
  function computeLifestyleScore(): number {
    // Each question contributes equally. Default "moderate/average" = 50 (neutral).
    const activityScore = activity === 'high' ? 100 : activity === 'moderate' ? 50 : 0;
    const screenScore = screen === 'low' ? 100 : screen === 'moderate' ? 50 : 0;
    const dietScore = diet === 'good' ? 100 : diet === 'average' ? 50 : 0;
    return Math.round((activityScore + screenScore + dietScore) / 3);
  }

  function calculate() {
    const f = getFatherCm();
    const m = getMotherCm();
    if (!f || !m) {
      onToast('Enter valid parent heights (100–250 cm)', 'error');
      return;
    }
    const isBoy = gender === 'boy';
    // Core formula: Boy (F+M+13)/2, Girl (F+M-13)/2
    const geneticMid = (f + m + (isBoy ? 13 : -13)) / 2;
    // Base genetic range: ±10 cm
    const geneticLower = geneticMid - 10;
    const geneticUpper = geneticMid + 10;

    // Lifestyle adjustment (within ±4 cm, scaled by lifestyle score)
    const lifestyleScore = computeLifestyleScore();
    // Map 0-100 score to -4..+4 cm adjustment
    const adjustment = ((lifestyleScore - 50) / 50) * 4; // -4 to +4
    const clampedAdj = Math.max(-4, Math.min(4, adjustment));
    const adjustedTarget = geneticMid + clampedAdj;

    setResult({
      fatherCm: f,
      motherCm: m,
      gender,
      geneticMid,
      geneticLower,
      geneticUpper,
      adjustedTarget,
      lifestyleScore,
      adjustment: clampedAdj,
      breakdown: { genetics: 60, lifestyle: 40 },
    });

    onAdd({
      name: isBoy ? 'Boy (predicted)' : 'Girl (predicted)',
      height: adjustedTarget,
      type: isBoy ? 'male' : 'female',
      color: isBoy ? '#3b82f6' : '#ec4899',
      isCalcTarget: true,
    });
    onToast(`Predicted height ${adjustedTarget.toFixed(1)} cm added as target!`, 'success');
  }

  const liveFatherDisplay = useMemo(() => {
    if (fatherUnit === 'cm') {
      const v = parseFloat(fatherCm);
      if (!v || isNaN(v)) return '';
      const { ft, inch } = cmToFtIn(v);
      return `${ft}' ${inch}"`;
    }
    const f = parseFloat(fatherFt) || 0;
    const i = parseFloat(fatherIn) || 0;
    if (!f && !i) return '';
    return `${ftInToCm(f, i).toFixed(1)} cm`;
  }, [fatherUnit, fatherCm, fatherFt, fatherIn]);

  const liveMotherDisplay = useMemo(() => {
    if (motherUnit === 'cm') {
      const v = parseFloat(motherCm);
      if (!v || isNaN(v)) return '';
      const { ft, inch } = cmToFtIn(v);
      return `${ft}' ${inch}"`;
    }
    const f = parseFloat(motherFt) || 0;
    const i = parseFloat(motherIn) || 0;
    if (!f && !i) return '';
    return `${ftInToCm(f, i).toFixed(1)} cm`;
  }, [motherUnit, motherCm, motherFt, motherIn]);

  return (
    <div className="space-y-6">
      {/* Medical Disclaimer — visible above the calculator to satisfy Medical Schema requirements */}
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3 text-[12px] text-yellow-100/80 flex items-start gap-2">
        <span className="text-yellow-400 text-base flex-shrink-0">⚠️</span>
        <p>
          <strong className="text-yellow-300">Medical Disclaimer:</strong> This calculator provides an educational estimate only and is not a medical diagnosis. Genetics account for 60–80% of final adult height; nutrition, sleep, and environment contribute the rest. Always consult a licensed pediatrician or pediatric endocrinologist for clinical growth assessment.{' '}
          <a href="/disclaimer" className="text-yellow-300 hover:underline font-semibold">Read full disclaimer →</a>
        </p>
      </div>

      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Child Potential{' '}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Height Calculator
          </span>
        </h1>
        <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Predict your child's adult height using the clinically validated mid-parental formula,
          with optional lifestyle adjustments for screen time, activity, and diet quality.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ===== Input form ===== */}
        <div className="space-y-5">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
              <span className="text-blue-400">👨‍👩‍👧</span> Parents' Heights
            </h2>

            {/* Father */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400">Father's Height</label>
                <UnitToggle value={fatherUnit} onChange={setFatherUnit} />
              </div>
              {fatherUnit === 'cm' ? (
                <input
                  type="number"
                  min={100}
                  max={250}
                  step={0.1}
                  value={fatherCm}
                  onChange={(e) => setFatherCm(e.target.value)}
                  placeholder="178 cm"
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#0d0d0d]"
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={3}
                      max={8}
                      step={1}
                      value={fatherFt}
                      onChange={(e) => setFatherFt(e.target.value)}
                      placeholder="5"
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#0d0d0d]"
                    />
                    <span className="text-xs text-slate-500 font-semibold">ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={11.9}
                      step={0.1}
                      value={fatherIn}
                      onChange={(e) => setFatherIn(e.target.value)}
                      placeholder="10"
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#0d0d0d]"
                    />
                    <span className="text-xs text-slate-500 font-semibold">in</span>
                  </div>
                </div>
              )}
              {liveFatherDisplay && (
                <div className="mt-1.5 text-[11px] text-blue-400 font-bold tabular-nums">≈ {liveFatherDisplay}</div>
              )}
            </div>

            {/* Mother */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400">Mother's Height</label>
                <UnitToggle value={motherUnit} onChange={setMotherUnit} />
              </div>
              {motherUnit === 'cm' ? (
                <input
                  type="number"
                  min={100}
                  max={250}
                  step={0.1}
                  value={motherCm}
                  onChange={(e) => setMotherCm(e.target.value)}
                  placeholder="165 cm"
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#0d0d0d]"
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={3}
                      max={8}
                      step={1}
                      value={motherFt}
                      onChange={(e) => setMotherFt(e.target.value)}
                      placeholder="5"
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#0d0d0d]"
                    />
                    <span className="text-xs text-slate-500 font-semibold">ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={11.9}
                      step={0.1}
                      value={motherIn}
                      onChange={(e) => setMotherIn(e.target.value)}
                      placeholder="5"
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#0d0d0d]"
                    />
                    <span className="text-xs text-slate-500 font-semibold">in</span>
                  </div>
                </div>
              )}
              {liveMotherDisplay && (
                <div className="mt-1.5 text-[11px] text-blue-400 font-bold tabular-nums">≈ {liveMotherDisplay}</div>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Child Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGender('boy')}
                  className={`py-2.5 rounded-lg text-sm font-bold border transition flex items-center justify-center gap-2 ${
                    gender === 'boy' ? 'bg-blue-500 text-white border-blue-500' : 'bg-[#0d0d0d] border-white/10 text-slate-300 hover:border-white/30'
                  }`}
                >
                  <span>♂</span> Boy
                </button>
                <button
                  onClick={() => setGender('girl')}
                  className={`py-2.5 rounded-lg text-sm font-bold border transition flex items-center justify-center gap-2 ${
                    gender === 'girl' ? 'bg-pink-500 text-white border-pink-500' : 'bg-[#0d0d0d] border-white/10 text-slate-300 hover:border-white/30'
                  }`}
                >
                  <span>♀</span> Girl
                </button>
              </div>
            </div>
          </div>

          {/* ===== Lifestyle Quiz ===== */}
          <div className="bg-[#141414] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span className="text-blue-400">🎯</span> Lifestyle Quiz
              </h2>
              <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">OPTIONAL</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              Adjusts the predicted target within the genetic range (±1 to 4 cm). Lifestyle accounts for 40% of final height.
            </p>

            <LifestyleQuestion
              label="📱 Screen Time"
              hint="Daily recreational screen exposure"
              options={[
                { id: 'high', label: 'High (>4 hrs)' },
                { id: 'moderate', label: 'Moderate (1-4 hrs)' },
                { id: 'low', label: 'Low (<1 hr)' },
              ]}
              value={screen}
              onChange={(v) => setScreen(v as Screen)}
            />

            <LifestyleQuestion
              label="🏃 Physical Activity"
              hint="Daily exercise or sports"
              options={[
                { id: 'low', label: 'Low (<30 min)' },
                { id: 'moderate', label: 'Moderate (30-60 min)' },
                { id: 'high', label: 'High (>60 min)' },
              ]}
              value={activity}
              onChange={(v) => setActivity(v as Activity)}
            />

            <LifestyleQuestion
              label="🥗 Protein / Diet Quality"
              hint="Daily protein, calcium, vitamin D intake"
              options={[
                { id: 'poor', label: 'Poor' },
                { id: 'average', label: 'Average' },
                { id: 'good', label: 'Good' },
              ]}
              value={diet}
              onChange={(v) => setDiet(v as Diet)}
            />

            <div className="mt-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/15">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 font-semibold">Lifestyle Score</span>
                <span className="text-blue-400 font-bold tabular-nums">{computeLifestyleScore()}/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#0d0d0d] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${computeLifestyleScore()}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full py-3 rounded-lg font-bold text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition shadow-lg shadow-blue-500/30 text-white flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Calculate &amp; Add to Chart
          </button>
        </div>

        {/* ===== Structured Output (5 sections) ===== */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Section 1: Inputs Received */}
              <SectionCard number={1} title="Inputs Received" icon="📝">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InputRow label="Father" value={`${result.fatherCm.toFixed(1)} cm`} sub={formatImperial(result.fatherCm)} />
                  <InputRow label="Mother" value={`${result.motherCm.toFixed(1)} cm`} sub={formatImperial(result.motherCm)} />
                  <InputRow label="Child Gender" value={result.gender === 'boy' ? '♂ Boy' : '♀ Girl'} />
                  <InputRow label="Lifestyle Score" value={`${result.lifestyleScore}/100`} sub={`${result.adjustment >= 0 ? '+' : ''}${result.adjustment.toFixed(1)} cm`} />
                </div>
              </SectionCard>

              {/* Section 2: Midpoint Target Height */}
              <SectionCard number={2} title="Midpoint Target Height" icon="🎯" highlight>
                <div className="text-center py-2">
                  <div className="text-5xl font-black text-blue-400 tabular-nums">
                    {result.adjustedTarget.toFixed(1)} <span className="text-2xl">cm</span>
                  </div>
                  <div className="text-lg text-slate-300 font-bold tabular-nums mt-1">
                    {formatImperial(result.adjustedTarget)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Genetic midpoint: {result.geneticMid.toFixed(1)} cm · Adjustment: {result.adjustment >= 0 ? '+' : ''}{result.adjustment.toFixed(1)} cm
                  </div>
                </div>
              </SectionCard>

              {/* Section 3: Expected Genetic Range */}
              <SectionCard number={3} title="Expected Genetic Range" icon="📊">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-center flex-1">
                      <div className="text-[11px] text-slate-500 font-semibold uppercase">Min</div>
                      <div className="text-lg font-bold text-slate-200 tabular-nums">{result.geneticLower.toFixed(1)} cm</div>
                      <div className="text-[10px] text-slate-500 tabular-nums">{formatImperial(result.geneticLower)}</div>
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="relative h-2 rounded-full bg-gradient-to-r from-slate-700 via-blue-500 to-slate-700">
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-blue-500 shadow-lg"
                          style={{ left: `${((result.adjustedTarget - result.geneticLower) / 20) * 100}%`, transform: 'translate(-50%, -50%)' }}
                        />
                      </div>
                      <div className="text-center text-[10px] text-slate-500 mt-1">±10 cm range</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-[11px] text-slate-500 font-semibold uppercase">Max</div>
                      <div className="text-lg font-bold text-slate-200 tabular-nums">{result.geneticUpper.toFixed(1)} cm</div>
                      <div className="text-[10px] text-slate-500 tabular-nums">{formatImperial(result.geneticUpper)}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-white/5">
                    The white marker shows your lifestyle-adjusted target within the genetic range.
                  </div>
                </div>
              </SectionCard>

              {/* Section 4: 60% Genetics vs 40% Lifestyle */}
              <SectionCard number={4} title="Genetics vs Lifestyle Breakdown" icon="⚖️">
                <div className="space-y-3">
                  <div className="flex h-8 rounded-lg overflow-hidden border border-white/10">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold"
                      style={{ width: '60%' }}
                    >
                      60% Genetics
                    </div>
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
                      style={{ width: '40%' }}
                    >
                      40% Lifestyle
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="font-bold text-blue-300 mb-1">🧬 Genetics (60%)</div>
                      <div className="text-slate-400 text-[11px] leading-relaxed">
                        Determined by parents' heights via the mid-parental formula. Cannot be changed.
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <div className="font-bold text-purple-300 mb-1">🌟 Lifestyle (40%)</div>
                      <div className="text-slate-400 text-[11px] leading-relaxed">
                        Nutrition, sleep, exercise, and screen time. Adjusts target ±1 to 4 cm within range.
                      </div>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Section 5: Medical Disclaimer */}
              <SectionCard number={5} title="Medical Disclaimer" icon="⚠️">
                <div className="text-[12px] text-slate-400 leading-relaxed space-y-2">
                  <p>
                    <span className="font-semibold text-yellow-300">Important:</span> This calculator provides an estimate
                    based on the mid-parental height formula and self-reported lifestyle factors. It is for educational
                    purposes only and is <span className="font-semibold text-slate-300">not a medical diagnosis</span>.
                  </p>
                  <p>
                    <span className="font-semibold text-slate-300">Genetics</span> account for approximately 60-80% of final
                    adult height, with <span className="font-semibold text-slate-300">nutrition, health, and environment</span>{' '}
                    contributing the remaining 20-40%. Actual adult height may vary.
                  </p>
                  <p>
                    For concerns about your child's growth, consult a <span className="font-semibold text-slate-300">pediatrician
                    or pediatric endocrinologist</span>. Growth charts, bone age X-rays, and hormone testing may be needed
                    for clinical assessment.
                  </p>
                </div>
              </SectionCard>
            </>
          ) : (
            <div className="bg-[#141414] border border-white/10 rounded-xl p-8 text-center">
              <div className="text-5xl mb-3 opacity-30">📊</div>
              <h3 className="text-base font-bold text-slate-300 mb-2">Your structured result will appear here</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Enter both parents' heights, optionally complete the lifestyle quiz, then click Calculate to see the
                5-section pediatric report: inputs, midpoint target, genetic range, 60/40 breakdown, and medical disclaimer.
              </p>
              <div className="mt-5 grid grid-cols-5 gap-2 text-[10px] text-slate-600">
                <div className="p-2 rounded bg-[#0d0d0d]">📝 Inputs</div>
                <div className="p-2 rounded bg-[#0d0d0d]">🎯 Target</div>
                <div className="p-2 rounded bg-[#0d0d0d]">📊 Range</div>
                <div className="p-2 rounded bg-[#0d0d0d]">⚖️ 60/40</div>
                <div className="p-2 rounded bg-[#0d0d0d]">⚠️ Disclaimer</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Targets currently on chart */}
      {characters.some(c => c.isCalcTarget) && (
        <div className="bg-[#141414] border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-200 mb-3">Your Calculated Targets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {characters.filter(c => c.isCalcTarget).map(c => (
              <div key={c.id} className="bg-[#0d0d0d] border border-blue-500/30 rounded-lg p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded flex items-center justify-center" style={{ background: `${c.color}22`, border: `1px solid ${c.color}55` }}>
                  <div className="w-4 h-4 rounded-sm" style={{ background: c.color }} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100">{c.name}</div>
                  <div className="text-[11px] text-blue-400 font-bold tabular-nums">{c.height.toFixed(1)} cm · {formatImperial(c.height)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ Sub-components ============ */
function UnitToggle({ value, onChange }: { value: 'cm' | 'ft'; onChange: (v: 'cm' | 'ft') => void }) {
  return (
    <div className="inline-flex p-0.5 rounded-md bg-[#0d0d0d] border border-white/10 text-[11px]">
      <button
        onClick={() => onChange('cm')}
        className={`px-2 py-0.5 rounded font-bold transition ${value === 'cm' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}
      >cm</button>
      <button
        onClick={() => onChange('ft')}
        className={`px-2 py-0.5 rounded font-bold transition ${value === 'ft' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}
      >ft/in</button>
    </div>
  );
}

function LifestyleQuestion({ label, hint, options, value, onChange }: {
  label: string;
  hint: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-300">{label}</label>
        <span className="text-[10px] text-slate-600">{hint}</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`py-2 px-2 rounded-md text-[11px] font-bold border transition ${
              value === opt.id
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-[#0d0d0d] border-white/10 text-slate-400 hover:border-white/30 hover:text-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionCard({ number, title, icon, children, highlight }: {
  number: number;
  title: string;
  icon: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-5 border ${highlight ? 'bg-gradient-to-br from-blue-500/15 to-indigo-500/5 border-blue-500/40' : 'bg-[#141414] border-white/10'}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${highlight ? 'bg-blue-500 text-white' : 'bg-blue-500/20 text-blue-400'}`}>
          {number}
        </span>
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
          <span>{icon}</span>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function InputRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="p-2.5 rounded-md bg-[#0d0d0d] border border-white/5">
      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{label}</div>
      <div className="text-sm font-bold text-slate-100 tabular-nums">{value}</div>
      {sub && <div className="text-[10px] text-slate-500 tabular-nums">{sub}</div>}
    </div>
  );
}
