'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--hm-surface)' }}>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Breadcrumb */}
        <nav className="mb-6 text-[12px]" style={{ color: 'var(--hm-on-surface-variant)' }} aria-label="Breadcrumb">
          <Link href="/" className="hover:underline" style={{ color: 'var(--hm-primary)' }}>Home</Link>
          {' / '}
          <span style={{ color: 'var(--hm-on-surface-variant)' }}>Privacy Policy</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--hm-on-surface)' }}>
            Privacy{' '}
            <span style={{ background: 'linear-gradient(to right, var(--hm-primary), var(--hm-tertiary))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              Policy
            </span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--hm-outline)' }}>Last updated: September 27, 2026</p>
        </header>

        {/* Key summary box */}
        <div className="p-5 rounded-xl border mb-8" style={{ borderColor: 'rgba(72, 125, 151, 0.4)', background: 'rgba(72, 125, 151, 0.05)' }}>
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--hm-primary)' }}>🔒 Privacy Summary</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
            HeightMesh runs entirely client-side in your browser. We do not collect, store, or transmit any personal data. No tracking cookies. No analytics. No server-side data storage. The only external request is Wikipedia search for celebrity images, sent directly from your browser.
          </p>
        </div>

        {/* Body */}
        <section className="space-y-6">

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>1. Data We Collect</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              <strong style={{ color: 'var(--hm-on-surface)' }}>We do not collect, store, or transmit any personal data.</strong> All characters you add to the comparison chart, all calculator inputs (parents' heights, lifestyle quiz answers), and all preferences (color selections, unit toggles) are stored only in your browser's memory (JavaScript state) and are permanently lost the moment you close or refresh the page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>2. Wikipedia API Requests</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              When you use the celebrity search feature, your search query is sent directly from your browser to the Wikipedia REST API (<code style={{ color: 'var(--hm-primary)' }}>en.wikipedia.org</code>) to retrieve celebrity names, profile images, and descriptions. This request is governed by the{' '}
              <a href="https://foundation.wikimedia.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--hm-primary)' }}>Wikimedia Foundation Privacy Policy</a>. We do not proxy or intercept these requests.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>3. Cookies</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              This site does not use cookies for tracking, advertising, or analytics. The only browser storage we use is <code style={{ color: 'var(--hm-primary)' }}>localStorage</code> for the cookie consent banner preference (whether you accepted or dismissed the GDPR/CCPA notice). No identifiers, fingerprinting, or session IDs are stored.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>4. Google Analytics</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              We may use Google Analytics 4 (GA4) in the future to collect aggregate, anonymized traffic statistics (page views, country-level geography, device type). GA4 will be configured with IP anonymization and will not track individual user behavior across sessions. You can opt out by using browser extensions like{' '}
              <a href="https://privacybadger.org/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--hm-primary)' }}>Privacy Badger</a> or by enabling Do Not Track in your browser.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>5. Contact Form</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              When you submit the contact form on our{' '}
              <Link href="/contact" className="underline" style={{ color: 'var(--hm-primary)' }}>Contact page</Link>, your name, email, subject, and message are transmitted via Formspree to our email address (<a href="mailto:spacexrayan@gmail.com" className="underline" style={{ color: 'var(--hm-primary)' }}>spacexrayan@gmail.com</a>). Formspree processes the submission on their servers per their{' '}
              <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--hm-primary)' }}>Privacy Policy</a>. Your email is used solely to respond to your inquiry and is never added to a mailing list.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>6. Children's Privacy</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              The Child Height Prediction calculator is a tool for parents and guardians to estimate a child's adult height. We do not knowingly collect any personal information from children under 13 (or the equivalent minimum age in your jurisdiction). If you believe a child has provided us with personal information, please contact us so we can delete it.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>7. Your Rights (GDPR / CCPA)</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you have the right to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm" style={{ color: 'var(--hm-on-surface-variant)' }}>
              <li>Know what personal information is collected (answer: none from our app itself)</li>
              <li>Request deletion of personal information (not applicable — nothing is stored server-side)</li>
              <li>Opt out of the sale of personal information (we never sell data)</li>
              <li>Non-discrimination for exercising your privacy rights</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>8. Third-Party Ad Networks</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              If we display ads in the future via Google AdSense, those ads may use cookies to serve relevant content. We will update this policy and display a GDPR/CCPA consent banner before enabling any ad network. Currently, no advertising cookies are used.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>9. Changes to This Policy</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. Continued use of the Service after changes constitutes acceptance of the new policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>10. Contact Us</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>
              For privacy questions or requests, contact us at{' '}
              <a href="mailto:spacexrayan@gmail.com" className="underline" style={{ color: 'var(--hm-primary)' }}>spacexrayan@gmail.com</a>{' '}
              or visit our{' '}
              <Link href="/contact" className="underline" style={{ color: 'var(--hm-primary)' }}>Contact page</Link>.
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
