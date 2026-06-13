import type { SVGProps } from 'react';

/**
 * A LEGO-style spaceship pointing right: studded hull, red nose cone, cyan
 * cockpit, yellow fins, and an engine flame. Built to fly across the
 * background. Mirror it with a CSS scale for the opposite direction.
 */
export function Spaceship({
  hull = '#E8E6DF',
  nose = '#D8362B',
  fin = '#FFC500',
  window: win = '#22B8CF',
  ...props
}: {
  hull?: string;
  nose?: string;
  fin?: string;
  window?: string;
} & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 210 96" fill="none" aria-hidden {...props}>
      {/* engine flame */}
      <polygon points="22,40 -6,48 22,56" fill="#FF7A1A" />
      <polygon points="22,43 6,48 22,53" fill="#FFC500" />
      {/* engine block */}
      <rect x="18" y="34" width="16" height="28" rx="4" fill="#9aa0a6" />

      {/* top fin */}
      <polygon points="74,32 96,6 110,32" fill={fin} />
      <polygon points="74,32 96,6 110,32" fill="#000" opacity="0.08" />
      {/* bottom fin */}
      <polygon points="74,64 96,90 110,64" fill={fin} />
      <polygon points="74,64 96,90 110,64" fill="#000" opacity="0.16" />

      {/* hull */}
      <rect x="30" y="30" width="120" height="36" rx="17" fill={hull} />
      <rect x="30" y="48" width="120" height="18" rx="9" fill="#000" opacity="0.08" />
      {/* studs on top of the hull */}
      {[52, 78, 104].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy="28" rx="8" ry="4.5" fill={hull} />
          <ellipse cx={cx} cy="26" rx="8" ry="4.5" fill={hull} />
          <ellipse cx={cx} cy="25" rx="5" ry="2.6" fill="#fff" opacity="0.3" />
        </g>
      ))}
      {/* accent stripe */}
      <rect x="64" y="44" width="58" height="7" rx="3.5" fill={nose} opacity="0.85" />

      {/* nose cone */}
      <path d="M150 30 Q196 48 150 66 Z" fill={nose} />
      <path d="M150 30 Q196 48 150 66 Z" fill="#000" opacity="0.12" />

      {/* cockpit window */}
      <circle cx="118" cy="48" r="12" fill={win} />
      <circle cx="118" cy="48" r="12" fill="#000" opacity="0.06" />
      <circle cx="114" cy="44" r="4.5" fill="#fff" opacity="0.45" />
    </svg>
  );
}
