'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/storage';
import type { EventRow } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Field, Input, Label, Textarea } from '@/components/ui/Field';
import { PlusIcon } from '@/components/ui/Icons';
import { clsx } from '@/lib/clsx';

type Draft = Partial<EventRow>;

const emptyDraft: Draft = {
  title_en: '',
  title_fa: '',
  description_en: '',
  description_fa: '',
  event_date: '',
  location_en: '',
  location_fa: '',
  image_url: null,
  active: true,
};

export function EventManager({ initial }: { initial: EventRow[] }) {
  const t = useTranslations('Admin.events');
  const [rows, setRows] = useState<EventRow[]>(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function refresh() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    if (data) setRows(data as EventRow[]);
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      let imageUrl = draft.image_url ?? null;
      const file = form.get('image') as File | null;
      if (file && file.size > 0) {
        imageUrl = await uploadImage(supabase, file, 'events');
      }
      const payload = {
        title_en: String(form.get('title_en') ?? ''),
        title_fa: String(form.get('title_fa') ?? ''),
        description_en: String(form.get('description_en') ?? ''),
        description_fa: String(form.get('description_fa') ?? ''),
        event_date: form.get('event_date') ? String(form.get('event_date')) : null,
        location_en: String(form.get('location_en') ?? ''),
        location_fa: String(form.get('location_fa') ?? ''),
        image_url: imageUrl,
        active: form.get('active') === 'on',
      };
      if (draft.id) {
        await supabase.from('events').update(payload).eq('id', draft.id);
      } else {
        await supabase.from('events').insert(payload);
      }
      await refresh();
      setDraft(null);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(row: EventRow) {
    await supabase.from('events').update({ active: !row.active }).eq('id', row.id);
    await refresh();
  }

  async function remove(row: EventRow) {
    if (!confirm(t('confirmDelete'))) return;
    await supabase.from('events').delete().eq('id', row.id);
    await refresh();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tightest text-ink">{t('title')}</h1>
        <Button onClick={() => setDraft({ ...emptyDraft })}>
          <PlusIcon className="h-4 w-4" /> {t('new')}
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-plate border border-dashed border-seam bg-plate p-10 text-center text-ink/55">
          {t('empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center gap-4 rounded-plate bg-plate p-4 shadow-snap">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{row.title_en}</p>
                <p className="truncate text-sm text-ink/55">
                  {row.event_date ?? '—'} · {row.location_en}
                </p>
              </div>
              <button
                onClick={() => toggleActive(row)}
                className={clsx(
                  'rounded-full px-2.5 py-1 text-xs font-medium',
                  row.active ? 'bg-brick/10 text-brick' : 'bg-ink/5 text-ink/50',
                )}
              >
                {row.active ? t('active') : '—'}
              </button>
              <div className="flex gap-2">
                <button onClick={() => setDraft({ ...row })}
                  className="rounded-full border border-seam px-3 py-1 text-sm hover:bg-ink hover:text-bone">
                  {t('edit')}
                </button>
                <button onClick={() => remove(row)}
                  className="rounded-full border border-brick/40 px-3 py-1 text-sm text-brick hover:bg-brick hover:text-bone">
                  {t('delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {draft && <Editor draft={draft} saving={saving} onClose={() => setDraft(null)} onSubmit={save} />}
    </div>
  );
}

function Editor({
  draft,
  saving,
  onClose,
  onSubmit,
}: {
  draft: Draft;
  saving: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const t = useTranslations('Admin.events');
  const tc = useTranslations('Common');
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/70 p-4">
      <form onSubmit={onSubmit} className="my-8 w-full max-w-2xl rounded-plate bg-bone p-6 shadow-snap-lg">
        <h2 className="text-xl font-semibold tracking-tightest text-ink">
          {draft.id ? t('edit') : t('new')}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field>
            <Label htmlFor="title_en">{t('titleEn')}</Label>
            <Input id="title_en" name="title_en" defaultValue={draft.title_en} dir="ltr" required />
          </Field>
          <Field>
            <Label htmlFor="title_fa">{t('titleFa')}</Label>
            <Input id="title_fa" name="title_fa" defaultValue={draft.title_fa} dir="rtl" required />
          </Field>
          <Field className="sm:col-span-2">
            <Label htmlFor="description_en">{t('descEn')}</Label>
            <Textarea id="description_en" name="description_en" defaultValue={draft.description_en} dir="ltr" />
          </Field>
          <Field className="sm:col-span-2">
            <Label htmlFor="description_fa">{t('descFa')}</Label>
            <Textarea id="description_fa" name="description_fa" defaultValue={draft.description_fa} dir="rtl" />
          </Field>
          <Field>
            <Label htmlFor="event_date">{t('date')}</Label>
            <Input id="event_date" name="event_date" type="date" defaultValue={draft.event_date ?? ''} dir="ltr" />
          </Field>
          <Field>
            <Label htmlFor="image">{t('image')}</Label>
            <Input id="image" name="image" type="file" accept="image/*" />
          </Field>
          <Field>
            <Label htmlFor="location_en">{t('locationEn')}</Label>
            <Input id="location_en" name="location_en" defaultValue={draft.location_en ?? ''} dir="ltr" />
          </Field>
          <Field>
            <Label htmlFor="location_fa">{t('locationFa')}</Label>
            <Input id="location_fa" name="location_fa" defaultValue={draft.location_fa ?? ''} dir="rtl" />
          </Field>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" name="active" defaultChecked={draft.active ?? true} className="h-4 w-4 accent-[rgb(var(--color-brick))]" />
            <span className="text-sm text-ink">{t('active')}</span>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-seam px-4 py-2 text-sm">
            {tc('close')}
          </button>
          <Button type="submit" disabled={saving}>{saving ? t('saving') : t('save')}</Button>
        </div>
      </form>
    </div>
  );
}
