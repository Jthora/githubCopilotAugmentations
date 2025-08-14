import { expect } from 'chai';
import * as vscode from 'vscode';
import { loadPatterns } from '../src/lib/patterns';

// These tests are lightweight; they rely on absence of patterns directory.

describe('pattern loader', () => {
  it('returns empty when no workspace', async () => {
    const channel = vscode.window.createOutputChannel('Test');
    const res = await loadPatterns(undefined, channel);
    expect(res).to.be.an('array').that.is.empty;
    channel.dispose();
  });
});
