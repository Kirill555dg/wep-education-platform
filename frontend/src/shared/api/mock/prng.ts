export type Rng = {
  next: () => number; // [0,1)
  int: (min: number, max: number) => number;
  pick: <T>(items: T[]) => T;
};

function hashStringToU32(input: string): number {
  // FNV-1a 32-bit
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function createRng(seed: string): Rng {
  // xorshift32
  let state = hashStringToU32(seed) || 0x12345678;
  const nextU32 = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return state >>> 0;
  };

  const next = () => nextU32() / 0xffffffff;
  const int = (min: number, max: number) => {
    const a = Math.min(min, max);
    const b = Math.max(min, max);
    const r = next();
    return a + Math.floor(r * (b - a + 1));
  };
  const pick = <T,>(items: T[]) => items[int(0, items.length - 1)];

  return { next, int, pick };
}


