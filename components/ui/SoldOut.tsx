import { clsx } from '@/lib/clsx';

/**
 * Premium sold-out treatment for a card image: a frosted dark scrim with a
 * crisp, outlined stamp and a brick corner ribbon. Place inside a `relative`
 * image container.
 */
export function SoldOutOverlay({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* darken the photo so the stamp reads clearly */}
      <div className="absolute inset-0 bg-ink/60" />

      {/* corner ribbon */}
      <div className="absolute -start-12 top-5 -rotate-45">
        <div className="bg-brick px-12 py-1 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-bone shadow-snap">
          {label}
        </div>
      </div>

      {/* centred stamp */}
      <div className="absolute inset-0 grid place-items-center">
        <span className="rounded-[10px] border-2 border-bone/85 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-bone [text-shadow:0_2px_8px_rgb(0_0_0_/_0.6)]">
          {label}
        </span>
      </div>
    </div>
  );
}

/** Small inline sold-out pill, for compact contexts. */
export function SoldOutPill({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full bg-brick px-3 py-1 text-xs font-semibold uppercase tracking-widest text-bone',
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-bone/80" />
      {label}
    </span>
  );
}
