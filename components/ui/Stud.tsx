import { clsx } from '@/lib/clsx';

/** A single refined stud accent. */
export function Stud({
  className,
  muted = false,
}: {
  className?: string;
  muted?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={clsx('stud', muted && 'stud-muted', className)}
    />
  );
}

/** A short row of studs used as a tasteful seam between plates. */
export function StudSeam({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div aria-hidden className={clsx('stud-seam', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={clsx('stud', i !== 1 && 'stud-muted')} />
      ))}
    </div>
  );
}
