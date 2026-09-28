'use client';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--hm-surface)' }}>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <nav className="mb-6 text-[12px]" style={{ color: 'var(--hm-on-surface-variant)' }} aria-label="Breadcrumb">
          <Link href="/" className="hover:underline" style={{ color: 'var(--hm-primary)' }}>Home</Link>
          {' / '}
          <span style={{ color: 'var(--hm-on-surface-variant)' }}>Contact</span>
        </nav>

        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--hm-on-surface)' }}>
            Get in{' '}
            <span style={{ background: 'linear-gradient(to right, var(--hm-primary), var(--hm-tertiary))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Touch</span>
          </h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--hm-on-surface-variant)' }}>
            Questions, celebrity requests, bug reports, or partnership ideas — we read every message.
          </p>
        </header>

        <div className="bg-[#0d0e11] border rounded-2xl p-6 sm:p-8 space-y-5" style={{ borderColor: 'var(--hm-outline-variant)' }}>
          {/* Direct email */}
          <div className="text-center pb-4 border-b" style={{ borderColor: 'var(--hm-outline-variant)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--hm-on-surface-variant)' }}>Direct Email</div>
            <a href="mailto:spacexrayan@gmail.com" className="text-sm font-bold underline" style={{ color: 'var(--hm-primary)' }}>spacexrayan@gmail.com</a>
            <p className="text-[11px] mt-2" style={{ color: 'var(--hm-outline)' }}>We typically respond within 2–3 business days.</p>
          </div>

          {/* Formspree form */}
          <form id="contactForm" action="https://formspree.io/f/spacexrayan@gmail.com" method="POST" noValidate>
            <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-semibold mb-1.5" style={{ color: 'var(--hm-on-surface-variant)' }}>Full Name *</label>
                <input type="text" name="name" required placeholder="John Doe" className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ background: 'var(--hm-surface-container-lowest)', borderColor: 'var(--hm-outline-variant)', color: 'var(--hm-on-surface)' }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1.5" style={{ color: 'var(--hm-on-surface-variant)' }}>Email *</label>
                <input type="email" name="email" required placeholder="you@example.com" className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ background: 'var(--hm-surface-container-lowest)', borderColor: 'var(--hm-outline-variant)', color: 'var(--hm-on-surface)' }} />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[11px] font-semibold mb-1.5" style={{ color: 'var(--hm-on-surface-variant)' }}>Subject *</label>
              <select name="subject" required className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ background: 'var(--hm-surface-container-lowest)', borderColor: 'var(--hm-outline-variant)', color: 'var(--hm-on-surface)' }}>
                <option value="">— Select a subject —</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Suggest a Feature / Tool Improvement">Suggest a Feature / Tool Improvement</option>
                <option value="Request a New Celebrity / Object Height">Request a New Celebrity / Object Height</option>
                <option value="Report a Bug / Calculation Error">Report a Bug / Calculation Error</option>
                <option value="Business & Partnership">Business &amp; Partnership</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-[11px] font-semibold mb-1.5" style={{ color: 'var(--hm-on-surface-variant)' }}>Message *</label>
              <textarea name="message" required rows={5} minLength={20} placeholder="Tell us what's on your mind..." className="w-full px-3 py-2.5 rounded-lg border text-sm resize-y" style={{ background: 'var(--hm-surface-container-lowest)', borderColor: 'var(--hm-outline-variant)', color: 'var(--hm-on-surface)' }} />
            </div>
            <button type="submit" className="w-full py-3 rounded-lg font-bold text-sm text-white transition" style={{ background: 'var(--hm-primary)' }}>
              Send Message
            </button>
          </form>

          {/* Trust badge */}
          <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'var(--hm-surface-container)', border: '1px solid var(--hm-outline-variant)' }}>
            <span style={{ color: 'var(--hm-primary)' }}>🔒</span>
            <p className="text-[12px]" style={{ color: 'var(--hm-on-surface-variant)' }}>
              <strong style={{ color: 'var(--hm-on-surface)' }}>We value your privacy.</strong> Your email will only be used to respond to your inquiry. We never sell, share, or add you to a mailing list without consent.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition" style={{ background: 'var(--hm-surface-container)', color: 'var(--hm-on-surface)', border: '1px solid var(--hm-outline-variant)' }}>
            ← Back to HeightMesh
          </Link>
        </div>
      </article>
    </main>
  );
}
