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
});
