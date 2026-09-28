'use client';

import { useSyncExternalStore } from 'react';

/**
 * GDPR/CCPA Cookie Consent Banner
 * - Lightweight: a single <div> with two buttons
 * - Non-intrusive: bottom-fixed, dismissable, opaque backdrop
 * - Memory: stores choice in localStorage (hc_consent_v1) so it never shows again
 * - SSR-safe: useSyncExternalStore returns stable value during SSR, re-checks on mount
 */
const STORAGE_KEY = 'hc_consent_v1';

// Empty subscription — we never push updates from elsewhere; only re-read on dismiss.
const subscribe = (cb: () => void) => {
  window.addEventListener('storage', cb);
  return () => window.removeEventListener('storage', cb);
};

// Returns true if banner should be visible (no prior consent stored).
// During SSR this returns false (don't render banner).
function getVisible(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return !localStorage.getItem(STORAGE_KEY);
  } catch {
    return true;
  }
}

// Snapshot for hydration sync — return false on both server and first client render
// to avoid hydration mismatch, then transition to true if needed.
function getServerSnapshot(): boolean {
  return false;
}

export function CookieConsentBanner() {
  const visible = useSyncExternalStore(subscribe, getVisible, getServerSnapshot);

  const dismiss = (choice: 'accepted' | 'rejected') => {
    try { localStorage.setItem(STORAGE_KEY, choice); } catch {}
    // Force re-read by dispatching a storage event
    window.dispatchEvent(new Event('storage'));
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[60] p-3 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/15"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-3 text-sm">
        <p className="flex-1 text-slate-300 leading-relaxed">
          <span className="font-bold text-white">🍪 Cookie Notice:</span>{' '}
          We use essential cookies to remember your consent preference. We may use Google Analytics
          (anonymized IP) for aggregate traffic stats. No advertising cookies. See our{' '}
          <a href="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</a>.
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => dismiss('rejected')}
            className="px-3 py-2 rounded-lg text-xs font-bold bg-[#1a1a1a] hover:bg-[#222] text-slate-300 border border-white/10 transition"
          >
            Decline
          </button>
          <button
            onClick={() => dismiss('accepted')}
            className="px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transition shadow-lg shadow-blue-500/30"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
