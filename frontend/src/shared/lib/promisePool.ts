export async function mapWithConcurrency<TIn, TOut>(
  items: TIn[],
  concurrency: number,
  mapper: (item: TIn, idx: number) => Promise<TOut>
): Promise<TOut[]> {
  const limit = Math.max(1, Math.floor(concurrency));
  const out: TOut[] = new Array(items.length);
  let cursor = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }).map(async () => {
    while (true) {
      const idx = cursor++;
      if (idx >= items.length) return;
      out[idx] = await mapper(items[idx], idx);
    }
  });

  await Promise.all(workers);
  return out;
}


