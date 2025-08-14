import { expect } from 'chai';
import { expandPlan, buildExpandedPlan } from '../src/autopilot/plan';
import { RegisteredPattern } from '../src/lib/patterns';
import { canonicalDigest } from '../src/lib/hash';

// Lightweight unit test for deterministic ordering

describe('plan expansion', () => {
  it('expands entities deterministically', () => {
    const spec = { name: 'X', entities: [{ name: 'A' }, { name: 'B' }] };
    const patterns: RegisteredPattern[] = [
      { version:1, pattern:'sample-entity', priority:90, match:{ kind:'entity' }, outputs:{ tasks:[ { id:'model-${name}', title:'m' }, { id:'test-${name}', title:'t' } ] }, constraints: {}, patternHash:'h', source:'mem'}
    ];
    const tasks = expandPlan(spec as any, patterns);
    expect(tasks.map(t=>t.id)).to.deep.equal(['model-A','test-A','model-B','test-B']);
  const plan = buildExpandedPlan(spec as any, canonicalDigest(spec).sha256, patterns);
    expect(plan.tasks.length).to.equal(4);
  });
});
