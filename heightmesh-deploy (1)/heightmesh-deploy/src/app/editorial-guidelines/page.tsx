'use client';
import Link from 'next/link';

export default function EditorialGuidelinesPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--hm-surface)' }}>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <nav className="mb-6 text-[12px]" style={{ color: 'var(--hm-on-surface-variant)' }} aria-label="Breadcrumb">
          <Link href="/" className="hover:underline" style={{ color: 'var(--hm-primary)' }}>Home</Link>
          {' / '}
          <span style={{ color: 'var(--hm-on-surface-variant)' }}>Editorial Guidelines</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--hm-on-surface)' }}>
            Editorial{' '}
            <span style={{ background: 'linear-gradient(to right, var(--hm-primary), var(--hm-tertiary))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Guidelines</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--hm-outline)' }}>Last updated: September 27, 2026</p>
        </header>

        <section className="space-y-6">
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>1. Sourcing &amp; Verification</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>Celebrity heights are sourced from Wikipedia, which cites primary sources (interviews, official biographies, sports league records). We update our database quarterly. The mid-parental formula is sourced from J.M. Tanner, H. Goldstein, and P.H. Whitehouse (1970), "Standards for Children's Height at Ages 2–9 Years Allowing for Height of Parents," <em>Archives of Disease in Childhood</em>. Exercise instructions are adapted from the American Academy of Pediatrics physical activity guidelines and peer-reviewed physiotherapy literature. Conversion factors use the international standard where 1 inch = 2.54 cm exactly.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>2. Medical Review</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>All content involving medical formulas, growth prediction, or posture guidance is reviewed by a volunteer reviewer with background in pediatric endocrinology or physiotherapy. The reviewer verifies accuracy of the formula and its stated standard deviation, appropriateness of the displayed range, clarity of the medical disclaimer, and safety of exercise instructions including contraindications.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>3. Update Frequency</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>Celebrity database: quarterly. Exercise library: annually, or as new evidence emerges. Calculator formula: updated only when consensus changes in the pediatric literature. Legal pages: annually or upon regulatory changes.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>4. Corrections Policy</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>If you spot an error, please contact <a href="mailto:spacexrayan@gmail.com" className="underline" style={{ color: 'var(--hm-primary)' }}>spacexrayan@gmail.com</a>. We investigate all reports within 5 business days and publish corrections with a dated "Last updated" note on the affected page.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>5. Author Byline</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>Every long-form article and the calculator itself display an author byline ("HeightMesh Editorial Team") and a "Last updated" date. The full author and reviewer list is available on the <Link href="/about" className="underline" style={{ color: 'var(--hm-primary)' }}>About page</Link>.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>6. Conflict of Interest</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>The HeightMesh team has no financial relationships with supplement brands, growth hormone manufacturers, or fitness equipment vendors. We do not accept sponsored content or paid placements. Any future advertising (e.g., Google AdSense) will be clearly labeled and segregated from editorial content.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>7. AI &amp; Automation Disclosure</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>Source code is written by human engineers. Some long-form text on the site (e.g., exercise benefit descriptions) may be drafted with AI assistance and then reviewed, edited, and verified by a human editor. We never publish AI-generated medical claims without verification against peer-reviewed sources.</p></div>
        </section>

        <footer className="mt-10 pt-6 border-t" style={{ borderColor: 'var(--hm-outline-variant)' }}>
          <div className="text-[12px]" style={{ color: 'var(--hm-on-surface-variant)' }}>
            <span className="font-semibold" style={{ color: 'var(--hm-on-surface)' }}>Author:</span> HeightMesh Editorial Team ·{' '}
            <span className="font-semibold" style={{ color: 'var(--hm-on-surface)' }}>Last Updated:</span> September 27, 2026
          </div>
        </footer>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition" style={{ background: 'var(--hm-surface-container)', color: 'var(--hm-on-surface)', border: '1px solid var(--hm-outline-variant)' }}>← Back to HeightMesh</Link>
        </div>
      </article>
    </main>
  );
}
