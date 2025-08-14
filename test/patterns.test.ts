import { expect } from 'chai';
import * as vscode from 'vscode';
import { loadPatterns } from '../src/lib/patterns';

describe('pattern loader', () => {
  it('returns empty when no workspace', async () => {
    const channel = vscode.window.createOutputChannel('Test');
    const res = await loadPatterns(undefined, channel);
    expect(res).to.be.an('array').that.is.empty;
    channel.dispose();
  });

  it('orders by priority then hash and drops duplicates', async () => {
    const channel = vscode.window.createOutputChannel('TestPatterns');
    const ws = vscode.workspace.workspaceFolders;
    expect(ws).to.not.be.undefined;
    const patterns = await loadPatterns(ws, channel);
    // sample-entity should exist only once (duplicate dropped)
    const occurrences = patterns.filter(p => p.pattern === 'sample-entity');
    expect(occurrences.length).to.equal(1);
    // Ensure ordering stable: priorities ascending
    const priorities = patterns.map(p => p.priority);
    const sorted = [...priorities].sort((a,b)=>a-b);
    expect(priorities).to.deep.equal(sorted);
    channel.dispose();
  });
});
