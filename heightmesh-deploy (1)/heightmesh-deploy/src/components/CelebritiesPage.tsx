'use client';

import { useState } from 'react';
import { CELEB_DB, CELEB_QUICK, formatImperial, formatMetric, CharType, Character } from '@/lib/height-data';

interface Props {
  onAdd: (char: Omit<Character, 'id'>) => void;
  onToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Athletes: '#f59e0b',
  Actors: '#ec4899',
  Musicians: '#a855f7',
  Politicians: '#10b981',
  Entrepreneurs: '#06b6d4',
  Historical: '#1e40af',
  Other: '#94a3b8',
};

// Categorize all celebrities
function categorize(name: string): string {
  const athletes = ['Cristiano Ronaldo', 'Lionel Messi', 'LeBron James', "Shaquille O'Neal", 'Usain Bolt', 'Michael Jordan', 'Kobe Bryant', 'Stephen Curry', 'Conor McGregor', 'Mike Tyson', 'Floyd Mayweather', 'Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Yao Ming', 'Sultan Kösen'];
  const actors = ['Tom Cruise', 'Emma Watson', 'Robert Downey Jr.', 'Dwayne Johnson', 'Vin Diesel', 'Brad Pitt', 'Angelina Jolie', 'Jennifer Lawrence', 'Scarlett Johansson', 'Chris Hemsworth', 'Chris Evans', 'Tom Hanks', 'Leonardo DiCaprio'];
  const musicians = ['Taylor Swift', 'Ariana Grande', 'Kanye West', 'Jay-Z', 'Beyoncé', 'Rihanna', 'Adele', 'Ed Sheeran', 'Justin Bieber', 'Selena Gomez', 'Katy Perry', 'Lady Gaga'];
  const politicians = ['Barack Obama', 'Donald Trump', 'Joe Biden', 'Abraham Lincoln', 'Napoleon Bonaparte'];
  const entrepreneurs = ['Elon Musk', 'Jeff Bezos', 'Mark Zuckerberg', 'Bill Gates', 'Steve Jobs'];
  const historical = ['Albert Einstein', 'Isaac Newton', 'Robert Wadlow'];
  if (athletes.includes(name)) return 'Athletes';
  if (actors.includes(name)) return 'Actors';
  if (musicians.includes(name)) return 'Musicians';
  if (politicians.includes(name)) return 'Politicians';
  if (entrepreneurs.includes(name)) return 'Entrepreneurs';
  if (historical.includes(name)) return 'Historical';
  return 'Other';
}

const SORTS = [
  { id: 'tallest', label: 'Tallest first' },
  { id: 'shortest', label: 'Shortest first' },
  { id: 'name', label: 'A → Z' },
] as const;

export default function CelebritiesPage({ onAdd, onToast }: Props) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [sort, setSort] = useState<typeof SORTS[number]['id']>('tallest');

  const allCelebs = Object.entries(CELEB_DB).map(([name, height]) => ({
    name,
    height,
    color: CATEGORY_COLORS[categorize(name)] || '#94a3b8',
    type: 'male' as CharType,
    category: categorize(name),
  }));

  const categories = ['All', ...Array.from(new Set(allCelebs.map(c => c.category)))];

  const filtered = allCelebs.filter(c => {
    const matchQ = !query || c.name.toLowerCase().includes(query.toLowerCase());
    const matchCat = activeCat === 'All' || c.category === activeCat;
    return matchQ && matchCat;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'tallest') return b.height - a.height;
    if (sort === 'shortest') return a.height - b.height;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Celebrity{' '}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Heights Library
          </span>
        </h1>
        <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Browse verified heights of {allCelebs.length} celebrities, athletes, actors, musicians, and historical figures.
          Click any card to add them to your comparison chart.
        </p>
      </div>

      {/* Search + sort */}
      <div className="bg-[#141414] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search celebrities..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-slate-600 bg-[#0d0d0d]"
          />
        </div>
        <div className="flex gap-1.5">
          {SORTS.map(s => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                sort === s.id ? 'bg-blue-500 text-white' : 'bg-[#0d0d0d] border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              activeCat === c ? 'bg-blue-500 text-white' : 'bg-[#141414] border border-white/10 text-slate-400 hover:text-white hover:border-white/30'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Total celebs" value={allCelebs.length.toString()} />
        <StatBox label="Tallest" value={`${Math.max(...allCelebs.map(c => c.height))} cm`} />
        <StatBox label="Shortest" value={`${Math.min(...allCelebs.map(c => c.height))} cm`} />
        <StatBox label="Average" value={`${Math.round(allCelebs.reduce((s, c) => s + c.height, 0) / allCelebs.length)} cm`} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map(c => (
          <button
            key={c.name}
            onClick={() => {
              onAdd({ name: c.name, height: c.height, type: c.type, color: c.color });
              onToast(`${c.name} added!`, 'success');
            }}
            className="bg-[#141414] border border-white/10 hover:border-blue-500 hover:bg-[#1a1a1a] transition rounded-xl p-4 text-left flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: `${c.color}22`, border: `1px solid ${c.color}55` }}>
              <div className="w-6 h-6 rounded-md" style={{ background: c.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-100 truncate">{c.name}</div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span className="text-blue-400 font-bold tabular-nums">{formatMetric(c.height)}</span>
                <span className="tabular-nums">{formatImperial(c.height)}</span>
              </div>
              <div className="text-[10px] text-slate-600 mt-0.5">{c.category}</div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <div className="text-4xl mb-2 opacity-40">🔍</div>
          No celebrities match your search.
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#141414] border border-white/10 rounded-xl p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</div>
      <div className="text-lg font-bold text-blue-400 tabular-nums mt-1">{value}</div>
    </div>
  );
}
