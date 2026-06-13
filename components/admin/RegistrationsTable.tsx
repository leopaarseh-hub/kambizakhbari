'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import type { RegistrationRow, RegistrationStatus } from '@/lib/types';
import { clsx } from '@/lib/clsx';

type ClassTitles = Record<string, string>;

const statusStyles: Record<RegistrationStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-700',
  confirmed: 'bg-brick/10 text-brick',
  cancelled: 'bg-bone/10 text-bone/45 line-through',
};

export function RegistrationsTable({
  initial,
  classTitles,
}: {
  initial: RegistrationRow[];
  classTitles: ClassTitles;
}) {
  const t = useTranslations('Admin.registrations');
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<'all' | RegistrationStatus>('all');
  const supabase = createClient();

  const filtered = useMemo(
    () => (filter === 'all' ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );

  async function setStatus(row: RegistrationRow, status: RegistrationStatus) {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)));
    await supabase.from('registrations').update({ status }).eq('id', row.id);
  }

  const tabs: Array<'all' | RegistrationStatus> = ['all', 'pending', 'confirmed', 'cancelled'];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tightest text-bone">{t('title')}</h1>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={clsx(
              'rounded-full px-3.5 py-1.5 text-sm transition-colors',
              filter === tab ? 'bg-brick text-bone' : 'border border-seam text-bone/65 hover:text-bone',
            )}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-plate border border-dashed border-seam bg-plate p-10 text-center text-bone/55">
          {t('empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((row) => (
            <li key={row.id} className="rounded-plate bg-plate p-4 shadow-snap">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-bone">{row.full_name}</p>
                  <p className="text-sm text-bone/60" dir="ltr">{row.email} · {row.phone}</p>
                  <p className="mt-1 text-sm text-bone/55">
                    {t('class')}: {row.class_id ? classTitles[row.class_id] ?? '—' : '—'} ·{' '}
                    {t('format')}: {row.preferred_type === 'online' ? 'online' : 'in person'}
                  </p>
                  {row.message && (
                    <p className="mt-2 max-w-prose rounded-[8px] bg-ink p-2.5 text-sm text-bone/70">
                      {row.message}
                    </p>
                  )}
                </div>
                <span className={clsx('rounded-full px-2.5 py-1 text-xs font-medium', statusStyles[row.status])}>
                  {t(row.status)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-seam pt-3">
                <button onClick={() => setStatus(row, 'confirmed')}
                  className="rounded-full bg-brick px-3 py-1 text-xs font-medium text-bone">
                  {t('markConfirmed')}
                </button>
                <button onClick={() => setStatus(row, 'cancelled')}
                  className="rounded-full border border-seam px-3 py-1 text-xs text-bone/70 hover:bg-bone hover:text-ink">
                  {t('markCancelled')}
                </button>
                <button onClick={() => setStatus(row, 'pending')}
                  className="rounded-full border border-seam px-3 py-1 text-xs text-bone/70 hover:bg-bone hover:text-ink">
                  {t('markPending')}
                </button>
                <span className="ms-auto self-center text-xs text-bone/40" dir="ltr">
                  {new Date(row.created_at).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
