'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import type { SettingsRow } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Field, Input, Label } from '@/components/ui/Field';

export function SettingsForm({ initial }: { initial: SettingsRow | null }) {
  const t = useTranslations('Admin.settings');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const form = new FormData(e.currentTarget);
    const payload = {
      id: 1,
      iban: String(form.get('iban') ?? ''),
      account_holder: String(form.get('account_holder') ?? ''),
      default_currency: String(form.get('default_currency') ?? ''),
    };
    await supabase.from('settings').upsert(payload);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tightest text-bone">{t('title')}</h1>
      <form onSubmit={save} className="space-y-4 rounded-plate bg-plate p-6 shadow-snap">
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
        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" disabled={saving}>{t('save')}</Button>
          {saved && <span className="text-sm text-brick">{t('saved')}</span>}
        </div>
      </form>
    </div>
  );
}
