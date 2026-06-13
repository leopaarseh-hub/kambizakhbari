'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { LegoBrick } from '@/components/ui/LegoBrick';
import { Astronaut } from '@/components/ui/Astronaut';
import { Spaceship } from '@/components/ui/Spaceship';

const RED = '#D8362B';
const YELLOW = '#FFC500';
const BLUE = '#1574D6';
const GREEN = '#2EA84F';
const CYAN = '#22B8CF';
const ORANGE = '#FF7A1A';
const PURPLE = '#8B5CF6';

type Piece = {
  kind: 'brick' | 'astronaut';
  top: string;
  left: string;
  size: number;
  color?: string;
  visor?: string;
  studs?: 2 | 3 | 4;
  float: number;
  spin: number;
  duration: number;
  delay: number;
  opacity: number;
};

// A dense field of bricks and astronauts spread across the viewport. Brighter,
// larger pieces sit near the edges; dimmer ones drift through the centre so
// they never fight the reading plates layered on top.
const pieces: Piece[] = [
  { kind: 'brick', top: '8%', left: '4%', size: 96, color: RED, studs: 2, float: 18, spin: 12, duration: 8, delay: 0, opacity: 0.85 },
  { kind: 'brick', top: '16%', left: '88%', size: 84, color: YELLOW, studs: 3, float: 22, spin: -14, duration: 9, delay: 0.6, opacity: 0.85 },
  { kind: 'astronaut', top: '4%', left: '70%', size: 110, visor: YELLOW, float: 24, spin: 8, duration: 10, delay: 0.2, opacity: 0.9 },
  { kind: 'brick', top: '30%', left: '2%', size: 70, color: BLUE, studs: 2, float: 16, spin: 14, duration: 7.5, delay: 1.1, opacity: 0.7 },
  { kind: 'brick', top: '40%', left: '50%', size: 48, color: GREEN, studs: 2, float: 14, spin: 18, duration: 7, delay: 0.4, opacity: 0.28 },
  { kind: 'brick', top: '26%', left: '60%', size: 44, color: CYAN, studs: 2, float: 12, spin: -10, duration: 6.5, delay: 1.4, opacity: 0.25 },
  { kind: 'astronaut', top: '44%', left: '92%', size: 88, visor: CYAN, float: 20, spin: -10, duration: 9.5, delay: 0.8, opacity: 0.8 },
  { kind: 'brick', top: '58%', left: '6%', size: 88, color: YELLOW, studs: 2, float: 20, spin: -12, duration: 8.5, delay: 0.3, opacity: 0.8 },
  { kind: 'brick', top: '64%', left: '84%', size: 96, color: RED, studs: 3, float: 22, spin: 12, duration: 9, delay: 1.2, opacity: 0.82 },
  { kind: 'brick', top: '52%', left: '40%', size: 42, color: PURPLE, studs: 2, float: 12, spin: 16, duration: 6.8, delay: 0.9, opacity: 0.24 },
  { kind: 'astronaut', top: '74%', left: '46%', size: 70, visor: ORANGE, float: 18, spin: 8, duration: 10, delay: 0.5, opacity: 0.4 },
  { kind: 'brick', top: '82%', left: '14%', size: 76, color: BLUE, studs: 2, float: 18, spin: -14, duration: 8, delay: 0.7, opacity: 0.75 },
  { kind: 'brick', top: '86%', left: '70%', size: 84, color: GREEN, studs: 2, float: 20, spin: 12, duration: 8.8, delay: 0.2, opacity: 0.75 },
  { kind: 'brick', top: '72%', left: '26%', size: 40, color: CYAN, studs: 2, float: 12, spin: -16, duration: 6.5, delay: 1.5, opacity: 0.22 },
  { kind: 'brick', top: '12%', left: '40%', size: 40, color: ORANGE, studs: 2, float: 12, spin: 14, duration: 7.2, delay: 1.0, opacity: 0.22 },
];

type Ship = {
  top: string;
  size: number;
  duration: number;
  delay: number;
  dir: 1 | -1;
  hull: string;
  nose: string;
};

const ships: Ship[] = [
  { top: '20%', size: 230, duration: 30, delay: 1, dir: 1, hull: '#E8E6DF', nose: RED },
  { top: '66%', size: 180, duration: 38, delay: 6, dir: -1, hull: '#D7E3EE', nose: BLUE },
];

/**
 * The site-wide LEGO galaxy: a fixed field of colourful bricks and astronauts
 * that bob and spin, with spaceships flying across, behind every page. It is
 * mounted once in the root layout so it persists smoothly across navigation.
 * Decorative only: pointer events off, and under prefers-reduced-motion the
 * pieces rest in place and the ships hold still at the edge.
 */
export function SiteBackground() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* deep-space glows for atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(45% 40% at 82% 12%, rgba(34,184,207,0.12), transparent 60%), radial-gradient(40% 38% at 10% 80%, rgba(216,54,43,0.12), transparent 60%), radial-gradient(45% 45% at 60% 60%, rgba(21,116,214,0.08), transparent 60%)',
        }}
      />

      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            opacity: p.opacity,
            willChange: 'transform',
            filter: 'drop-shadow(0 16px 20px rgba(0,0,0,0.45))',
          }}
          animate={
            reduce
              ? undefined
              : { y: [0, -p.float, 0, p.float * 0.5, 0], rotate: [0, p.spin, 0, -p.spin * 0.6, 0] }
          }
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        >
          {p.kind === 'brick' ? (
            <LegoBrick color={p.color} studs={p.studs ?? 2} className="w-full" />
          ) : (
            <Astronaut visor={p.visor} className="w-full" />
          )}
        </motion.div>
      ))}

      {ships.map((s, i) => (
        <motion.div
          key={`ship-${i}`}
          className="absolute"
          style={{
            top: s.top,
            width: s.size,
            opacity: 0.9,
            willChange: 'transform',
            filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.5))',
          }}
          initial={reduce ? false : { x: s.dir === 1 ? '-16vw' : '116vw' }}
          animate={
            reduce
              ? { x: s.dir === 1 ? '4vw' : '80vw' }
              : { x: s.dir === 1 ? '116vw' : '-16vw' }
          }
          transition={
            reduce
              ? { duration: 0 }
              : { duration: s.duration, repeat: Infinity, ease: 'linear', delay: s.delay }
          }
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -14, 0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Spaceship
              hull={s.hull}
              nose={s.nose}
              className={s.dir === -1 ? 'w-full -scale-x-100' : 'w-full'}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
