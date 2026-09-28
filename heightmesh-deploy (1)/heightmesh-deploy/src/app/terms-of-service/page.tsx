'use client';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--hm-surface)' }}>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <nav className="mb-6 text-[12px]" style={{ color: 'var(--hm-on-surface-variant)' }} aria-label="Breadcrumb">
          <Link href="/" className="hover:underline" style={{ color: 'var(--hm-primary)' }}>Home</Link>
          {' / '}
          <span style={{ color: 'var(--hm-on-surface-variant)' }}>Terms of Service</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--hm-on-surface)' }}>
            Terms of{' '}
            <span style={{ background: 'linear-gradient(to right, var(--hm-primary), var(--hm-tertiary))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Service</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--hm-outline)' }}>Last updated: September 27, 2026</p>
        </header>

        <section className="space-y-6">
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>1. Service Description</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>The Service is a free, browser-based tool that allows users to visually compare the heights of people, celebrities, animals, and objects on a dynamically scaling chart. It also includes a Child Height Prediction calculator based on the mid-parental (Tanner) formula, and a library of 10 animated growth exercises.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>2. Pricing &amp; Billing</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>The Service is <strong style={{ color: 'var(--hm-on-surface)' }}>100% free</strong>. There are no paid plans, subscriptions, signup requirements, or credit card collections. Because no billing exists, there is no cancellation or refund policy applicable. You may stop using the Service at any time without obligation.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>3. No Medical Advice</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>The Child Height Prediction calculator provides an <strong style={{ color: 'var(--hm-on-surface)' }}>educational estimate only</strong> and is not a medical diagnosis, treatment, or substitute for professional medical advice. The mid-parental formula has a typical variation of ±10 cm. Always consult a licensed pediatrician or pediatric endocrinologist for growth concerns. See our <Link href="/disclaimer" className="underline" style={{ color: 'var(--hm-primary)' }}>Medical Disclaimer</Link>.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>4. Intellectual Property</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>All source code, SVG silhouettes, exercise animations, and original text content on this site are © 2026 HeightMesh. Wikipedia content (celebrity names, descriptions, images) is licensed under the <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--hm-primary)' }}>CC BY-SA 3.0</a> license and attributed to Wikipedia contributors.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>5. Acceptable Use</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>You agree not to: use the Service for any unlawful purpose; attempt to reverse-engineer, scrape, or overload the Service; submit malicious scripts or inputs to the calculator fields; or misrepresent the calculator results as medical diagnoses.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>6. Disclaimer of Warranties</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>The Service is provided "as is" without warranty of any kind. We do not guarantee that height calculations, celebrity heights, or exercise instructions are accurate, complete, or suitable for any particular purpose.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>7. Limitation of Liability</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>8. Changes to Terms</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>9. Contact</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>For legal inquiries, contact <a href="mailto:spacexrayan@gmail.com" className="underline" style={{ color: 'var(--hm-primary)' }}>spacexrayan@gmail.com</a> or visit our <Link href="/contact" className="underline" style={{ color: 'var(--hm-primary)' }}>Contact page</Link>.</p></div>
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
