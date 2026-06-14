import type { ReactNode } from 'react';
import { clsx } from '@/lib/clsx';
import { StudSeam } from './Stud';

/**
 * Section heading. Deliberately has NO eyebrow / kicker label. The heading
 * stands on its own, optionally introduced by a quiet stud seam.
 */
export function SectionHeading({
  title,
  intro,
  seam = true,
  align = 'start',
  className,
}: {
  title: ReactNode;
  intro?: ReactNode;
  seam?: boolean;
  align?: 'start' | 'center';
  className?: string;
}) {
  return (
    <div
      className={clsx(
        align === 'center' ? 'text-center' : 'text-start',
        className,
      )}
    >
      {seam && (
        <StudSeam
          className={clsx('mb-5', align === 'center' ? 'justify-center' : 'justify-start')}
        />
      )}
      <h2 className="text-legible text-3xl font-semibold tracking-tightest text-bone sm:text-4xl">
        {title}
      </h2>
      {intro && (
        <p
          className={clsx(
            'prose-body measure mt-4 text-base text-bone/75 [text-shadow:0_1px_8px_rgb(0_0_0_/_0.5)]',
            align === 'center' && 'mx-auto',
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
