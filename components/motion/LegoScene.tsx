'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { LegoBrick } from '@/components/ui/LegoBrick';
import { Astronaut } from '@/components/ui/Astronaut';

// Classic, vivid LEGO plastic palette.
const RED = '#D8362B';
const YELLOW = '#FFC500';
const BLUE = '#1574D6';
const GREEN = '#2EA84F';
const CYAN = '#22B8CF';

type Piece = {
  kind: 'brick' | 'astronaut';
  /** position as CSS inset percentages */
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size: number;
  color?: string;
  visor?: string;
  studs?: 2 | 3 | 4;
  float: number; // vertical travel in px
  spin: number; // rotation amplitude in deg
  duration: number;
  delay: number;
  z?: number;
  opacity?: number;
};

const heroPieces: Piece[] = [
  { kind: 'astronaut', top: '6%', right: '8%', size: 132, visor: YELLOW, float: 26, spin: 8, duration: 9, delay: 0, opacity: 1 },
  { kind: 'astronaut', bottom: '8%', left: '4%', size: 96, visor: CYAN, float: 22, spin: -10, duration: 10, delay: 1.2, opacity: 0.96 },
  { kind: 'brick', top: '14%', left: '10%', size: 120, color: RED, studs: 2, float: 18, spin: 12, duration: 7.5, delay: 0.3 },
  { kind: 'brick', top: '30%', right: '22%', size: 92, color: YELLOW, studs: 3, float: 22, spin: -14, duration: 8.5, delay: 0.8 },
  { kind: 'brick', bottom: '24%', right: '6%', size: 110, color: BLUE, studs: 2, float: 20, spin: 10, duration: 9, delay: 0.5 },
  { kind: 'brick', bottom: '14%', left: '28%', size: 80, color: GREEN, studs: 2, float: 16, spin: -12, duration: 7, delay: 1.5 },
  { kind: 'brick', top: '54%', left: '3%', size: 70, color: CYAN, studs: 2, float: 24, spin: 16, duration: 8, delay: 0.2 },
  { kind: 'brick', top: '8%', left: '40%', size: 64, color: BLUE, studs: 2, float: 14, spin: -10, duration: 6.5, delay: 1.1, opacity: 0.85 },
];

const ambientPieces: Piece[] = [
  { kind: 'brick', top: '12%', right: '6%', size: 70, color: RED, studs: 2, float: 16, spin: 10, duration: 8, delay: 0.2, opacity: 0.5 },
  { kind: 'brick', bottom: '14%', left: '5%', size: 60, color: YELLOW, studs: 3, float: 18, spin: -12, duration: 9, delay: 0.9, opacity: 0.45 },
  { kind: 'astronaut', bottom: '6%', right: '10%', size: 78, visor: CYAN, float: 20, spin: -8, duration: 10, delay: 0.4, opacity: 0.5 },
  { kind: 'brick', top: '40%', left: '8%', size: 50, color: BLUE, studs: 2, float: 14, spin: 14, duration: 7.5, delay: 1.3, opacity: 0.4 },
];

/**
 * A living LEGO world that drifts behind content: colourful bricks and
 * astronaut minifigures that bob, spin gently, and parallax. The motion runs on
 * GPU transforms only and is fully disabled under prefers-reduced-motion, where
 * the pieces simply rest in place. It is decorative, so pointer events are off
 * and it never sits directly under reading text.
 */
export function LegoScene({
  variant = 'hero',
  className = '',
}: {
  variant?: 'hero' | 'ambient';
  className?: string;
}) {
  const reduce = useReducedMotion();
  const pieces = variant === 'hero' ? heroPieces : ambientPieces;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {pieces.map((p, i) => {
        const style: React.CSSProperties = {
          position: 'absolute',
          top: p.top,
          left: p.left,
          right: p.right,
          bottom: p.bottom,
          width: p.size,
          zIndex: p.z ?? 0,
          opacity: p.opacity ?? 1,
          willChange: 'transform',
          filter: 'drop-shadow(0 18px 22px rgba(0,0,0,0.28))',
        };

        const animate = reduce
          ? undefined
          : {
              y: [0, -p.float, 0, p.float * 0.5, 0],
              rotate: [0, p.spin, 0, -p.spin * 0.6, 0],
            };

        return (
          <motion.div
            key={i}
            style={style}
            animate={animate}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          >
            {p.kind === 'brick' ? (
              <LegoBrick color={p.color} studs={p.studs ?? 2} className="w-full" />
            ) : (
              <Astronaut visor={p.visor} className="w-full" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
