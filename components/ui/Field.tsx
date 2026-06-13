import type { ComponentProps, ReactNode } from 'react';
import { clsx } from '@/lib/clsx';

const controlClass =
  'w-full rounded-[10px] border border-seam bg-bone px-4 py-3 text-start text-[15px] text-ink placeholder:text-ink/35 transition-colors duration-200 focus:border-brick focus:outline-none focus-visible:outline-none';

export function Label({
  htmlFor,
  children,
  required,
  hint,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink"
    >
      <span>{children}</span>
      {required && <span className="text-brick">*</span>}
      {hint && <span className="text-ink/40">({hint})</span>}
    </label>
  );
}

export function Input(props: ComponentProps<'input'>) {
  return (
    <input
      {...props}
      className={clsx(controlClass, props['aria-invalid'] && 'border-brick', props.className)}
    />
  );
}

export function Textarea(props: ComponentProps<'textarea'>) {
  return (
    <textarea
      {...props}
      className={clsx(controlClass, 'min-h-32 resize-y', props['aria-invalid'] && 'border-brick', props.className)}
    />
  );
}

export function Select(props: ComponentProps<'select'>) {
  return (
    <select
      {...props}
      className={clsx(controlClass, 'appearance-none', props.className)}
    />
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm text-brick">
      {children}
    </p>
  );
}

export function Field({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx('flex flex-col', className)}>{children}</div>;
}
