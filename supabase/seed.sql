-- Optional seed data for local development and previews.
-- Safe to run after 0001_schema.sql. Remove or edit before going live.

insert into public.classes
  (title_en, title_fa, description_en, description_fa, type, price, currency, capacity, active)
values
  (
    'Mobile Filmmaking Intensive',
    'دوره فشرده فیلم‌سازی با موبایل',
    'Plan, shoot, and edit a complete short film using only a phone. Covers framing, light, movement, and a fast mobile editing workflow.',
    'یک فیلم کوتاه کامل را تنها با موبایل برنامه‌ریزی، فیلم‌برداری و تدوین کنید. شامل کادربندی، نور، حرکت و یک جریان کاری سریع تدوین موبایلی.',
    'online', 120, 'TRY', 12, true
  ),
  (
    'Fashion Photography Foundations',
    'مبانی عکاسی مد',
    'Build a confident eye for fashion: direction, light shaping, and a clean editorial edit from capture to final frame.',
    'نگاهی مطمئن برای عکاسی مد بسازید: کارگردانی، شکل‌دهی نور و یک تدوین تمیز ادیتوریال از ثبت تا فریم نهایی.',
    'in_person', 300, 'TRY', 4, true
  ),
  (
    'Editing and Color for Music Videos',
    'تدوین و اصلاح رنگ برای نماهنگ',
    'Cut to the beat, shape rhythm and story, and grade a music video with a cinematic look. Includes a real project from rushes to delivery.',
    'هماهنگ با ضرب‌آهنگ تدوین کنید، ریتم و روایت بسازید و یک نماهنگ را با حال‌وهوای سینمایی اصلاح رنگ کنید. شامل یک پروژه واقعی از راش تا خروجی نهایی.',
    'online', 150, 'TRY', 15, true
  );

insert into public.events
  (title_en, title_fa, description_en, description_fa, event_date, location_en, location_fa, active)
values
  (
    'Portfolio Review Evening',
    'شب بررسی نمونه‌کار',
    'An in-person evening of one-to-one portfolio reviews and a short talk on building a body of work.',
    'یک شب حضوری برای بررسی نمونه‌کار به‌صورت تک‌به‌تک و یک گفت‌وگوی کوتاه درباره ساختن یک مجموعه‌کار.',
    '2026-09-20', 'Istanbul', 'استانبول', true
  ),
  (
    'Mobile Storytelling Workshop',
    'کارگاه روایت‌گری با موبایل',
    'A hands-on half day creating a short visual story on a phone, from idea to a finished edit.',
    'نیم‌روز عملی برای ساختن یک داستان تصویری کوتاه با موبایل، از ایده تا تدوین نهایی.',
    '2026-11-08', 'Istanbul', 'استانبول', true
  );
