'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--hm-surface)' }}>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Breadcrumb */}
        <nav className="mb-6 text-[12px]" style={{ color: 'var(--hm-on-surface-variant)' }} aria-label="Breadcrumb">
          <Link href="/" className="hover:underline" style={{ color: 'var(--hm-primary)' }}>Home</Link>
          {' / '}
          <span style={{ color: 'var(--hm-on-surface-variant)' }}>About</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--hm-on-surface)' }}>
            About{' '}
            <span style={{ background: 'linear-gradient(to right, var(--hm-primary), var(--hm-tertiary))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              HeightMesh
            </span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
            A free, fast, and privacy-first height comparison tool with a pediatric-grade child height predictor and 10 animated growth exercises.
          </p>
        </header>

        {/* Body */}
        <section className="space-y-6">

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>Our Mission</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              HeightMesh was built by a small team of frontend engineers and pediatric-formula enthusiasts who were frustrated by the lack of a clean, ad-light, mobile-friendly height comparison experience. Most existing tools were cluttered with popups, paid signup walls, or stale celebrity data — so we built our own. Our goal is to provide a fast, free, and accurate visual tool for comparing the heights of people, celebrities, and everyday objects — without paywalls, account creation, or invasive tracking.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>What We Built</h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--hm-on-surface-variant)' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--hm-primary)' }}>▸</span>
                <span><strong style={{ color: 'var(--hm-on-surface)' }}>Dynamic auto-scaling chart</strong> — grows from 200 cm up to 50,000+ cm (500 m) as you add tall entities like the Eiffel Tower or Empire State Building.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--hm-primary)' }}>▸</span>
                <span><strong style={{ color: 'var(--hm-on-surface)' }}>Child Height Prediction</strong> — uses the clinically validated Tanner mid-parental formula with an optional lifestyle quiz that adjusts the prediction within the ±10 cm genetic range.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--hm-primary)' }}>▸</span>
                <span><strong style={{ color: 'var(--hm-on-surface)' }}>10 animated SVG exercises</strong> — Cobra Stretch, Bar Hanging, Pelvic Tilt, Forward Bend, Cat-Cow, Pike Stretch, Wall Slides, Superman Hold, Triangle Pose, and Child's Pose — each with a 30-second timer and step-by-step instructions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--hm-primary)' }}>▸</span>
                <span><strong style={{ color: 'var(--hm-on-surface)' }}>58-celebrity library</strong> with verified heights, plus live Wikipedia search for any celebrity not in our database.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--hm-primary)' }}>▸</span>
                <span><strong style={{ color: 'var(--hm-on-surface)' }}>Blog</strong> with evidence-based health and fitness guides, each 1,000+ words and reviewed per our editorial guidelines.</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>Editorial Standards</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              All medical and growth-related content on this site is reviewed against peer-reviewed pediatric literature. The mid-parental formula is sourced from J.M. Tanner's original 1970 publication in <em>Archives of Disease in Childhood</em>. Exercise instructions are adapted from the American Academy of Pediatrics' physical activity guidelines. We update our celebrity height database quarterly based on Wikipedia revisions and primary source verification. Read our full{' '}
              <Link href="/editorial-guidelines" className="underline" style={{ color: 'var(--hm-primary)' }}>Editorial Guidelines</Link>{' '}for our content review process.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>Privacy First</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              HeightMesh runs 100% client-side. All characters you add, calculator inputs, and preferences are stored only in your browser's memory and are permanently lost when you close or refresh the page. We do not use tracking, advertising, or analytics cookies. The only external call is Wikipedia search for celebrity images, sent directly from your browser to Wikipedia. Read our full{' '}
              <Link href="/privacy-policy" className="underline" style={{ color: 'var(--hm-primary)' }}>Privacy Policy</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>Pricing</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              <strong style={{ color: 'var(--hm-on-surface)' }}>100% free ($0 USD).</strong> No subscriptions, paid plans, signups, or credit card requirements. Every feature — visual comparison, child height prediction, growth exercises, celebrity search, and blog — is available at no cost. There is nothing to cancel or refund because no billing exists.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>Contact</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              Questions, corrections, or feedback? Visit our{' '}
              <Link href="/contact" className="underline" style={{ color: 'var(--hm-primary)' }}>Contact page</Link>{' '}
              or email us directly at{' '}
              <a href="mailto:spacexrayan@gmail.com" className="underline" style={{ color: 'var(--hm-primary)' }}>spacexrayan@gmail.com</a>.
              We typically respond within 2–3 business days.
            </p>
          </div>

        </section>

        {/* Byline */}
        <footer className="mt-10 pt-6 border-t" style={{ borderColor: 'var(--hm-outline-variant)' }}>
          <div className="text-[12px]" style={{ color: 'var(--hm-on-surface-variant)' }}>
            <span className="font-semibold" style={{ color: 'var(--hm-on-surface)' }}>Author:</span> HeightMesh Editorial Team ·{' '}
            <span className="font-semibold" style={{ color: 'var(--hm-on-surface)' }}>Last Updated:</span> September 27, 2026
          </div>
        </footer>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition"
            style={{ background: 'var(--hm-surface-container)', color: 'var(--hm-on-surface)', border: '1px solid var(--hm-outline-variant)' }}>
            ← Back to HeightMesh
          </Link>
        </div>
      </article>
    </main>
  );
}
