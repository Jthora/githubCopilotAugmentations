import { createHash } from 'crypto';

// Canonical JSON serialization per ADR-001
export interface CanonicalDigestResult { json: string; sha256: string; }

interface DigestOptions { allowlist?: string[]; }

type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONValue[] | { [key: string]: JSONValue };

function normalize(value: unknown, allowlist?: string[]): JSONValue {
  if (value === null) return value;
  if (Array.isArray(value)) return value.map(v => normalize(v, allowlist));
  if (typeof value !== 'object') return value as JSONPrimitive; // primitive
  const out: { [key: string]: JSONValue } = {};
  const keys = Object.keys(value as Record<string, unknown>).sort();
  for (const k of keys) {
    if (allowlist && allowlist.length && !allowlist.includes(k)) continue;
    out[k] = normalize((value as Record<string, unknown>)[k], allowlist);
  }
  return out;
}

export function canonicalDigest(value: unknown, opts: DigestOptions = {}): CanonicalDigestResult {
  const normalized = normalize(value, opts.allowlist);
  const json = JSON.stringify(normalized);
  const hash = createHash('sha256').update(json, 'utf8').digest('hex');
  return { json, sha256: hash };
}
