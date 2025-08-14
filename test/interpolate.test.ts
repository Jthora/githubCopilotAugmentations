import { strict as assert } from 'assert';
import { interpolate, TEMPLATE_SELF_DIALOGUE } from '../src/lib/prompt';

describe('interpolate()', () => {
  it('replaces context token', () => {
    const result = interpolate('Hello {{context}}!', { context: 'World' });
    assert.equal(result, 'Hello World!');
  });

  it('replaces multiple occurrences', () => {
    const result = interpolate('{{context}} + {{context}}', { context: 'X' });
    assert.equal(result, 'X + X');
  });
});

describe('TEMPLATE_SELF_DIALOGUE', () => {
  it('contains required sections', () => {
    const t = TEMPLATE_SELF_DIALOGUE;
    ['Thought:', 'Question:', 'Answer:', 'Next:'].forEach(section => {
      assert.ok(t.includes(section), `Missing section ${section}`);
    });
  });
});
