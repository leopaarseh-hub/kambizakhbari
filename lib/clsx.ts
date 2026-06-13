/**
 * Minimal class-name joiner. Filters out falsy values so conditional classes
 * read cleanly at call sites without pulling in a dependency.
 */
export function clsx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(' ');
}
