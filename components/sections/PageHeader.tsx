import type { ReactNode } from 'react';
import { StudSeam } from '@/components/ui/Stud';
import { clsx } from '@/lib/clsx';

/**
 * Consistent editorial page header. No eyebrow label: the title leads, with a
 * quiet stud seam above it. The site-wide LEGO galaxy drifts behind every page,
 * so the header stays clean and lets the title breathe.
 */
export function PageHeader({
  title,
  intro,
  className,
}: {
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
}) {
  return (
    <header className={clsx('shell pt-16 sm:pt-20', className)}>
      <StudSeam className="mb-6 justify-start" />
      <h1 className="text-balance text-4xl font-semibold tracking-tightest text-bone sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {intro && (
        <p className="prose-body measure mt-5 text-lg text-bone/70">{intro}</p>
      )}
    </header>
  );
}
