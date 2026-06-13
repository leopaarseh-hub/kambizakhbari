'use client';

import { useTranslations } from 'next-intl';
import type { ContactMessageRow } from '@/lib/types';

export function MessagesTable({ initial }: { initial: ContactMessageRow[] }) {
  const t = useTranslations('Admin.messages');

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tightest text-bone">{t('title')}</h1>
      {initial.length === 0 ? (
        <p className="rounded-plate border border-dashed border-seam bg-plate p-10 text-center text-bone/55">
          {t('empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {initial.map((row) => (
            <li key={row.id} className="rounded-plate bg-plate p-4 shadow-snap">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-bone">
                  {row.name}{' '}
                  <a href={`mailto:${row.email}`} className="text-sm font-normal text-brick" dir="ltr">
                    {row.email}
                  </a>
                </p>
                <span className="text-xs text-bone/40" dir="ltr">
                  {new Date(row.created_at).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-bone/75">{row.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
