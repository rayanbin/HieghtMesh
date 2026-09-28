'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BLOG_POSTS, BLOG_CATEGORIES, BlogPost } from '@/lib/blog-posts';

export default function BlogPage() {
  const [activeCat, setActiveCat] = useState<string>('All');

  const filtered = activeCat === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === activeCat);

  return (
    <main className="min-h-screen" style={{ background: 'var(--hm-surface)' }}>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: 'var(--hm-surface-container)', border: '1px solid var(--hm-outline-variant)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--hm-primary)' }}></span>
            <span className="label-sm">Health &amp; Fitness Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--hm-on-surface)' }}>
            The HeightMesh{' '}
            <span style={{ background: 'linear-gradient(to right, var(--hm-primary), var(--hm-tertiary))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              Blog
            </span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base" style={{ color: 'var(--hm-on-surface-variant)' }}>
            Evidence-based guides on growth, posture, nutrition, and fitness — written by our editorial team and reviewed against peer-reviewed pediatric literature.
          </p>
        </div>

        {/* Category filter */}
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Blog categories">
          {BLOG_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className="px-4 py-2 rounded-full text-xs font-bold transition"
              style={{
                background: activeCat === cat ? 'var(--hm-primary)' : 'var(--hm-surface-container)',
                color: activeCat === cat ? '#ffffff' : 'var(--hm-on-surface-variant)',
                border: `1px solid ${activeCat === cat ? 'var(--hm-primary)' : 'var(--hm-outline-variant)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </nav>
      </section>

      {/* Article grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--hm-outline)' }}>
            <div className="text-4xl mb-3 opacity-40">📝</div>
            <p className="text-sm font-semibold">No articles in this category yet.</p>
          </div>
        )}
      </section>

      {/* Author byline + back link */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 border-t pt-8" style={{ borderColor: 'var(--hm-outline-variant)' }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]" style={{ color: 'var(--hm-on-surface-variant)' }}>
          <div>
            <span className="font-semibold">Editorial Team:</span> HeightMesh Editorial Team ·{' '}
            <span className="font-semibold">Last Updated:</span> September 26, 2026 ·{' '}
            <Link href="/editorial-guidelines" className="hover:underline" style={{ color: 'var(--hm-primary)' }}>Editorial Guidelines</Link>
          </div>
          <Link href="/" className="hover:underline font-semibold" style={{ color: 'var(--hm-primary)' }}>
            ← Back to Height Comparison Tool
          </Link>
        </div>
      </section>
    </main>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article
      className="rounded-xl p-5 transition-all hover:translate-y-[-2px]"
      style={{
        background: 'var(--hm-surface-container)',
        border: '1px solid var(--hm-outline-variant)',
      }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: 'var(--hm-surface-container-high)',
              color: 'var(--hm-primary)',
              border: '1px solid var(--hm-outline-variant)',
            }}
          >
            {post.category}
          </span>
          <span className="text-[11px]" style={{ color: 'var(--hm-outline)' }}>
            {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold leading-snug mb-2" style={{ color: 'var(--hm-on-surface)' }}>
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--hm-on-surface-variant)' }}>
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--hm-outline-variant)' }}>
          <span className="text-[11px]" style={{ color: 'var(--hm-outline)' }}>{post.author}</span>
          <span className="text-[11px] tnum" style={{ color: 'var(--hm-primary)' }}>Read article →</span>
        </div>
      </Link>
    </article>
  );
}
