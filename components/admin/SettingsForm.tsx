'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/storage';
import type { SettingsRow } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Field, Input, Label } from '@/components/ui/Field';

export function SettingsForm({ initial }: { initial: SettingsRow | null }) {
  const t = useTranslations('Admin.settings');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const form = new FormData(e.currentTarget);

      // Upload any newly chosen photos; keep the existing URL otherwise.
      let heroUrl = initial?.hero_image_url ?? null;
      let aboutUrl = initial?.about_image_url ?? null;
      const heroFile = form.get('hero_image') as File | null;
      const aboutFile = form.get('about_image') as File | null;
      if (heroFile && heroFile.size > 0) {
        heroUrl = await uploadImage(supabase, heroFile, 'site');
      }
      if (aboutFile && aboutFile.size > 0) {
        aboutUrl = await uploadImage(supabase, aboutFile, 'site');
      }

      const payload = {
        id: 1,
        iban: String(form.get('iban') ?? ''),
        account_holder: String(form.get('account_holder') ?? ''),
        default_currency: String(form.get('default_currency') ?? ''),
        hero_image_url: heroUrl,
        about_image_url: aboutUrl,
      };

      const { error: dbError } = await supabase.from('settings').upsert(payload);
      if (dbError) {
        setError(dbError.message);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tightest text-bone">{t('title')}</h1>
      <form onSubmit={save} className="space-y-5 rounded-plate bg-plate p-6 shadow-snap">
        <Field>
          <Label htmlFor="iban">{t('iban')}</Label>
          <Input id="iban" name="iban" defaultValue={initial?.iban ?? ''} dir="ltr"
            className="font-mono" placeholder="TR00 0000 0000 0000 0000 0000 00" />
        </Field>
        <Field>
          <Label htmlFor="account_holder">{t('accountHolder')}</Label>
          <Input id="account_holder" name="account_holder" defaultValue={initial?.account_holder ?? ''} />
        </Field>
        <Field>
          <Label htmlFor="default_currency">{t('currency')}</Label>
          <Input id="default_currency" name="default_currency" defaultValue={initial?.default_currency ?? 'TRY'} dir="ltr" />
        </Field>

        <ImageField
          id="hero_image"
          label={t('heroImage')}
          hint={t('imageHint')}
          currentLabel={t('current')}
          current={initial?.hero_image_url ?? null}
        />
        <ImageField
          id="about_image"
          label={t('aboutImage')}
          hint={t('imageHint')}
          currentLabel={t('current')}
          current={initial?.about_image_url ?? null}
        />

        {error && (
          <div className="rounded-[10px] border border-brick/40 bg-brick/10 p-3 text-sm text-bone">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" disabled={saving}>{t('save')}</Button>
          {saved && <span className="text-sm text-brick">{t('saved')}</span>}
        </div>
      </form>
    </div>
  );
}

function ImageField({
  id,
  label,
  hint,
  current,
  currentLabel,
}: {
  id: string;
  label: string;
  hint: string;
  current: string | null;
  currentLabel: string;
}) {
  return (
    <Field>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[10px] border border-seam bg-ink">
          {current ? (
            <Image src={current} alt={`${currentLabel} ${label}`} fill className="object-cover" sizes="64px" />
          ) : (
            <span className="grid h-full w-full place-items-center text-[10px] text-bone/40">—</span>
          )}
        </div>
        <Input id={id} name={id} type="file" accept="image/*" className="flex-1" />
      </div>
    </Field>
  );
}
