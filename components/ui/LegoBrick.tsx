import type { SVGProps } from 'react';

/**
 * An isometric LEGO brick rendered as crisp SVG with three shaded faces and
 * studs on top, so it reads as a real plastic brick, not a flat square.
 * `studs` controls the length (2 or 4 studs). Color is the plastic hue; the
 * darker faces are derived with translucent black overlays.
 */
export function LegoBrick({
  color = '#D01012',
  studs = 2,
  ...props
}: { color?: string; studs?: 2 | 3 | 4 } & SVGProps<SVGSVGElement>) {
  // Geometry for an iso brick. Width scales with the stud count.
  const unit = 30; // horizontal step per stud
  const w = unit * studs;
  const depth = 18; // iso depth
  const bodyH = 34; // front face height
  const topY = depth;

  const totalW = w + depth;
  const totalH = topY + bodyH + depth + 14;

  // Top face corners (parallelogram).
  const top = `${depth},${topY} ${depth + w},${topY} ${w},${topY + depth} 0,${topY + depth}`;
  // Front face.
  const frontY = topY + depth;
  const front = `0,${frontY} ${w},${frontY} ${w},${frontY + bodyH} 0,${frontY + bodyH}`;
  // Right side face.
  const side = `${w},${frontY} ${w + depth},${topY} ${w + depth},${topY + bodyH} ${w},${frontY + bodyH}`;

  const studXs = Array.from({ length: studs }, (_, i) => i * unit + unit / 2);

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      fill="none"
      aria-hidden
      {...props}
    >
      {/* studs */}
      {studXs.map((cx, i) => (
        <g key={i}>
          <ellipse cx={depth + cx} cy={topY - 5} rx={9} ry={5} fill={color} />
          <ellipse cx={depth + cx} cy={topY - 7} rx={9} ry={5} fill={color} />
          <ellipse cx={depth + cx} cy={topY - 7} rx={9} ry={5} fill="#000" opacity="0.04" />
          <ellipse cx={depth + cx} cy={topY - 8} rx={6} ry={3} fill="#fff" opacity="0.18" />
        </g>
      ))}
      {/* top face */}
      <polygon points={top} fill={color} />
      <polygon points={top} fill="#fff" opacity="0.1" />
      {/* front face */}
      <polygon points={front} fill={color} />
      <polygon points={front} fill="#000" opacity="0.16" />
      {/* side face */}
      <polygon points={side} fill={color} />
      <polygon points={side} fill="#000" opacity="0.34" />
    </svg>
  );
}
