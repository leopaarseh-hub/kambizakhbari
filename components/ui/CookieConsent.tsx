'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { clsx } from '@/lib/clsx';

const KEY = 'ka-cookie-consent';

/**
 * Premium cookie consent box. Slides up shortly after load if no choice has
 * been made, offering Accept or Reject. The choice is stored locally so it is
 * not shown again. It is a small floating card, not a blocking overlay, so the
 * page stays usable. Pure-CSS transition (no extra JS animation library).
 */
export function CookieConsent() {
  const t = useTranslations('Cookie');
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    try {
      if (!localStorage.getItem(KEY)) {
        const timer = setTimeout(() => {
          setShow(true);
          raf = requestAnimationFrame(() => setVisible(true));
        }, 600);
        return () => {
          clearTimeout(timer);
          cancelAnimationFrame(raf);
        };
      }
    } catch {
      /* localStorage unavailable, do nothing */
    }
  }, []);

  function choose(choice: 'accepted' | 'rejected') {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      /* ignore */
    }
    setVisible(false);
    setTimeout(() => setShow(false), 300);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label={t('title')}
      className={clsx(
        'fixed inset-x-4 bottom-4 z-[80] transition-all duration-300 ease-snap sm:inset-x-auto sm:bottom-6 sm:start-6 sm:max-w-sm',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
      )}
    >
      <div className="rounded-plate bg-plate p-5 shadow-snap-lg ring-1 ring-bone/10">
        <div className="mb-3 flex items-center gap-2">
          <span className="stud" />
          <span className="stud stud-muted" />
          <span className="stud stud-muted" />
          <span className="ms-1.5 text-sm font-semibold text-bone">{t('title')}</span>
        </div>
        <p className="text-sm leading-relaxed text-bone/70">{t('message')}</p>
        <div className="mt-4 flex gap-2.5">
          <button
            onClick={() => choose('accepted')}
            className="flex-1 rounded-full bg-brick px-4 py-2.5 text-sm font-medium text-bone shadow-snap transition-all duration-200 hover:-translate-y-0.5 hover:shadow-snap-lg"
          >
            {t('accept')}
          </button>
          <button
            onClick={() => choose('rejected')}
            className="flex-1 rounded-full border border-seam px-4 py-2.5 text-sm text-bone/80 transition-colors duration-200 hover:bg-bone/10 hover:text-bone"
          >
            {t('reject')}
          </button>
        </div>
      </div>
    </div>
  );
}
