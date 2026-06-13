import type { WorkCategory } from './types';

export interface WorkItem {
  /** Stable id, also used as the image slot name. */
  id: string;
  category: WorkCategory;
  /** Public path the client drops the provided photo into. */
  src: string;
  /** Aspect ratio class controlling the tile shape in the brick wall. */
  aspect: string;
  /** Alt text per locale. Keep descriptive for accessibility and SEO. */
  alt: { en: string; fa: string };
}

/**
 * Portfolio image-slot manifest. The portfolio is a curated, fixed wall of
 * named slots so the client can drop provided photos into the correct place.
 * Replace each `src` file in /public/images/work with the real photograph.
 * See docs/IMAGE_MANIFEST.md for the full list and dimensions.
 */
export const workItems: WorkItem[] = [
  {
    id: 'fashion-01',
    category: 'fashion',
    src: '/images/work/fashion-01.jpg',
    aspect: 'aspect-[4/5]',
    alt: { en: 'Fashion editorial, look one', fa: 'ادیتوریال مد، لوک اول' },
  },
  {
    id: 'film-01',
    category: 'film',
    src: '/images/work/film-01.jpg',
    aspect: 'aspect-[3/4]',
    alt: { en: 'Music video still', fa: 'فریم نماهنگ' },
  },
  {
    id: 'direction-01',
    category: 'direction',
    src: '/images/work/direction-01.jpg',
    aspect: 'aspect-[4/5]',
    alt: { en: 'Art direction, set composition', fa: 'کارگردانی هنری، ترکیب صحنه' },
  },
  {
    id: 'fashion-02',
    category: 'fashion',
    src: '/images/work/fashion-02.jpg',
    aspect: 'aspect-[3/4]',
    alt: { en: 'Fashion editorial, look two', fa: 'ادیتوریال مد، لوک دوم' },
  },
  {
    id: 'film-02',
    category: 'film',
    src: '/images/work/film-02.jpg',
    aspect: 'aspect-[4/5]',
    alt: { en: 'Music video still, two', fa: 'فریم نماهنگ، دوم' },
  },
  {
    id: 'fashion-03',
    category: 'fashion',
    src: '/images/work/fashion-03.jpg',
    aspect: 'aspect-[4/5]',
    alt: { en: 'Fashion editorial, look three', fa: 'ادیتوریال مد، لوک سوم' },
  },
  {
    id: 'direction-02',
    category: 'direction',
    src: '/images/work/direction-02.jpg',
    aspect: 'aspect-[3/4]',
    alt: { en: 'Art direction, campaign frame', fa: 'کارگردانی هنری، فریم کمپین' },
  },
  {
    id: 'film-03',
    category: 'film',
    src: '/images/work/film-03.jpg',
    aspect: 'aspect-[4/5]',
    alt: { en: 'Music video still, three', fa: 'فریم نماهنگ، سوم' },
  },
];

/** A small curated selection for the home teaser. */
export const teaserWork = workItems.slice(0, 4);
