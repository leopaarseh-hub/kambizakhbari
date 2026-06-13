# Image slot manifest

Drop the client-provided photographs into the exact paths below. Until a file
is present, the site shows a clean branded placeholder plate (never a broken
image), so you can fill slots incrementally.

All static slots live under `public/images/`. Use high-quality JPGs (or WebP).
`next/image` handles compression, AVIF/WebP conversion, and responsive sizes.

## Static slots (drop files into `public/images/`)

| Slot | Path | Suggested ratio | Suggested size | Used on |
| --- | --- | --- | --- | --- |
| Hero portrait | `public/images/hero-portrait.jpg` | 4:5 portrait | 1200 x 1500 | Home hero |
| Biography portrait | `public/images/about-portrait.jpg` | 4:5 portrait | 1200 x 1500 | Biography |
| Open Graph image | `public/og.jpg` | 1.91:1 | 1200 x 630 | Social share preview |

## Portfolio wall (drop files into `public/images/work/`)

The portfolio is a curated wall of named slots defined in `lib/work.ts`.
Replace each file below. To add, remove, or reorder tiles, edit `lib/work.ts`
(each item has an `id`, `category`, `src`, `aspect`, and bilingual `alt`).

| Slot id | Path | Category | Ratio |
| --- | --- | --- | --- |
| fashion-01 | `public/images/work/fashion-01.jpg` | Fashion | 4:5 |
| fashion-02 | `public/images/work/fashion-02.jpg` | Fashion | 3:4 |
| fashion-03 | `public/images/work/fashion-03.jpg` | Fashion | 4:5 |
| film-01 | `public/images/work/film-01.jpg` | Film | 3:4 |
| film-02 | `public/images/work/film-02.jpg` | Film | 4:5 |
| film-03 | `public/images/work/film-03.jpg` | Film | 4:5 |
| direction-01 | `public/images/work/direction-01.jpg` | Direction | 4:5 |
| direction-02 | `public/images/work/direction-02.jpg` | Direction | 3:4 |

Update the `alt` text per slot in `lib/work.ts` so it describes each photograph
accurately in both English and Persian (important for accessibility and SEO).

## Dynamic images (uploaded via the admin panel)

These are not files in the repo. They are uploaded through `/admin` and stored
in the Supabase `media` bucket:

- Class images (Classes manager)
- Event images (Events manager)
