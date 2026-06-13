'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { localized, type ClassRow, type ClassType } from '@/lib/types';
import type { PaymentDetails } from '@/lib/payment';
import type { Locale } from '@/i18n/routing';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Field, FieldError, Input, Label, Select, Textarea } from '@/components/ui/Field';
import { CloseIcon, CopyIcon, CheckIcon } from '@/components/ui/Icons';
import { clsx } from '@/lib/clsx';

interface Props {
  klass: ClassRow;
  payment: PaymentDetails;
  contactEmail: string;
  onClose: () => void;
}

type Errors = Partial<Record<'fullName' | 'email' | 'phone' | 'type', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegistrationDialog({ klass, payment, contactEmail, onClose }: Props) {
  const t = useTranslations('Registration');
  const tc = useTranslations('Classes');
  const tCommon = useTranslations('Common');
  const locale = useLocale() as Locale;
  const reduce = useReducedMotion();

  const [status, setStatus] = useState<'form' | 'submitting' | 'success' | 'error'>('form');
  const [errors, setErrors] = useState<Errors>({});
  const [copied, setCopied] = useState(false);
  const [type, setType] = useState<ClassType>(klass.type);

  const title = localized(klass, 'title', locale);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const fullName = String(form.get('fullName') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const phone = String(form.get('phone') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();
    const preferred = String(form.get('preferredType') ?? '') as ClassType;

    const next: Errors = {};
    if (!fullName) next.fullName = t('validation.fullName');
    if (!EMAIL_RE.test(email)) next.email = t('validation.email');
    if (!phone) next.phone = t('validation.phone');
    if (preferred !== 'online' && preferred !== 'in_person')
      next.type = t('validation.type');
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus('submitting');
    try {
      const supabase = createClient();
      const { error } = await supabase.from('registrations').insert({
        class_id: klass.id,
        full_name: fullName,
        email,
        phone,
        preferred_type: preferred,
        message: message || null,
        status: 'pending',
      });
      if (error) throw error;
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  async function copyIban() {
    try {
      await navigator.clipboard.writeText(payment.iban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable, ignore */
    }
  }

  const priceLabel = formatPrice(klass.price, klass.currency ?? payment.currency, locale);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[95] grid place-items-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t('title')}
          initial={reduce ? false : { opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative my-8 w-full max-w-lg rounded-plate bg-bone p-6 shadow-snap-lg sm:p-8"
        >
          <button
            onClick={onClose}
            aria-label={t('done')}
            className="absolute top-4 end-4 grid h-9 w-9 place-items-center rounded-full border border-seam text-ink/70 transition-colors hover:bg-ink hover:text-bone"
          >
            <CloseIcon className="h-4 w-4" />
          </button>

          {status === 'success' ? (
            <SuccessPanel
              title={title}
              payment={payment}
              priceLabel={priceLabel}
              contactEmail={contactEmail}
              copied={copied}
              onCopy={copyIban}
              onDone={onClose}
            />
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-1 flex gap-2">
                <span className="h-2 w-2 rounded-full bg-brick" />
                <span className="h-2 w-2 rounded-full bg-graphite/30" />
                <span className="h-2 w-2 rounded-full bg-graphite/30" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tightest text-ink">
                {t('title')}
              </h2>
              <p className="mt-1.5 text-sm text-ink/60">
                {t('forClass')}: <span className="text-ink">{title}</span>
                {priceLabel && (
                  <>
                    {' '}
                    · {tc('price')}: <span className="text-ink">{priceLabel}</span>
                  </>
                )}
              </p>

              <div className="mt-6 space-y-4">
                <Field>
                  <Label htmlFor="fullName" required>{t('fullName')}</Label>
                  <Input id="fullName" name="fullName" autoComplete="name"
                    aria-invalid={!!errors.fullName} />
                  <FieldError>{errors.fullName}</FieldError>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <Label htmlFor="email" required>{t('email')}</Label>
                    <Input id="email" name="email" type="email" inputMode="email"
                      autoComplete="email" dir="ltr" aria-invalid={!!errors.email} />
                    <FieldError>{errors.email}</FieldError>
                  </Field>
                  <Field>
                    <Label htmlFor="phone" required>{t('phone')}</Label>
                    <Input id="phone" name="phone" type="tel" inputMode="tel"
                      autoComplete="tel" dir="ltr" aria-invalid={!!errors.phone} />
                    <FieldError>{errors.phone}</FieldError>
                  </Field>
                </div>

                <Field>
                  <Label htmlFor="preferredType" required>{t('preferredType')}</Label>
                  <Select id="preferredType" name="preferredType" value={type}
                    onChange={(e) => setType(e.target.value as ClassType)}
                    aria-invalid={!!errors.type}>
                    <option value="online">{tc('online')}</option>
                    <option value="in_person">{tc('inPerson')}</option>
                  </Select>
                  <FieldError>{errors.type}</FieldError>
                </Field>

                <Field>
                  <Label htmlFor="message" hint={tCommon('optional')}>
                    {t('message')}
                  </Label>
                  <Textarea id="message" name="message"
                    placeholder={t('messagePlaceholder')} />
                </Field>
              </div>

              {status === 'error' && (
                <div className="mt-4 rounded-[10px] border border-brick/40 bg-brick/5 p-4">
                  <p className="text-sm font-medium text-brick">{t('errorTitle')}</p>
                  <p className="mt-1 text-sm text-ink/70">{t('errorBody')}</p>
                </div>
              )}

              <div className="mt-7">
                <Button type="submit" disabled={status === 'submitting'} withArrow
                  className="w-full justify-center">
                  {status === 'submitting' ? t('submitting') : t('submit')}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SuccessPanel({
  title,
  payment,
  priceLabel,
  contactEmail,
  copied,
  onCopy,
  onDone,
}: {
  title: string;
  payment: PaymentDetails;
  priceLabel: string | null;
  contactEmail: string;
  copied: boolean;
  onCopy: () => void;
  onDone: () => void;
}) {
  const t = useTranslations('Registration');

  return (
    <div>
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-brick/10 text-brick">
        <CheckIcon className="h-5 w-5" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tightest text-ink">
        {t('successTitle')}
      </h2>
      <p className="prose-body mt-2 text-ink/75">{t('successBody')}</p>

      <dl className="mt-6 divide-y divide-seam overflow-hidden rounded-plate bg-plate shadow-snap">
        <Row label={t('forClass')} value={title} />
        <Row label={t('accountHolder')} value={payment.accountHolder} />
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <dt className="text-sm text-ink/55">{t('iban')}</dt>
            <dd className="mt-0.5 break-all font-mono text-sm text-ink" dir="ltr">
              {payment.iban || '—'}
            </dd>
          </div>
          {payment.iban && (
            <button
              onClick={onCopy}
              className={clsx(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                copied
                  ? 'border-brick bg-brick text-bone'
                  : 'border-seam text-ink hover:border-ink',
              )}
            >
              {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
              {copied ? t('ibanCopied') : t('copyIban')}
            </button>
          )}
        </div>
        {priceLabel && <Row label={t('amount')} value={priceLabel} />}
      </dl>

      <p className="mt-5 rounded-[10px] border border-seam bg-bone p-4 text-sm text-ink/75">
        {t('sendReceipt', { email: contactEmail })}
      </p>

      <div className="mt-6">
        <Button onClick={onDone} className="w-full justify-center">
          {t('done')}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <dt className="text-sm text-ink/55">{label}</dt>
      <dd className="text-end text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
