'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Field, FieldError, Input, Label, Textarea } from '@/components/ui/Field';
import { CheckIcon } from '@/components/ui/Icons';

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const t = useTranslations('Contact');
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Errors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();

    const next: Errors = {};
    if (!name) next.name = t('validation.name');
    if (!EMAIL_RE.test(email)) next.email = t('validation.email');
    if (!message) next.message = t('validation.message');
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus('sending');
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('contact_messages')
        .insert({ name, email, message });
      if (error) throw error;
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-plate bg-plate p-8 shadow-snap"
      >
        <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-brick/10 text-brick">
          <CheckIcon className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tightest text-bone">
          {t('successTitle')}
        </h2>
        <p className="prose-body mt-2 text-bone/75">{t('successBody')}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-plate bg-plate p-6 shadow-snap sm:p-8">
      <div className="space-y-4">
        <Field>
          <Label htmlFor="name" required>{t('name')}</Label>
          <Input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} />
          <FieldError>{errors.name}</FieldError>
        </Field>
        <Field>
          <Label htmlFor="email" required>{t('email')}</Label>
          <Input id="email" name="email" type="email" inputMode="email" dir="ltr"
            autoComplete="email" aria-invalid={!!errors.email} />
          <FieldError>{errors.email}</FieldError>
        </Field>
        <Field>
          <Label htmlFor="message" required>{t('message')}</Label>
          <Textarea id="message" name="message" aria-invalid={!!errors.message} />
          <FieldError>{errors.message}</FieldError>
        </Field>
      </div>

      {status === 'error' && (
        <div className="mt-4 rounded-[10px] border border-brick/40 bg-brick/5 p-4">
          <p className="text-sm font-medium text-brick">{t('errorTitle')}</p>
          <p className="mt-1 text-sm text-bone/70">{t('errorBody')}</p>
        </div>
      )}

      <div className="mt-6">
        <Button type="submit" disabled={status === 'sending'} withArrow
          className="w-full justify-center sm:w-auto">
          {status === 'sending' ? t('sending') : t('send')}
        </Button>
      </div>
    </form>
  );
}
