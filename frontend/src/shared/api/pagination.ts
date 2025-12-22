export const MAX_LIMIT = 100;

export function clampLimit(limit: number | undefined, fallback: number = MAX_LIMIT): number {
  if (!Number.isFinite(limit as number)) return fallback;
  const n = Number(limit);
  if (n <= 0) return fallback;
  return Math.min(n, MAX_LIMIT);
}

export function clampSkip(skip: number | undefined, fallback: number = 0): number {
  if (!Number.isFinite(skip as number)) return fallback;
  return Math.max(0, Number(skip));
}


