/**
 * Top scroll-progress bar. Driven purely by CSS scroll timelines (see
 * .ka-scroll-progress in globals.css), so it adds no JavaScript work on scroll,
 * which keeps scrolling perfectly smooth. Degrades to hidden where scroll
 * timelines are unsupported.
 */
export function ScrollProgress() {
  return (
    <div
      aria-hidden
      className="ka-scroll-progress fixed inset-x-0 top-0 z-[60] h-[3px] bg-brick"
    />
  );
}
