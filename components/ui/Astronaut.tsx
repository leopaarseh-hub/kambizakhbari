import type { SVGProps } from 'react';

/**
 * A LEGO-style astronaut minifigure: blocky helmet with a gold visor, chest
 * panel, air tank, clip hands, and the classic stud on top of the helmet.
 * `suit` and `visor` are configurable so a small fleet can be colourful.
 */
export function Astronaut({
  suit = '#F4F1EA',
  visor = '#FFC500',
  accent = '#D01012',
  ...props
}: { suit?: string; visor?: string; accent?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 150" fill="none" aria-hidden {...props}>
      {/* helmet stud */}
      <ellipse cx="60" cy="14" rx="11" ry="6" fill={suit} />
      <ellipse cx="60" cy="12" rx="11" ry="6" fill={suit} />
      <ellipse cx="60" cy="11" rx="7" ry="3.5" fill="#fff" opacity="0.25" />

      {/* helmet */}
      <rect x="30" y="16" width="60" height="52" rx="16" fill={suit} />
      <rect x="30" y="16" width="60" height="52" rx="16" fill="#000" opacity="0.05" />
      {/* visor */}
      <rect x="38" y="30" width="44" height="26" rx="11" fill={visor} />
      <rect x="38" y="30" width="44" height="13" rx="8" fill="#fff" opacity="0.35" />
      {/* helmet side clamps */}
      <rect x="26" y="34" width="7" height="16" rx="3" fill={accent} />
      <rect x="87" y="34" width="7" height="16" rx="3" fill={accent} />

      {/* neck */}
      <rect x="50" y="66" width="20" height="8" rx="3" fill={suit} />

      {/* air tank behind body */}
      <rect x="36" y="74" width="48" height="8" rx="4" fill="#9aa0a6" />

      {/* torso */}
      <rect x="34" y="78" width="52" height="44" rx="9" fill={suit} />
      <rect x="34" y="78" width="52" height="44" rx="9" fill="#000" opacity="0.04" />
      {/* chest control panel */}
      <rect x="50" y="90" width="20" height="16" rx="3" fill={accent} />
      <circle cx="56" cy="98" r="2.4" fill="#fff" />
      <circle cx="64" cy="98" r="2.4" fill={visor} />

      {/* arms */}
      <rect x="22" y="82" width="14" height="34" rx="7" fill={suit} />
      <rect x="84" y="82" width="14" height="34" rx="7" fill={suit} />
      {/* clip hands */}
      <circle cx="29" cy="120" r="7" fill={visor} />
      <circle cx="91" cy="120" r="7" fill={visor} />

      {/* legs */}
      <rect x="40" y="120" width="18" height="26" rx="4" fill="#3a3d42" />
      <rect x="62" y="120" width="18" height="26" rx="4" fill="#3a3d42" />
      <rect x="40" y="120" width="40" height="6" fill="#000" opacity="0.12" />
    </svg>
  );
}
