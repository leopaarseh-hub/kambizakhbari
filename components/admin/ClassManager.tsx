'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/storage';
import { revalidatePublicContent } from '@/app/actions';
import type { ClassRow, ClassType } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Field, Input, Label, Select, Textarea } from '@/components/ui/Field';
import { PlusIcon } from '@/components/ui/Icons';
import { clsx } from '@/lib/clsx';

type Draft = Partial<ClassRow> & { type: ClassType };

const emptyDraft: Draft = {
  title_en: '',
  title_fa: '',
  description_en: '',
  description_fa: '',
  type: 'online',
  price: null,
  currency: 'TRY',
  capacity: null,
  image_url: null,
  active: true,
  sold_out: false,
};

export function ClassManager({ initial }: { initial: ClassRow[] }) {
  const t = useTranslations('Admin.classes');
  const [rows, setRows] = useState<ClassRow[]>(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function refresh() {
    const { data } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setRows(data as ClassRow[]);
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
      const form = new FormData(e.currentTarget);
      let imageUrl = draft.image_url ?? null;
      const file = form.get('image') as File | null;
      if (file && file.size > 0) {
        imageUrl = await uploadImage(supabase, file, 'classes');
      }

      const payload = {
        title_en: String(form.get('title_en') ?? ''),
        title_fa: String(form.get('title_fa') ?? ''),
        description_en: String(form.get('description_en') ?? ''),
        description_fa: String(form.get('description_fa') ?? ''),
        type: String(form.get('type') ?? 'online') as ClassType,
        price: form.get('price') ? Number(form.get('price')) : null,
        currency: String(form.get('currency') ?? 'TRY'),
        capacity: form.get('capacity') ? Number(form.get('capacity')) : null,
        image_url: imageUrl,
        active: form.get('active') === 'on',
        sold_out: form.get('sold_out') === 'on',
      };

      const { error: dbError } = draft.id
        ? await supabase.from('classes').update(payload).eq('id', draft.id)
        : await supabase.from('classes').insert(payload);

      if (dbError) {
        setError(dbError.message);
        return;
      }
      await refresh();
      await revalidatePublicContent();
      setDraft(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(row: ClassRow) {
    const { error: dbError } = await supabase
      .from('classes')
      .update({ active: !row.active })
      .eq('id', row.id);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    await refresh();
    await revalidatePublicContent();
  }

  async function remove(row: ClassRow) {
    if (!confirm(t('confirmDelete'))) return;
    const { error: dbError } = await supabase.from('classes').delete().eq('id', row.id);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    await refresh();
    await revalidatePublicContent();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tightest text-bone">{t('title')}</h1>
        <Button
          onClick={() => {
            setError(null);
            setDraft({ ...emptyDraft });
          }}
          withArrow={false}
        >
          <PlusIcon className="h-4 w-4" /> {t('new')}
        </Button>
      </div>

      {error && !draft && (
        <div className="mb-4 rounded-[10px] border border-brick/40 bg-brick/10 p-3 text-sm text-bone">
          {error}
        </div>
      )}

      {rows.length === 0 ? (
        <p className="rounded-plate border border-dashed border-seam bg-plate p-10 text-center text-bone/55">
          {t('empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center gap-4 rounded-plate bg-plate p-4 shadow-snap"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-bone">{row.title_en}</p>
                <p className="truncate text-sm text-bone/55" dir="rtl">{row.title_fa}</p>
              </div>
              <span className="rounded-full bg-bone/10 px-2.5 py-1 text-xs text-bone/70">
                {row.type === 'online' ? 'online' : 'in person'}
              </span>
              <button
                onClick={() => toggleActive(row)}
                className={clsx(
                  'rounded-full px-2.5 py-1 text-xs font-medium',
                  row.active ? 'bg-brick/10 text-brick' : 'bg-bone/10 text-bone/50',
                )}
              >
                {row.active ? t('active') : '—'}
              </button>
              <div className="flex gap-2">
                <button onClick={() => setDraft({ ...row })}
                  className="rounded-full border border-seam px-3 py-1 text-sm hover:bg-bone hover:text-ink">
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

      {draft && (
        <Editor
          draft={draft}
          saving={saving}
          error={error}
          onClose={() => setDraft(null)}
          onSubmit={save}
        />
      )}
    </div>
  );
}

function Editor({
  draft,
  saving,
  error,
  onClose,
  onSubmit,
}: {
  draft: Draft;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const t = useTranslations('Admin.classes');
  const tc = useTranslations('Common');
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/70">
      <div className="flex min-h-full items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="flex max-h-[90svh] w-full max-w-2xl flex-col overflow-y-auto rounded-plate bg-ink p-6 shadow-snap-lg"
      >
        <h2 className="text-xl font-semibold tracking-tightest text-bone">
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
            <Label htmlFor="type">{t('type')}</Label>
            <Select id="type" name="type" defaultValue={draft.type}>
              <option value="online">online</option>
              <option value="in_person">in person, private</option>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label htmlFor="price" hint={t('priceHint')}>{t('price')}</Label>
              <Input id="price" name="price" type="number" min="0" defaultValue={draft.price ?? ''} dir="ltr" />
            </Field>
            <Field>
              <Label htmlFor="currency">{t('currency')}</Label>
              <Input id="currency" name="currency" defaultValue={draft.currency ?? 'TRY'} dir="ltr" />
            </Field>
          </div>
          <Field>
            <Label htmlFor="capacity">{t('capacity')}</Label>
            <Input id="capacity" name="capacity" type="number" min="0" defaultValue={draft.capacity ?? ''} dir="ltr" />
          </Field>
          <Field>
            <Label htmlFor="image">{t('image')}</Label>
            <Input id="image" name="image" type="file" accept="image/*" />
          </Field>
          <div className="flex flex-wrap gap-6 sm:col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="active" defaultChecked={draft.active ?? true} className="h-4 w-4 accent-[rgb(var(--color-brick))]" />
              <span className="text-sm text-bone">{t('active')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="sold_out" defaultChecked={draft.sold_out ?? false} className="h-4 w-4 accent-[rgb(var(--color-brick))]" />
              <span className="text-sm text-bone">{t('soldOut')}</span>
            </label>
          </div>
        </div>
        {error && (
          <div className="mt-5 rounded-[10px] border border-brick/40 bg-brick/10 p-3 text-sm text-bone">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose}
            className="rounded-full border border-seam px-4 py-2 text-sm">
            {tc('close')}
          </button>
          <Button type="submit" disabled={saving}>
            {saving ? t('saving') : t('save')}
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
}
