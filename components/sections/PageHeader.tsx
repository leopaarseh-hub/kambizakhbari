import type { ReactNode } from 'react';
import { StudSeam } from '@/components/ui/Stud';
import { LegoScene } from '@/components/motion/LegoScene';
import { clsx } from '@/lib/clsx';

/**
 * Consistent editorial page header. No eyebrow label: the title leads, with a
 * quiet stud seam above it. A subtle animated LEGO scene drifts on the end side
 * on large screens, kept clear of the text column for full legibility.
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
    <header className={clsx('relative overflow-hidden', className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 end-0 hidden w-2/5 lg:block"
      >
        <LegoScene variant="ambient" />
      </div>

      <div className="shell relative z-10 pt-16 sm:pt-20">
        <StudSeam className="mb-6 justify-start" />
        <h1 className="text-balance text-4xl font-semibold tracking-tightest text-ink sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="prose-body measure mt-5 text-lg text-ink/70">{intro}</p>
        )}
      </div>
    </header>
  );
}
