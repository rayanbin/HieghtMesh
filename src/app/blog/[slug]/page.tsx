'use client';

import Link from 'next/link';
import { use } from 'react';
import { BLOG_POSTS, BlogPost } from '@/lib/blog-posts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogArticlePage({ params }: PageProps) {
  const { slug } = use(params);
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--hm-surface)' }}>
        <div className="text-center">
          <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--hm-on-surface)' }}>Article Not Found</h1>
          <p className="mb-6" style={{ color: 'var(--hm-on-surface-variant)' }}>This article doesn't exist or was removed.</p>
          <Link href="/blog" className="px-5 py-2.5 rounded-lg font-bold text-white" style={{ background: 'var(--hm-primary)' }}>
            ← Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  // Parse content once during render — pure function, no state needed
  const contentHtml = parseContent(post.content);
  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 2);

  return (
    <main className="min-h-screen" style={{ background: 'var(--hm-surface)' }}>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Breadcrumb */}
        <nav className="mb-6 text-[12px]" style={{ color: 'var(--hm-on-surface-variant)' }} aria-label="Breadcrumb">
          <Link href="/" className="hover:underline" style={{ color: 'var(--hm-primary)' }}>Home</Link>
          {' / '}
          <Link href="/blog" className="hover:underline" style={{ color: 'var(--hm-primary)' }}>Blog</Link>
          {' / '}
          <span style={{ color: 'var(--hm-on-surface-variant)' }}>{post.category}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
              style={{
                background: 'var(--hm-surface-container)',
                color: 'var(--hm-primary)',
                border: '1px solid var(--hm-outline-variant)',
              }}
            >
              {post.category}
            </span>
            <span className="text-[12px]" style={{ color: 'var(--hm-outline)' }}>{post.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-4" style={{ color: 'var(--hm-on-surface)' }}>
            {post.title}
          </h1>

          <p className="text-base sm:text-lg leading-relaxed mb-5" style={{ color: 'var(--hm-on-surface-variant)' }}>
            {post.excerpt}
          </p>

          {/* Byline */}
          <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--hm-outline-variant)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--hm-primary)', color: '#ffffff' }}>
              HE
            </div>
            <div className="text-[12px]" style={{ color: 'var(--hm-on-surface-variant)' }}>
              <div className="font-bold" style={{ color: 'var(--hm-on-surface)' }}>{post.author}</div>
              <div>Published {post.publishedAt} · Reviewed per <Link href="/editorial-guidelines" className="hover:underline" style={{ color: 'var(--hm-primary)' }}>Editorial Guidelines</Link></div>
            </div>
          </div>
        </header>

        {/* Body */}
        <section
          className="blog-body"
          style={{ color: 'var(--hm-on-surface-variant)' }}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Tags */}
        <footer className="mt-10 pt-6 border-t" style={{ borderColor: 'var(--hm-outline-variant)' }}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-sm mr-2">Tags:</span>
            {post.keywords.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-[11px] font-semibold"
                style={{ background: 'var(--hm-surface-container)', color: 'var(--hm-on-surface-variant)', border: '1px solid var(--hm-outline-variant)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </footer>

        {/* Medical disclaimer (for health content) */}
        <div
          className="mt-8 p-4 rounded-lg"
          style={{ background: 'var(--hm-surface-container)', border: '1px solid var(--hm-outline-variant)' }}
        >
          <div className="text-[11px] leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
            <strong style={{ color: 'var(--hm-tertiary)' }}>⚠️ Medical Disclaimer:</strong> This article is for educational purposes only and is not a substitute for professional medical advice. Always consult a licensed pediatrician or qualified health provider with questions about your child's growth, nutrition, or exercise program.
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--hm-on-surface)' }}>Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map(rel => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="block p-4 rounded-lg transition hover:translate-y-[-2px]"
                  style={{ background: 'var(--hm-surface-container)', border: '1px solid var(--hm-outline-variant)' }}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--hm-primary)' }}>{rel.category}</div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--hm-on-surface)' }}>{rel.title}</h3>
                  <p className="text-[12px] leading-relaxed line-clamp-2" style={{ color: 'var(--hm-on-surface-variant)' }}>{rel.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition"
            style={{ background: 'var(--hm-surface-container)', color: 'var(--hm-on-surface)', border: '1px solid var(--hm-outline-variant)' }}
          >
            ← All Blog Articles
          </Link>
        </div>
      </article>

      <style jsx global>{`
        .blog-body h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--hm-on-surface);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .blog-body p {
          font-size: 15px;
          line-height: 1.75;
          margin-bottom: 1rem;
          color: var(--hm-on-surface-variant);
        }
        .blog-body strong {
          color: var(--hm-on-surface);
          font-weight: 600;
        }
        .blog-body ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .blog-body li {
          font-size: 15px;
          line-height: 1.75;
          margin-bottom: 0.5rem;
          color: var(--hm-on-surface-variant);
        }
      `}</style>
    </main>
  );
}

/**
 * Parse simple markdown-like content into HTML.
 * Supports: # Heading 1, ## Heading 2, paragraphs, unordered lists.
 */
function parseContent(content: string): string {
  const lines = content.split('\n');
  let html = '';
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') {
      if (inList) { html += '</ul>'; inList = false; }
      continue;
    }
    if (trimmed.startsWith('# ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h1>${escapeHtml(trimmed.slice(2))}</h1>`;
    } else if (trimmed.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2>${escapeHtml(trimmed.slice(3))}</h2>`;
    } else if (trimmed.startsWith('- ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${formatInline(trimmed.slice(2))}</li>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p>${formatInline(trimmed)}</p>`;
    }
  }
  if (inList) html += '</ul>';
  return html;
}

function formatInline(text: string): string {
  // Bold: **text**
  return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
