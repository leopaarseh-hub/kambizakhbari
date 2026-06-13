'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Field, Input, Label } from '@/components/ui/Field';
import { BrickMark } from '@/components/ui/Wordmark';

/** Single-admin sign in. On success the session cookie is set and the
 *  protected layout re-renders the panel. */
export function AdminLogin() {
  const t = useTranslations('Admin');
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus('loading');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    });
    if (error) {
      setStatus('error');
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <BrickMark className="h-8 w-auto text-bone" />
          <span className="font-display text-lg font-semibold tracking-tightest">
            {t('title')}
          </span>
        </div>
        <form onSubmit={handleSubmit} className="rounded-plate bg-plate p-6 shadow-snap">
          <h1 className="text-xl font-semibold tracking-tightest text-bone">
            {t('signIn')}
          </h1>
          <div className="mt-5 space-y-4">
            <Field>
              <Label htmlFor="email" required>{t('email')}</Label>
              <Input id="email" name="email" type="email" dir="ltr"
                autoComplete="email" required />
            </Field>
            <Field>
              <Label htmlFor="password" required>{t('password')}</Label>
              <Input id="password" name="password" type="password" dir="ltr"
                autoComplete="current-password" required />
            </Field>
          </div>
          {status === 'error' && (
            <p role="alert" className="mt-4 text-sm text-brick">
              {t('signInError')}
            </p>
          )}
          <div className="mt-6">
            <Button type="submit" disabled={status === 'loading'}
              className="w-full justify-center">
              {status === 'loading' ? t('signingIn') : t('signInCta')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
