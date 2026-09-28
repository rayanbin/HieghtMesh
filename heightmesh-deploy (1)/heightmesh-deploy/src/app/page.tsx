'use client';

import { useState, useEffect, useCallback } from 'react';
import HeightChart from '@/components/HeightChart';
import Sidebar from '@/components/Sidebar';
import ExercisesPage from '@/components/ExercisesPage';
import CelebritiesPage from '@/components/CelebritiesPage';
import CalculatorPage from '@/components/CalculatorPage';
import { Character, formatMetric, formatImperial } from '@/lib/height-data';
import { FAQS } from '@/lib/faqs';
import { useToast } from '@/hooks/use-toast';

type Page = 'home' | 'calculator' | 'exercises' | 'celebrities';

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '📊' },
  { id: 'calculator', label: 'Calculator', icon: '🧮' },
  { id: 'exercises', label: 'Exercises', icon: '🏃' },
  { id: 'celebrities', label: 'Celebrities', icon: '⭐' },
];

export default function Home() {
  const [page, setPage] = useState<Page>('home');
  const [characters, setCharacters] = useState<Character[]>([
    { id: 1, name: 'You', height: 175, type: 'male', color: '#677a85' },
    { id: 2, name: 'Cristiano Ronaldo', height: 187, type: 'male', color: '#677a85' },
    { id: 3, name: 'Taylor Swift', height: 180, type: 'female', color: '#a4743f' },
  ]);
  const [zoom, setZoom] = useState(1.0);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();

  // Hash-based routing
  useEffect(() => {
    function handleHash() {
      const hash = window.location.hash.replace('#', '') as Page;
      if (['home', 'calculator', 'exercises', 'celebrities'].includes(hash)) {
        setPage(hash);
      }
    }
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = useCallback((p: Page) => {
    window.location.hash = p;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addCharacter = useCallback((char: Omit<Character, 'id'>) => {
    setCharacters(prev => {
      const newId = prev.length === 0 ? 1 : Math.max(...prev.map(c => c.id)) + 1;
      return [...prev, { ...char, id: newId }];
    });
  }, []);

  const removeCharacter = useCallback((id: number) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  }, []);

  const handleToast = useCallback((msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    if (type === 'error') toast({ title: msg, variant: 'destructive' });
    else toast({ title: msg });
  }, [toast]);

  const clearAll = () => {
    if (characters.length === 0) { handleToast('Chart is already empty'); return; }
    setCharacters([]);
    setZoom(1.0);
    handleToast('Chart cleared', 'success');
  };

  const toggleEdit = () => {
    setEditMode(e => !e);
    handleToast(editMode ? 'Edit mode OFF' : 'Edit mode ON — click ✕ on a character to remove');
  };

  const exportChart = async () => {
    if (characters.length === 0) { handleToast('Add a character first', 'error'); return; }
    handleToast('Generating image... (use browser screenshot for full chart)');
    // Try html2canvas
    try {
      const { default: html2canvas } = await import('html2canvas');
      const stage = document.getElementById('chartCard');
      if (!stage) return;
      const canvas = await html2canvas(stage, {
        backgroundColor: '#0d0d0d',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = 'height-comparison.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      handleToast('Image downloaded!', 'success');
    } catch (e) {
      handleToast('Export failed — try again', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--hm-surface)' }}>
      {/* ============ HEADER — HeightMesh surface-container-lowest ============ */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{ background: 'rgba(12, 15, 16, 0.95)', borderColor: 'var(--hm-outline-variant)' }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shadow-lg"
              style={{ background: 'var(--hm-primary)', boxShadow: '0 4px 12px rgba(72, 125, 151, 0.3)' }}
            >
              📏
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold leading-tight" style={{ color: 'var(--hm-on-surface)' }}>HeightMesh</h1>
              <p className="text-[10px] leading-tight label-sm">Visual Height Comparison</p>
            </div>
          </div>
          {/* Top nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(n => (
              <button
                key={n.id}
                onClick={() => navigate(n.id)}
                className="px-3 py-2 rounded-lg text-xs font-bold transition"
                style={{
                  background: page === n.id ? 'var(--hm-primary)' : 'transparent',
                  color: page === n.id ? '#ffffff' : 'var(--hm-on-surface-variant)',
                }}
              >
                <span className="mr-1">{n.icon}</span>
                {n.label}
              </button>
            ))}
            <a
              href="/blog"
              className="px-3 py-2 rounded-lg text-xs font-bold transition"
              style={{ color: 'var(--hm-on-surface-variant)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hm-surface-container-high)'; e.currentTarget.style.color = 'var(--hm-on-surface)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--hm-on-surface-variant)'; }}
            >
              📝 Blog
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={exportChart}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition shadow-lg shadow-blue-500/30 text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        <nav className="md:hidden flex border-t" style={{ borderColor: 'var(--hm-outline-variant)' }}>
          {NAV_ITEMS.map(n => (
            <button
              key={n.id}
              onClick={() => navigate(n.id)}
              className="flex-1 py-2 text-[11px] font-bold transition"
              style={{
                background: page === n.id ? 'var(--hm-primary)' : 'transparent',
                color: page === n.id ? '#ffffff' : 'var(--hm-on-surface-variant)',
              }}
            >
              <span className="block text-base">{n.icon}</span>
              {n.label}
            </button>
          ))}
          <a
            href="/blog"
            className="flex-1 py-2 text-[11px] font-bold transition"
            style={{ color: 'var(--hm-on-surface-variant)' }}
          >
            <span className="block text-base">📝</span>
            Blog
          </a>
        </nav>
      </header>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1">
        {page === 'home' && (
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row">
            <Sidebar onAdd={addCharacter} onToast={handleToast} />
            <div className="flex-1 p-3 sm:p-5 space-y-4">
              {/* Chart controls */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setZoom(z => Math.max(0.25, z / 1.2))} className="w-8 h-8 rounded-md border text-lg font-bold flex items-center justify-center transition hm-btn-secondary">−</button>
                  <button onClick={() => setZoom(1.0)} className="px-2.5 h-8 rounded-md text-[11px] font-bold transition hm-btn-secondary">FIT</button>
                  <button onClick={() => setZoom(z => Math.min(5, z * 1.2))} className="w-8 h-8 rounded-md border text-lg font-bold flex items-center justify-center transition hm-btn-secondary">+</button>
                  <span className="ml-1 text-[10px] tnum" style={{ color: 'var(--hm-on-surface-variant)' }}>{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={clearAll} className="px-2.5 h-8 rounded-md bg-[#141414] hover:bg-red-500/20 hover:text-red-300 border border-white/10 text-[11px] font-bold text-slate-300 transition flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                    </svg>
                    Clear
                  </button>
                  <button onClick={toggleEdit} className={`px-2.5 h-8 rounded-md border text-[11px] font-bold transition flex items-center gap-1 ${editMode ? 'bg-blue-500/30 text-blue-300 border-blue-500' : 'bg-[#141414] hover:bg-blue-500/20 hover:text-blue-300 border-white/10 text-slate-300'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button onClick={exportChart} className="px-2.5 h-8 rounded-md bg-[#141414] hover:bg-blue-500/20 hover:text-blue-300 border border-white/10 text-[11px] font-bold text-slate-300 transition flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-2.684-4.026m4.026 9.342a3 3 0 10-2.684 4.026M8.684 13.342A3 3 0 0110.316 12m6.4 4.026a3 3 0 014.026 2.684M14.684 9.658A3 3 0 1012 4" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>

              <HeightChart characters={characters} zoom={zoom} editMode={editMode} onRemove={removeCharacter} />

              {/* Char list */}
              <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    On Chart
                  </h2>
                  <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">{characters.length}</span>
                </div>
                {characters.length === 0 ? (
                  <div className="text-center py-4 text-slate-500 text-xs">No characters yet. Add one from the sidebar.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {characters.map(c => (
                      <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#141414] border border-white/5">
                        {c.type === 'object' && c.icon ? (
                          <div className="w-7 h-7 rounded flex-shrink-0 flex items-center justify-center text-base bg-[#1a1a1a] border border-white/10">{c.icon}</div>
                        ) : (
                          <div className="w-7 h-7 rounded flex-shrink-0 flex items-center justify-center" style={{ background: `${c.color}22`, border: `1px solid ${c.color}66` }}>
                            <div className="w-3.5 h-3.5 rounded-sm" style={{ background: c.color }} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold text-slate-200 truncate">{c.name}</div>
                          <div className="text-[10px] text-slate-500 tabular-nums">{formatMetric(c.height)} · {formatImperial(c.height)}</div>
                        </div>
                        <button onClick={() => removeCharacter(c.id)} className="text-slate-500 hover:text-red-400 transition p-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SEO content on home page */}
              <HomeSEOContent />

              {/* Long-form educational article — 1500+ words for E-A-T */}
              <GrowthScienceArticle />

              {/* Fully-styled FAQ accordion */}
              <HomeFAQAccordion />
            </div>
          </div>
        )}

        {page === 'calculator' && (
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <CalculatorPage characters={characters} onAdd={addCharacter} onToast={handleToast} />
          </div>
        )}

        {page === 'exercises' && (
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <ExercisesPage />
          </div>
        )}

        {page === 'celebrities' && (
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <CelebritiesPage onAdd={addCharacter} onToast={handleToast} />
          </div>
        )}
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] mt-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm">📏</div>
              <span className="font-bold text-sm">Height Comparison</span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Free online tool to compare heights of people, celebrities, and objects on a dynamically scaling chart.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Tools</h4>
            <ul className="space-y-1.5 text-sm">
              <li><button onClick={() => navigate('home')} className="text-slate-500 hover:text-blue-400 transition">Visual Comparison</button></li>
              <li><button onClick={() => navigate('calculator')} className="text-slate-500 hover:text-blue-400 transition">Child Height Calculator</button></li>
              <li><button onClick={() => navigate('exercises')} className="text-slate-500 hover:text-blue-400 transition">Growth Exercises</button></li>
              <li><button onClick={() => navigate('celebrities')} className="text-slate-500 hover:text-blue-400 transition">Celebrity Heights</button></li>
              <li><a href="/blog" className="text-slate-500 hover:text-blue-400 transition">📝 Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Resources</h4>
            <ul className="space-y-1.5 text-sm text-slate-500">
              <li>1 ft = 30.48 cm</li>
              <li>1 in = 2.54 cm</li>
              <li>Mid-parental formula</li>
              <li>Growth plate fusion</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">FAQ</h4>
            <ul className="space-y-1.5 text-sm">
              {FAQS.slice(0, 4).map(f => (
                <li key={f.q} className="text-slate-500 text-[12px] line-clamp-1">{f.q}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ===== Pricing & Policies (explicit for AI crawler indexation) ===== */}
        <div className="border-t border-white/10 mt-6 pt-6 px-4">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">💳 Pricing</h4>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                This tool is <span className="font-bold text-emerald-300">100% free ($0 USD)</span>. No subscriptions, paid plans, or credit card requirements. Every feature — visual comparison, child calculator, growth exercises, celebrity search — is available at no cost.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">↩️ Refund &amp; Cancellation</h4>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-300">Not applicable.</span> Because the tool is 100% free with no paid plans, subscriptions, or billing of any kind, there is nothing to cancel or refund. Stop using it anytime — no account to delete, no payment to recover.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">🔒 Data Privacy</h4>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-300">100% client-side.</span> All comparisons and calculations run in your browser memory. Nothing is saved on external servers. The only external call is Wikipedia search for celebrity images.
              </p>
            </div>
          </div>
        </div>

        {/* ===== Legal & Trust Links + Social Media (AdSense compliance) ===== */}
        <div className="border-t border-white/10 mt-6 pt-6 px-4">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Legal &amp; Policies</h4>
              <ul className="grid grid-cols-2 gap-1.5 text-[12px]">
                <li><a href="/contact" className="text-slate-500 hover:text-blue-400 transition">Contact Us</a></li>
                <li><a href="/about" className="text-slate-500 hover:text-blue-400 transition">About Us</a></li>
                <li><a href="/privacy-policy" className="text-slate-500 hover:text-blue-400 transition">Privacy Policy</a></li>
                <li><a href="/disclaimer" className="text-slate-500 hover:text-blue-400 transition">Medical Disclaimer</a></li>
                <li><a href="/terms-of-service" className="text-slate-500 hover:text-blue-400 transition">Terms of Service</a></li>
                <li><a href="/editorial-guidelines" className="text-slate-500 hover:text-blue-400 transition">Editorial Guidelines</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Contact</h4>
              <ul className="space-y-1.5 text-sm">
                <li><a href="/contact" className="text-slate-500 hover:text-blue-400 transition">Contact Form</a></li>
                <li><a href="mailto:spacexrayan@gmail.com" className="text-slate-500 hover:text-blue-400 transition">spacexrayan@gmail.com</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ===== Author Byline & Last Updated (E-A-T signal) ===== */}
        <div className="border-t border-white/10 mt-6 pt-4 px-4">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <div>
              <span className="text-slate-400 font-semibold">Author:</span>{' '}
              Height Comparison Tool Team{'  '}·{'  '}
              <span className="text-slate-400 font-semibold">Last Updated:</span>{' '}
              September 26, 2026{'  '}·{'  '}
              <a href="/editorial-guidelines" className="text-blue-400 hover:underline">Editorial Guidelines</a>
            </div>
            <div className="text-slate-600">
              Reviewed by the Pediatric Formula Volunteer Reviewer
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-4 py-4 px-4 text-center text-[11px] text-slate-600">
          Built with Next.js, Tailwind CSS &amp; vanilla TypeScript. All data stays in your browser. No tracking.{' '}
          &copy; 2026 Height Comparison Tool. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function HomeSEOContent() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6" aria-label="Growth and nutrition guides">
      <article className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5">
        <h2 className="text-base font-bold flex items-center gap-2 mb-3">
          <span className="text-blue-400">🏃</span> Height Growth Exercises
        </h2>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
          While genetics account for roughly 80% of your final adult height, certain exercises during your growth years
          can help maximize your potential by improving posture, decompressing the spine, and stimulating growth hormone release.
        </p>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-md bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">01</span>
            <div>
              <div className="font-semibold text-slate-200">Bar Hanging</div>
              <p className="text-slate-500 text-[13px] mt-0.5">Dead-hang from a pull-up bar for 30–60 seconds, 3 sets daily. Decompresses the spine.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-md bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">02</span>
            <div>
              <div className="font-semibold text-slate-200">Cobra Stretch</div>
              <p className="text-slate-500 text-[13px] mt-0.5">Daily cobra pose lengthens the spine. Hold 20–30 seconds.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-md bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">03</span>
            <div>
              <div className="font-semibold text-slate-200">Posture Correction</div>
              <p className="text-slate-500 text-[13px] mt-0.5">Wall slides and chin-tucks correct rounded shoulders. Reclaim 2–4 cm of "lost" height.</p>
            </div>
          </li>
        </ul>
        <a href="#exercises" className="inline-block mt-4 text-xs font-bold text-blue-400 hover:text-blue-300 transition">View all 10 exercises →</a>

        {/* YMYL Disclaimer — subtle notice under Exercises section */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-[11px] leading-relaxed flex items-start gap-1.5" style={{ color: 'var(--hm-on-surface-variant)' }}>
            <span className="flex-shrink-0" style={{ color: 'var(--hm-tertiary)' }}>⚠️</span>
            <span><strong>Note:</strong> Consult a physician before starting any exercise program. Stop immediately if you feel pain or discomfort. <a href="/disclaimer" className="underline" style={{ color: 'var(--hm-primary)' }}>Full disclaimer →</a></span>
          </p>
        </div>
      </article>

      <article className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5">
        <h2 className="text-base font-bold flex items-center gap-2 mb-3">
          <span className="text-blue-400">🥗</span> Nutrition &amp; Diet Plan
        </h2>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
          A balanced diet rich in protein, calcium, and vitamin D3 is essential during adolescence to support bone
          elongation and reach your genetic height potential.
        </p>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-[#141414] border border-white/5">
            <div className="font-semibold text-slate-200 flex items-center gap-2">🥩 Proteins</div>
            <p className="text-slate-500 text-[13px] mt-1">Eggs, chicken, fish, lentils, Greek yogurt. Aim for 0.8–1.2 g per kg bodyweight daily.</p>
          </div>
          <div className="p-3 rounded-lg bg-[#141414] border border-white/5">
            <div className="font-semibold text-slate-200 flex items-center gap-2">🥛 Calcium</div>
            <p className="text-slate-500 text-[13px] mt-1">Milk, cheese, leafy greens, almonds, sardines. Target 1000–1300 mg daily for teens.</p>
          </div>
          <div className="p-3 rounded-lg bg-[#141414] border border-white/5">
            <div className="font-semibold text-slate-200 flex items-center gap-2">☀️ Vitamin D3</div>
            <p className="text-slate-500 text-[13px] mt-1">Sunlight (15 min/day), fatty fish, fortified milk. Supplement 600–1000 IU if deficient.</p>
          </div>
        </div>

        {/* YMYL Disclaimer — subtle notice under Nutrition section */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-[11px] leading-relaxed flex items-start gap-1.5" style={{ color: 'var(--hm-on-surface-variant)' }}>
            <span className="flex-shrink-0" style={{ color: 'var(--hm-tertiary)' }}>⚠️</span>
            <span><strong>Note:</strong> Consult a physician or registered dietitian before starting any diet program. Individual nutritional needs vary. <a href="/disclaimer" className="underline" style={{ color: 'var(--hm-primary)' }}>Full disclaimer →</a></span>
          </p>
        </div>
      </article>
    </section>
  );
}

function GrowthScienceArticle() {
  return (
    <article className="mt-6 bg-[#0d0d0d] border border-white/10 rounded-xl p-5 sm:p-7">
      <header className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100">
          The Science of{' '}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Human Growth
          </span>
        </h2>
        <p className="text-[12px] text-slate-500 mt-1">
          A practical guide to growth velocity, measurement standards, and the Tanner mid-parental formula
        </p>
      </header>

      <div className="prose prose-invert max-w-none space-y-4 text-slate-300 leading-relaxed text-sm sm:text-[15px]">

        <h3 className="text-lg font-bold text-white mb-2">How humans actually grow: a four-phase timeline</h3>
        <p>
          Human height isn't a steady climb — it happens in four distinct phases, each driven by different biological mechanisms. <strong>Phase one (infancy, 0–2 years)</strong> is the fastest: a newborn typically gains 25 cm in the first year alone, the highest growth velocity of any period in life. <strong>Phase two (childhood, 2 years to puberty onset)</strong> settles into a steady 5–7 cm per year, regulated primarily by growth hormone from the pituitary gland. <strong>Phase three (pubertal growth spurt, ages 10–14 in girls, 12–16 in boys)</strong> sees a temporary acceleration to 8–12 cm per year, driven by sex hormones (estrogen and testosterone) stacking on top of growth hormone. <strong>Phase four (post-puberty, until growth plate fusion)</strong> tapers off as the epiphyseal plates in the long bones harden, typically reaching zero by age 16–18 in girls and 18–21 in boys. Once the growth plates fuse, no exercise, diet, or supplement can lengthen the long bones.
        </p>

        <h3 className="text-lg font-bold text-white mt-6 mb-2">Growth velocity: why yearly tracking matters more than absolute height</h3>
        <p>
          Pediatric endocrinologists pay closer attention to <em>growth velocity</em> — how many centimeters a child grows per year — than to absolute height. A child who is consistently in the 25th percentile but growing at a normal rate of 6 cm/year is generally healthy. A child who drops from the 75th to the 25th percentile in two years, even if still within the "normal" range, may have an underlying issue: thyroid dysfunction, celiac disease, growth hormone deficiency, or chronic undernutrition. This is why pediatricians plot height on standardized growth charts (the CDC and WHO charts are the two most widely used) at every well-child visit from birth through adolescence. Any deviation of more than two major percentile lines warrants investigation.
        </p>
        <p>
          The Tanner mid-parental formula used in our calculator predicts the <em>midpoint</em> of the genetic target with a ±10 cm standard deviation. This means 95% of healthy children — given adequate nutrition, sleep, and absence of chronic disease — will land within ±20 cm of the predicted midpoint. The remaining 5% will fall outside this range, which is why endocrinologists treat growth prediction as a starting point, not a guarantee.
        </p>

        <h3 className="text-lg font-bold text-white mt-6 mb-2">Measurement standards: how to actually measure height correctly</h3>
        <p>
          A surprising amount of height variation comes not from biology but from <strong>measurement technique</strong>. The international standard, codified in the <em>Anthropometric Standardization Reference Manual</em> (Lohman, Roche &amp; Martorell, 1988), requires:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>A flat vertical wall (no baseboards) with a stadiometer mounted at a fixed 90° angle.</li>
          <li>The subject barefoot, in minimal clothing, standing with heels, buttocks, shoulder blades, and back of head touching the wall.</li>
          <li>The Frankfurt Plane: an imaginary line from the lower border of the eye to the upper border of the ear canal should be horizontal — this positions the head correctly.</li>
          <li>The subject inhales deeply and holds, lifting the chest. The stadiometer headpiece is lowered to make firm contact with the crown (not pressed into the hair).</li>
          <li>The measurement is read to the nearest 0.1 cm.</li>
        </ul>
        <p>
          Even with proper technique, your height fluctuates by 1–2 cm throughout the day: spinal discs compress under gravity during waking hours and rehydrate overnight. <strong>You are tallest in the early morning (within 30 minutes of waking) and shortest in the late evening.</strong> For consistency, pediatricians measure children at the same time of day for each visit. Self-reported heights in celebrity databases are notoriously unreliable — many actors and athletes round up by an inch or two, which is why this tool uses verified sources from Wikipedia (which itself cites primary interviews) wherever possible.
        </p>

        <h3 className="text-lg font-bold text-white mt-6 mb-2">The Tanner mid-parental formula: derivation and limitations</h3>
        <p>
          The mid-parental height formula was first published by James Mourilyan Tanner, Howard Goldstein, and Prunella Whitehouse in 1970 in the <em>Archives of Disease in Childhood</em>. Drawing on the Harpenden Growth Study — a longitudinal cohort of British children tracked from 1949 to 1971 — Tanner observed that a child's adult height correlated strongly with the average of their parents' heights, with a small sex-linked offset. The formula:
        </p>
        <div className="bg-[#0a0a0a] rounded-lg p-4 my-3 text-center font-mono text-blue-300 text-sm">
          <div>Boy: (Father's height + Mother's height + 13 cm) / 2</div>
          <div className="mt-2">Girl: (Father's height + Mother's height − 13 cm) / 2</div>
        </div>
        <p>
          The 13 cm offset reflects the average difference between adult men and adult women in the studied population — roughly 5 inches. The standard deviation of the prediction is approximately ±5.5 cm for a single child (Tanner's original figure was 5.3 cm), but when expressed as a "95% confidence range" it widens to ±10 cm. Our calculator uses the ±10 cm convention as it better reflects real-world variation in modern, multiethnic populations.
        </p>
        <p>
          The formula has known limitations. It assumes both biological parents are present and that the child has no chronic medical conditions. It performs less accurately for very tall or very short parents (above the 95th or below the 5th percentile), for adopted children whose biological parents are unknown, and for populations where the secular height trend differs significantly from mid-20th-century Britain. Modern refinements to the formula — such as the <em>Bayley-Pinneau method</em>, which incorporates bone-age X-rays — improve accuracy by 1–2 cm but require clinical imaging and so are beyond the scope of a browser tool.
        </p>

        <h3 className="text-lg font-bold text-white mt-6 mb-2">The 60/40 genetics-vs-lifestyle model</h3>
        <p>
          Twin studies (Silventoinen et al., 2003) estimate that <strong>genetics accounts for roughly 80% of the variation in adult height between individuals in developed countries</strong>. The remaining 20% reflects environmental factors: childhood nutrition (especially protein, calcium, and vitamin D), sleep quality (70% of growth hormone is released during deep sleep), chronic illness, and socioeconomic status. The 60/40 split used in our calculator's lifestyle quiz is a deliberately conservative interpretation of this research — it gives more weight to modifiable lifestyle factors than the genetic literature strictly supports, on the theory that users seeking the calculator may have actionable room for improvement.
        </p>
        <p>
          The lifestyle quiz adjusts the predicted target by ±1 to 4 cm based on three self-reported factors: screen time (a proxy for sleep disruption and sedentary behavior), physical activity (which stimulates growth hormone release), and diet quality (protein and micronutrient intake). A high lifestyle score (all three factors favorable) adds up to 4 cm — equivalent to about 18% of one standard deviation. This is a modest, realistic adjustment that reflects the upper end of what lifestyle interventions can plausibly achieve.
        </p>

        <h3 className="text-lg font-bold text-white mt-6 mb-2">Conversion standards: cm, inches, and the international yard</h3>
        <p>
          This tool supports both metric (centimeters, meters) and imperial (feet and inches) units. The conversion factors are defined by the <strong>International Yard and Pound Agreement of 1959</strong>, signed by the United States, United Kingdom, Canada, Australia, New Zealand, and South Africa: <code>1 inch = 2.54 cm exactly</code>, and <code>1 foot = 12 inches = 30.48 cm exactly</code>. Before 1959, the British inch (2.53998 cm) and the American inch (2.540005 cm) differed slightly, which caused measurable discrepancies in engineering drawings — hence the standardization.
        </p>
        <p>
          When converting centimeters to feet and inches, our calculator rounds the total inches to the nearest integer first, then derives feet and the remaining inches. This avoids a common bug — producing values like "5'12"" — that arises when inches are computed as a floating-point value and rounded independently.
        </p>

        <h3 className="text-lg font-bold text-white mt-6 mb-2">Growth plate fusion: the hard ceiling on height</h3>
        <p>
          The reason no supplement, exercise, or stretch can grow an adult's height past early adulthood is the <strong>epiphyseal plate</strong> — a cartilage layer at each end of the long bones (femur, tibia, humerus) that produces new bone cells throughout childhood and adolescence. Under the influence of growth hormone, thyroid hormone, and (during puberty) sex hormones, this cartilage keeps producing bone faster than it can be replaced. Eventually, rising estrogen levels (in both sexes — boys convert testosterone to estrogen via aromatase) trigger the plate to ossify. Once the plate fully fuses into solid bone — typically between ages 14–16 in girls and 16–18 in boys, with some variation up to age 21 — no further longitudinal bone growth is biologically possible.
        </p>
        <p>
          This is why our calculator's lifestyle quiz is most actionable for users still in their growth years (under ~18). For adults past plate fusion, the only height gains come from <strong>posture correction</strong> (which can reclaim 1–4 cm of "lost" height that poor posture was hiding) and from <strong>spinal decompression</strong> via bar hanging or inversion therapy (a temporary 1–2 cm increase that disappears within hours of standing). Any product claiming to "grow taller" for adults — whether pills, insoles, or stretch machines — is a scam.
        </p>

        <h3 className="text-lg font-bold text-white mt-6 mb-2">WHO vs CDC growth charts: what's the difference?</h3>
        <p>
          Two standardized growth chart systems are used worldwide. The <strong>WHO Child Growth Standards</strong> (2006) were derived from a multiethnic, breast-fed, optimally-nourished cohort of children from Brazil, Ghana, India, Norway, Oman, and the USA — designed to describe how children <em>should</em> grow under ideal conditions. The <strong>CDC Growth Charts</strong> (2000) were derived from a representative sample of American children — describing how children <em>actually</em> grow in a typical developed-country population. The WHO charts are used internationally for ages 0–5; the CDC charts are used for ages 2–20 in the US. Both charts express height as a percentile (e.g., "75th percentile" means taller than 75% of same-age, same-sex peers).
        </p>
        <p>
          When our calculator reports a child's predicted adult height, it can be cross-referenced against the CDC's 20-year-old percentile to determine where the child will land relative to the broader adult population. A predicted adult height of 175 cm for a boy, for example, lands near the 25th percentile for adult American men — well within the "normal" range, just on the shorter side of average.
        </p>

        <h3 className="text-lg font-bold text-white mt-6 mb-2">Why we built this tool</h3>
        <p>
          Most height comparison tools on the web are cluttered with popups, paywalls, or stale celebrity databases. We wanted to build something clean, fast, mobile-friendly, and medically literate — a tool that respects users' privacy (no server-side data storage), supports both metric and imperial units natively, and provides transparent, source-cited medical information. The calculator is free, will remain free, and is supported by lightweight contextual content rather than user payments. If you spot an error or want to request a feature, please <a href="/contact" className="text-blue-400 hover:underline">contact us</a>.
        </p>

      </div>

      {/* Author byline inside the article for E-A-T */}
      <div className="mt-6 pt-4 border-t border-white/10 text-[12px] text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span><span className="text-slate-400 font-semibold">Author:</span> Height Comparison Tool Team</span>
        <span><span className="text-slate-400 font-semibold">Last Updated:</span> September 26, 2026</span>
        <a href="/editorial-guidelines" className="text-blue-400 hover:underline">Editorial Guidelines</a>
      </div>
    </article>
  );
}

function HomeFAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="mt-6">
      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-100">
          Frequently Asked{' '}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Questions</span>
        </h2>
        <p className="text-[12px] text-slate-500 mt-1">Everything you need to know about height comparison</p>
      </div>
      <div className="space-y-2 max-w-3xl mx-auto">
        {FAQS.map((f, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className={`rounded-xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border-blue-500/40'
                  : 'bg-[#0d0d0d] border-white/10 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-3 p-4 text-left"
                aria-expanded={isOpen}
              >
                <span className={`text-sm font-bold flex items-center gap-2 ${isOpen ? 'text-blue-300' : 'text-slate-200'}`}>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold transition ${
                    isOpen ? 'bg-blue-500 text-white' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {f.q}
                </span>
                <svg
                  className={`flex-shrink-0 w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-45 text-blue-400' : 'text-slate-500'}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <div
                className="grid transition-all duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 pl-12 text-[13px] text-slate-400 leading-relaxed">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center mt-5">
        <button
          onClick={() => navigate('calculator')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition text-white text-sm font-bold shadow-lg shadow-blue-500/30"
        >
          <span>🧮</span> Try the Child Height Calculator
        </button>
      </div>
    </section>
  );
}
