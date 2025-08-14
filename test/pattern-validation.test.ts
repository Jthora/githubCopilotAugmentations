import { expect } from 'chai';
import * as vscode from 'vscode';
import { loadPatterns } from '../src/lib/patterns';

// Uses the real sample pattern created in repo.

describe('pattern validation', () => {
  it('loads sample entity pattern without errors', async () => {
    const channel = vscode.window.createOutputChannel('Test');
    const ws = vscode.workspace.workspaceFolders;
    expect(ws).to.not.be.undefined;
    const patterns = await loadPatterns(ws, channel);
    const found = patterns.find(p => p.pattern === 'sample-entity');
    expect(found).to.exist;
    expect(found?.priority).to.equal(90);
    channel.dispose();
  });
});
