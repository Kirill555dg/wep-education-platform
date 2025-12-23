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

export type PageLike<TItem> = {
  items: TItem[];
  total: number;
  skip: number;
  limit: number;
};

export async function fetchAllPages<TItem>(
  fetchPage: (params: { skip: number; limit: number }) => Promise<PageLike<TItem>>,
  opts: { maxItems?: number; limit?: number } = {}
): Promise<{ items: TItem[]; total: number; truncated: boolean }> {
  const limit = clampLimit(opts.limit ?? MAX_LIMIT);
  const maxItems = Math.max(limit, opts.maxItems ?? 2000);

  const all: TItem[] = [];
  let skip = 0;
  let total = 0;
  let truncated = false;

  while (true) {
    const page = await fetchPage({ skip, limit });
    total = page.total ?? total;
    all.push(...page.items);

    if (all.length >= maxItems) {
      truncated = true;
      all.length = maxItems;
      break;
    }

    if (page.items.length === 0) break;
    skip += page.items.length;
    if (skip >= page.total) break;
  }

  return { items: all, total, truncated };
}


