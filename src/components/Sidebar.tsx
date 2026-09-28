'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import {
  Character,
  CharType,
  ftInToCm,
  cmToFtIn,
  CELEB_QUICK,
  ENTITIES,
  PRESET_COLORS,
  CELEB_DB,
  formatImperial,
  ALL_DATASETS,
  Dataset,
} from '@/lib/height-data';

interface Props {
  onAdd: (char: Omit<Character, 'id'>) => void;
  onToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

type SidebarTab = 'person' | 'celeb' | 'calc' | 'entity' | 'compare';

export default function Sidebar({ onAdd, onToast }: Props) {
  const [tab, setTab] = useState<SidebarTab>('person');
  const [gender, setGender] = useState<CharType>('male');
  // Unified dual-unit state: cmVal is the source of truth; ft/in derived for display
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [name, setName] = useState('');
  const [cmVal, setCmVal] = useState('');
  const [ftVal, setFtVal] = useState('');
  const [inVal, setInVal] = useState('');

  // Derived: live conversion display (uses rounded integer inches for consistency with chart)
  const liveFt = useMemo(() => {
    const v = parseFloat(cmVal);
    if (!v || isNaN(v)) return '';
    const { ft, inch } = cmToFtIn(v);
    return `${ft}' ${inch}"`;
  }, [cmVal]);
  const liveCm = useMemo(() => {
    const f = parseFloat(ftVal) || 0;
    const i = parseFloat(inVal) || 0;
    if (!f && !i) return '';
    const v = ftInToCm(f, i);
    return v.toFixed(1);
  }, [ftVal, inVal]);

  // Calculator
  const [fatherH, setFatherH] = useState('');
  const [motherH, setMotherH] = useState('');
  const [calcGender, setCalcGender] = useState<'boy' | 'girl'>('boy');

  // Wikipedia search state. Uses 300ms debounce + AbortController to cancel
  // in-flight requests when the user types a new query.
  const [wikiQ, setWikiQ] = useState('');
  const [wikiResults, setWikiResults] = useState<any[]>([]);
  const [wikiStatus, setWikiStatus] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const searchWiki = useCallback((q: string) => {
    setWikiQ(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (!q || q.trim().length < 2) {
      setWikiResults([]);
      setWikiStatus('');
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setWikiStatus('Searching Wikipedia...');
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=10&namespace=0&format=json&origin=*`;
        const r = await fetch(url, { signal: controller.signal });
        const data = await r.json();
        const titles: string[] = data[1] || [];
        if (titles.length === 0) {
          setWikiResults([]);
          setWikiStatus(`No results for "${q}"`);
          return;
        }
        const summaries = await Promise.all(
          titles.slice(0, 8).map(async (title) => {
            try {
              const sr = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, { signal: controller.signal });
              const sd = await sr.json();
              const imageUrl = sd.originalimage?.source || sd.thumbnail?.source || null;
              return {
                title,
                thumbnail: sd.thumbnail?.source || null,
                imageUrl,
                extract: sd.extract || '',
                knownHeight: CELEB_DB[title] || null,
              };
            } catch {
              return { title, thumbnail: null, imageUrl: null, extract: '', knownHeight: CELEB_DB[title] || null };
            }
          }),
        );
        setWikiResults(summaries);
        setWikiStatus('');
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        setWikiResults([]);
        setWikiStatus('Search failed. Check connection.');
      }
    }, 300);
  }, []);

  function handleAddPerson() {
    const finalName = name.trim() || (gender === 'male' ? 'Male' : 'Female');
    let h: number;
    if (unit === 'cm') {
      h = parseFloat(cmVal);
    } else {
      h = ftInToCm(parseFloat(ftVal) || 0, parseFloat(inVal) || 0);
    }
    if (!h || h < 20 || h > 50000) {
      onToast('Enter a valid height (20 cm – 500 m)', 'error');
      return;
    }
    onAdd({ name: finalName, height: h, type: gender, color });
    setName(''); setCmVal(''); setFtVal(''); setInVal('');
    onToast(`${finalName} added!`, 'success');
  }

  // When switching units, carry the value over so conversion is seamless
  function switchUnit(newUnit: 'cm' | 'ft') {
    if (newUnit === unit) return;
    if (newUnit === 'ft' && cmVal) {
      const v = parseFloat(cmVal);
      if (v && !isNaN(v)) {
        const { ft, inch } = cmToFtIn(v);
        setFtVal(String(ft));
        setInVal(String(inch));
      }
    } else if (newUnit === 'cm' && (ftVal || inVal)) {
      const f = parseFloat(ftVal) || 0;
      const i = parseFloat(inVal) || 0;
      if (f || i) {
        setCmVal(ftInToCm(f, i).toFixed(1));
      }
    }
    setUnit(newUnit);
  }

  // searchWiki is defined above as a useCallback with debounce + AbortController.

  function handleCalc() {
    const f = parseFloat(fatherH);
    const m = parseFloat(motherH);
    if (!f || !m || f < 100 || f > 250 || m < 100 || m > 250) {
      onToast('Enter valid parent heights (100–250 cm)', 'error');
      return;
    }
    const isBoy = calcGender === 'boy';
    // Tanner mid-parental formula: Boy (F+M+13)/2, Girl (F+M-13)/2
    const predicted = (f + m + (isBoy ? 13 : -13)) / 2;
    const childName = isBoy ? 'Boy (predicted)' : 'Girl (predicted)';
    onAdd({
      name: childName,
      height: predicted,
      type: isBoy ? 'male' : 'female',
      color: isBoy ? '#677a85' : '#a4743f',
      isCalcTarget: true,
    });
    onToast(`Predicted height ${predicted.toFixed(0)} cm (±10 cm range) added as target!`, 'success');
  }

  return (
    <aside
      className="lg:w-[380px] flex-shrink-0 border-r lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] flex flex-col"
      style={{ background: 'var(--hm-surface-container-low)', borderColor: 'var(--hm-outline-variant)' }}
    >
      {/* Sidebar tab nav — HeightMesh primary for active */}
      <nav className="flex border-b" style={{ background: 'var(--hm-surface)', borderColor: 'var(--hm-outline-variant)' }}>
        <TabBtn icon="👤" label="Person" active={tab === 'person'} onClick={() => setTab('person')} />
        <TabBtn icon="⭐" label="Celebs" active={tab === 'celeb'} onClick={() => setTab('celeb')} />
        <TabBtn icon="🧒" label="Predict" active={tab === 'calc'} onClick={() => setTab('calc')} />
        <TabBtn icon="📦" label="Entity" active={tab === 'entity'} onClick={() => setTab('entity')} />
        <TabBtn icon="🗂️" label="Compare" active={tab === 'compare'} onClick={() => setTab('compare')} />
      </nav>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {tab === 'person' && (
          <div className="space-y-4">
            <h2 className="label-sm">Add Person</h2>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <ToggleBtn active={gender === 'male'} onClick={() => setGender('male')}>♂ Male</ToggleBtn>
                <ToggleBtn active={gender === 'female'} onClick={() => setGender('female')}>♀ Female</ToggleBtn>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                Name <span className="text-slate-600 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                maxLength={30}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John"
                className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#141414]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold text-slate-400">Height</label>
                <div className="inline-flex p-0.5 rounded-md bg-[#141414] border border-white/10 text-[11px]">
                  <button
                    onClick={() => switchUnit('cm')}
                    className={`px-2 py-0.5 rounded font-bold transition ${unit === 'cm' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}
                  >cm</button>
                  <button
                    onClick={() => switchUnit('ft')}
                    className={`px-2 py-0.5 rounded font-bold transition ${unit === 'ft' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}
                  >ft/in</button>
                </div>
              </div>

              {unit === 'cm' ? (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={20}
                      max={50000}
                      step={0.1}
                      value={cmVal}
                      onChange={(e) => setCmVal(e.target.value)}
                      placeholder="180"
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#141414]"
                    />
                    <span className="text-xs text-slate-500 font-semibold">cm</span>
                  </div>
                  {/* Live conversion readout */}
                  <div className="mt-1.5 px-2 py-1.5 rounded-md bg-blue-500/5 border border-blue-500/15 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">≈ imperial:</span>
                    <span className="font-bold text-blue-400 tabular-nums">{liveFt || '—'}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={200}
                        step={1}
                        value={ftVal}
                        onChange={(e) => setFtVal(e.target.value)}
                        placeholder="5"
                        className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#141414]"
                      />
                      <span className="text-xs text-slate-500 font-semibold">ft</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={11.9}
                        step={0.1}
                        value={inVal}
                        onChange={(e) => setInVal(e.target.value)}
                        placeholder="11"
                        className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#141414]"
                      />
                      <span className="text-xs text-slate-500 font-semibold">in</span>
                    </div>
                  </div>
                  {/* Live conversion readout */}
                  <div className="mt-1.5 px-2 py-1.5 rounded-md bg-blue-500/5 border border-blue-500/15 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">≈ metric:</span>
                    <span className="font-bold text-blue-400 tabular-nums">{liveCm ? `${liveCm} cm` : '—'}</span>
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-9 h-9 rounded-md"
                />
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="w-6 h-6 rounded-md transition hover:scale-110"
                      style={{
                        background: c,
                        boxShadow: c === color ? '0 0 0 2px #0a0a0a, 0 0 0 4px #3b82f6' : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleAddPerson}
              className="w-full py-3 rounded-lg font-bold text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition shadow-lg shadow-blue-500/30 text-white flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Person
            </button>
          </div>
        )}

        {tab === 'celeb' && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Celebrities (Wikipedia Live Search)</h2>

            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={wikiQ}
                onChange={(e) => searchWiki(e.target.value)}
                placeholder="Search any celebrity..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#141414]"
              />
            </div>

            {wikiStatus && <div className="text-[11px] text-slate-500 px-1">{wikiStatus}</div>}

            <div className="space-y-1.5 max-h-80 overflow-y-auto scrollbar-thin pr-1">
              {wikiResults.map(r => (
                <div
                  key={r.title}
                  onClick={() => {
                    // FIX: do NOT inject a default 175 cm guess. Prompt the user instead.
                    if (!r.knownHeight) {
                      const input = prompt(`Enter height in cm for "${r.title}":`, '175');
                      if (!input) return;
                      const h = parseFloat(input);
                      if (!h || h < 20 || h > 50000) {
                        onToast('Invalid height. Must be 20–50000 cm.', 'error');
                        return;
                      }
                      onAdd({
                        name: r.title,
                        height: h,
                        type: 'male',
                        color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
                        imageUrl: r.imageUrl || undefined,
                      });
                      onToast(`${r.title} added at ${h} cm`, 'success');
                      return;
                    }
                    onAdd({
                      name: r.title,
                      height: r.knownHeight,
                      type: 'male',
                      color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
                      imageUrl: r.imageUrl || undefined,
                    });
                    onToast(`${r.title} added at ${r.knownHeight} cm`, 'success');
                  }}
                  className="flex items-start gap-2 p-2 rounded-lg cursor-pointer hover:bg-[#1a1a1a] border border-transparent hover:border-white/10"
                >
                  {r.thumbnail ? (
                    <img src={r.thumbnail} alt={`${r.title} — Wikipedia profile photo`} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-slate-600 flex-shrink-0">👤</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[12px] font-bold text-slate-200 truncate">{r.title}</div>
                      <span className={`text-[10px] font-bold tabular-nums ${r.knownHeight ? 'text-blue-400' : 'text-slate-600'}`}>
                        {r.knownHeight ? `${r.knownHeight} cm` : 'click to add'}
                      </span>
                    </div>
                    {r.extract && (
                      <div className="text-[10px] text-slate-500 line-clamp-2 leading-tight mt-0.5">
                        {r.extract.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-white/10">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Quick Add</h3>
              <div className="grid grid-cols-1 gap-1.5">
                {CELEB_QUICK.map(c => (
                  <button
                    key={c.name}
                    onClick={() => {
                      onAdd({ ...c });
                      onToast(`${c.name} added!`, 'success');
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#141414] border border-white/10 hover:border-blue-500 hover:bg-[#1a1a1a] transition text-left"
                  >
                    <div className="w-7 h-7 rounded flex-shrink-0 flex items-center justify-center" style={{ background: `${c.color}22`, border: `1px solid ${c.color}66` }}>
                      <div className="w-3.5 h-3.5 rounded-sm" style={{ background: c.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-slate-200 truncate">{c.name}</div>
                      <div className="text-[10px] text-slate-500 tabular-nums">{c.height} cm · {formatImperial(c.height)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'calc' && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Child Potential Calculator</h2>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Uses the <span className="text-slate-300 font-semibold">mid-parental height formula</span> to predict a child's adult height. Result is added as a target bar on the chart.
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Father's Height</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={100}
                  max={250}
                  step={0.1}
                  value={fatherH}
                  onChange={(e) => setFatherH(e.target.value)}
                  placeholder="178"
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#141414]"
                />
                <span className="text-xs text-slate-500 font-semibold">cm</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Mother's Height</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={100}
                  max={250}
                  step={0.1}
                  value={motherH}
                  onChange={(e) => setMotherH(e.target.value)}
                  placeholder="165"
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#141414]"
                />
                <span className="text-xs text-slate-500 font-semibold">cm</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Child Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <ToggleBtn active={calcGender === 'boy'} onClick={() => setCalcGender('boy')}>♂ Boy</ToggleBtn>
                <ToggleBtn active={calcGender === 'girl'} onClick={() => setCalcGender('girl')}>♀ Girl</ToggleBtn>
              </div>
            </div>

            <button
              onClick={handleCalc}
              className="w-full py-3 rounded-lg font-bold text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition shadow-lg shadow-blue-500/30 text-white flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate &amp; Add Target
            </button>

            <div className="text-[11px] text-slate-500 leading-relaxed p-3 rounded-lg bg-[#141414] border border-white/5">
              <div className="font-bold text-slate-400 mb-1">Tanner Formula:</div>
              {calcGender === 'boy' ? (
                <div className="text-slate-300">(Father + Mother + 13) / 2</div>
              ) : (
                <div className="text-slate-300">(Father + Mother − 13) / 2</div>
              )}
              <div className="mt-2 text-slate-500">Standard range: ±10 cm (±4 in)</div>
            </div>
          </div>
        )}

        {tab === 'entity' && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Entities &amp; Objects</h2>
            <p className="text-[11px] text-slate-500">One-click add common objects, animals, and landmarks.</p>
            <div className="grid grid-cols-1 gap-1.5">
              {ENTITIES.map(e => (
                <button
                  key={e.name}
                  onClick={() => {
                    onAdd({
                      name: e.name,
                      height: e.height,
                      type: 'object',
                      icon: e.icon,
                      color: '#94a3b8',
                    });
                    onToast(`${e.name} added!`, 'success');
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#141414] border border-white/10 hover:border-blue-500 hover:bg-[#1a1a1a] transition text-left"
                >
                  <div className="w-8 h-8 rounded flex-shrink-0 flex items-center justify-center text-lg bg-[#0a0a0a] border border-white/10">{e.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-slate-200 truncate">{e.name}</div>
                    <div className="text-[10px] text-slate-500 tabular-nums">{e.height >= 1000 ? `${(e.height/100).toFixed(0)} m` : `${e.height} cm`} · {formatImperial(e.height)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'compare' && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Compare Datasets</h2>
            <p className="text-[11px] text-slate-500">One-click load curated comparison groups.</p>
            {ALL_DATASETS.map((ds) => (
              <DatasetCard
                key={ds.id}
                dataset={ds}
                onAddAll={(chars) => {
                  chars.forEach((c) => onAdd(c));
                  onToast(`${ds.title} loaded (${chars.length} chars)!`, 'success');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function DatasetCard({ dataset, onAddAll }: { dataset: Dataset; onAddAll: (chars: Omit<Character, 'id'>[]) => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-lg bg-[#141414] border border-white/10 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-3 hover:bg-[#1a1a1a] transition text-left"
      >
        <span className="text-xl flex-shrink-0">{dataset.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-bold text-slate-100 truncate">{dataset.title}</div>
          <div className="text-[10px] text-slate-500">{dataset.characters.length} chars · {dataset.description}</div>
        </div>
        <svg className={`w-4 h-4 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-1.5">
          {dataset.characters.map((c) => (
            <div key={c.name} className="flex items-center gap-2 p-1.5 rounded-md bg-[#0a0a0a] border border-white/5">
              <div className="w-5 h-5 rounded flex-shrink-0" style={{ background: c.color }} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-200 truncate">{c.name}</div>
                <div className="text-[9px] text-slate-500 tabular-nums">
                  {c.height} cm · {formatImperial(c.height)}
                  {c.reach ? ` · reach ${c.reach}cm` : ''}
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => onAddAll(dataset.characters.map((c) => ({ ...c, imageUrl: c.imageUrl })))}
            className="w-full mt-2 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Load All {dataset.characters.length} to Chart
          </button>
        </div>
      )}
    </div>
  );
}

function TabBtn({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-3 px-2 text-[11px] font-bold flex flex-col items-center gap-1 transition"
      style={{
        background: active ? 'var(--hm-primary)' : 'transparent',
        color: active ? '#ffffff' : 'var(--hm-on-surface-variant)',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--hm-surface-container-high)'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <span className="text-base">{icon}</span>
      {label}
    </button>
  );
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="py-2.5 rounded-lg text-sm font-bold border transition flex items-center justify-center gap-2"
      style={{
        background: active ? 'var(--hm-primary)' : 'var(--hm-surface-container-low)',
        color: active ? '#ffffff' : 'var(--hm-on-surface-variant)',
        borderColor: active ? 'var(--hm-primary)' : 'var(--hm-outline-variant)',
      }}
    >
      {children}
    </button>
  );
}
