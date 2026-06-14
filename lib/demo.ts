import type { ClassRow, EventRow } from './types';

/**
 * Example content shown only while Supabase is not configured yet, so the
 * Classes and Events pages are never empty during setup. The moment you connect
 * Supabase, real data from the database takes over and this is ignored.
 */

const now = new Date().toISOString();

export const demoClasses: ClassRow[] = [
  {
    id: 'demo-class-1',
    title_en: 'Mobile Filmmaking Intensive',
    title_fa: 'دوره فشرده فیلم‌سازی با موبایل',
    description_en:
      'Plan, shoot, and edit a complete short film using only a phone. Covers framing, light, movement, sound, and a fast mobile editing workflow you can repeat on every project.',
    description_fa:
      'یک فیلم کوتاه کامل را تنها با موبایل برنامه‌ریزی، فیلم‌برداری و تدوین کنید. شامل کادربندی، نور، حرکت، صدا و یک جریان کاری سریع تدوین موبایلی که در هر پروژه قابل تکرار است.',
    type: 'online',
    price: 120,
    currency: 'TRY',
    capacity: 12,
    image_url: null,
    active: true,
    sold_out: false,
    created_at: now,
  },
  {
    id: 'demo-class-2',
    title_en: 'Photography Foundations',
    title_fa: 'مبانی عکاسی',
    description_en:
      'Build a confident eye: direction, shaping light, working with a subject, and a clean edit from capture to final frame.',
    description_fa:
      'نگاهی مطمئن بسازید: کارگردانی، شکل‌دهی نور، کار با سوژه و یک تدوین تمیز از ثبت تا فریم نهایی.',
    type: 'in_person',
    price: 300,
    currency: 'TRY',
    capacity: 4,
    image_url: null,
    active: true,
    sold_out: true,
    created_at: now,
  },
  {
    id: 'demo-class-3',
    title_en: 'Editing and Color for Music Videos',
    title_fa: 'تدوین و اصلاح رنگ برای نماهنگ',
    description_en:
      'Cut to the beat, shape rhythm and story, and grade a music video with a cinematic look. Includes a real project from rushes to delivery.',
    description_fa:
      'هماهنگ با ضرب‌آهنگ تدوین کنید، ریتم و روایت بسازید و یک نماهنگ را با حال‌وهوای سینمایی اصلاح رنگ کنید. شامل یک پروژه واقعی از راش تا خروجی نهایی.',
    type: 'online',
    price: null,
    currency: 'TRY',
    capacity: 15,
    image_url: null,
    active: true,
    sold_out: false,
    created_at: now,
  },
];

export const demoEvents: EventRow[] = [
  {
    id: 'demo-event-1',
    title_en: 'Portfolio Review Evening',
    title_fa: 'شب بررسی نمونه‌کار',
    description_en:
      'An in-person evening of one-to-one portfolio reviews and a short talk on building a body of work.',
    description_fa:
      'یک شب حضوری برای بررسی نمونه‌کار به‌صورت تک‌به‌تک و یک گفت‌وگوی کوتاه درباره ساختن یک مجموعه‌کار.',
    event_date: '2026-09-20',
    location_en: 'Istanbul',
    location_fa: 'استانبول',
    price: 200,
    currency: 'TRY',
    capacity: 20,
    image_url: null,
    active: true,
    sold_out: false,
    created_at: now,
  },
  {
    id: 'demo-event-2',
    title_en: 'Mobile Storytelling Workshop',
    title_fa: 'کارگاه روایت‌گری با موبایل',
    description_en:
      'A free, hands-on half day creating a short visual story on a phone, from idea to a finished edit. Limited places.',
    description_fa:
      'یک نیم‌روز عملی و رایگان برای ساختن یک داستان تصویری کوتاه با موبایل، از ایده تا تدوین نهایی. ظرفیت محدود.',
    event_date: '2026-11-08',
    location_en: 'Istanbul',
    location_fa: 'استانبول',
    price: null,
    currency: 'TRY',
    capacity: 15,
    image_url: null,
    active: true,
    sold_out: true,
    created_at: now,
  },
];
