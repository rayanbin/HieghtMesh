'use client';
import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--hm-surface)' }}>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <nav className="mb-6 text-[12px]" style={{ color: 'var(--hm-on-surface-variant)' }} aria-label="Breadcrumb">
          <Link href="/" className="hover:underline" style={{ color: 'var(--hm-primary)' }}>Home</Link>
          {' / '}
          <span style={{ color: 'var(--hm-on-surface-variant)' }}>Disclaimer</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--hm-on-surface)' }}>
            Medical <span style={{ background: 'linear-gradient(to right, var(--hm-primary), var(--hm-tertiary))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Disclaimer</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--hm-outline)' }}>Last updated: September 27, 2026 · Reviewed per <Link href="/editorial-guidelines" className="underline" style={{ color: 'var(--hm-primary)' }}>Editorial Guidelines</Link></p>
        </header>

        <div className="p-5 rounded-xl border mb-8" style={{ borderColor: 'rgba(245, 187, 128, 0.4)', background: 'rgba(245, 187, 128, 0.05)' }}>
          <p className="text-sm font-bold mb-2" style={{ color: 'var(--hm-tertiary)' }}>⚠️ Important Medical Disclaimer</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface)' }}>
            This website and its height prediction tools, exercise guides, and nutrition advice are for educational and informational purposes only and do not constitute professional medical advice. Always consult a qualified healthcare provider with any questions about a medical condition.
          </p>
        </div>

        <section className="space-y-6">
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>1. Educational Purpose Only</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>All content on this website — including height calculations, celebrity height comparisons, growth exercise instructions, and nutrition guidance — is provided for educational and informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>2. Accuracy of Height Calculations</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>The mid-parental height formula (Tanner formula) used in the Child Height Prediction calculator has a documented standard deviation of approximately ±10 cm. This means 95% of children will reach an adult height within this range, but 5% will fall outside it. The optional lifestyle adjustment (±1–4 cm) is an additional heuristic based on self-reported activity, screen time, and diet quality — it is not a clinically validated medical intervention.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>3. Exercise Instructions</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>The 10 animated growth exercises are intended for healthy individuals without pre-existing musculoskeletal conditions. Always consult a physician or physical therapist before beginning any new exercise program — especially if you have back injuries, joint problems, or are recovering from surgery. Stop immediately if you feel pain, dizziness, or discomfort.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>4. Nutrition Guidance</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>Nutrition recommendations on this site are general guidelines based on publicly available dietary standards (CDC, WHO, USDA). They are not personalized medical nutrition therapy. Individual nutritional needs vary based on age, sex, activity level, medical conditions, and other factors. Consult a registered dietitian or physician for personalized nutrition advice.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>5. Celebrity Height Accuracy</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>Celebrity heights in our database are sourced from Wikipedia, which itself relies on publicly available information that may not always be accurate or current. Heights can also vary by source (e.g., morning vs. evening measurement). For the most accurate celebrity height, refer to primary sources or the celebrity's official statement.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>6. No Doctor-Patient Relationship</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>Use of this website does not create a doctor-patient relationship between you and the HeightMesh editorial team or any reviewer. Always seek the advice of a qualified health provider with any questions about a medical condition. Never disregard professional medical advice or delay seeking it because of something you have read on this website.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>7. Limitation of Liability</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>The HeightMesh team shall not be liable for any damages arising from the use of, or reliance on, any information provided on this website.</p></div>
          <div><h2 className="text-xl font-bold mb-2" style={{ color: 'var(--hm-on-surface)' }}>8. External Links</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--hm-on-surface-variant)' }}>This site links to Wikipedia and other third-party websites. We are not responsible for the content, accuracy, or privacy practices of those external sites.</p></div>
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
