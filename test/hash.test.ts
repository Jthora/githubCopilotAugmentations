import { expect } from 'chai';
import { canonicalDigest } from '../src/lib/hash';

describe('canonicalDigest', () => {
  it('produces same hash for different key orders', () => {
    const a = { b: 2, a: 1 };
    const b = { a: 1, b: 2 };
    expect(canonicalDigest(a).sha256).to.equal(canonicalDigest(b).sha256);
  });
  it('allowlist filters out fields', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const h1 = canonicalDigest(obj, { allowlist: ['a', 'c'] }).sha256;
    const h2 = canonicalDigest({ a: 1, c: 3 }, { allowlist: ['a', 'c'] }).sha256;
    expect(h1).to.equal(h2);
  });
  it('is stable across key permutations (fuzz small)', () => {
    const base = { a: 1, b: 2, c: 3, d: 4 };
    const keys = Object.keys(base);
    const first = canonicalDigest(base).sha256;
    // simple permutations subset
    for (let i = 0; i < 10; i++) {
      const shuffled = [...keys].sort(() => Math.random() - 0.5);
      const obj: Record<string, number> = {};
      for (const k of shuffled) obj[k] = (base as Record<string, number>)[k];
      expect(canonicalDigest(obj).sha256).to.equal(first);
    }
  });
  it('normalizes unicode to NFC', () => {
    const composed = 'é'; // U+00E9
    const decomposed = 'e\u0301'; // e + combining acute
    const h1 = canonicalDigest({ t: composed }).sha256;
    const h2 = canonicalDigest({ t: decomposed }).sha256;
    expect(h1).to.equal(h2);
  });
  it('emits size warning for large objects', () => {
    let warned = false;
    const big: Record<string, string> = {};
    for (let i = 0; i < 5000; i++) big['k' + i] = 'x'.repeat(20);
    canonicalDigest(big, { sizeWarnBytes: 10000, onSizeWarn: () => { warned = true; } });
    expect(warned).to.equal(true);
  });
});
