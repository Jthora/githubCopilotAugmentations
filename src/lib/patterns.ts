import * as vscode from 'vscode';
import * as path from 'path';
import { canonicalDigest } from './hash';
import { parse } from 'yaml';

// Narrow minimal types for draft schema; refined later
export interface PatternTask {
  id: string; title?: string; description?: string; acceptance?: unknown[]; spawn?: unknown[];
}
export interface PatternOutputs { tasks?: PatternTask[]; [k: string]: unknown; }
export interface PatternConstraints { uniquenessKey?: string; maxDepth?: number; [k: string]: unknown; }
export interface PatternMatch { [k: string]: unknown; }
export interface RawPatternFile { version: number; pattern: string; priority?: number; match?: PatternMatch; outputs?: PatternOutputs; constraints?: PatternConstraints; }
export interface RegisteredPattern extends RawPatternFile { patternHash: string; priority: number; source: string; }

export class PatternRegistry {
  private patterns: RegisteredPattern[] = [];
  all(): RegisteredPattern[] { return this.patterns; }
  get(id: string): RegisteredPattern | undefined { return this.patterns.find(p => p.pattern === id); }
  replaceAll(p: RegisteredPattern[]) { this.patterns = [...p]; }
}

export interface LoadPatternOptions { channel: vscode.OutputChannel; }

export async function loadPatterns(workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined, channel: vscode.OutputChannel): Promise<RegisteredPattern[]> {
  if (!workspaceFolders || workspaceFolders.length === 0) { return []; }
  const root = workspaceFolders[0].uri;
  const patternDir = vscode.Uri.joinPath(root, 'autopilot', 'patterns');
  const files: vscode.Uri[] = [];
  try {
    const entries = await vscode.workspace.fs.readDirectory(patternDir);
    for (const [name, type] of entries) {
      if (type === vscode.FileType.File && /\.(ya?ml|json)$/i.test(name)) {
        files.push(vscode.Uri.joinPath(patternDir, name));
      }
    }
  } catch {
    return [];
  }
  const loaded: RegisteredPattern[] = [];
  for (const file of files) {
    try {
      const buf = await vscode.workspace.fs.readFile(file);
      const text = new TextDecoder('utf-8').decode(buf);
      let doc: RawPatternFile;
      if (/\.json$/i.test(file.fsPath)) {
        doc = JSON.parse(text);
      } else {
        doc = parse(text) as RawPatternFile;
      }
  const norm: RawPatternFile = { ...doc };
  const { sha256 } = canonicalDigest(norm);
      const reg: RegisteredPattern = {
        ...norm,
        patternHash: sha256,
        priority: typeof norm.priority === 'number' ? norm.priority : 100,
        source: path.relative(root.fsPath, file.fsPath)
      };
      loaded.push(reg);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      channel.appendLine(`[patterns] Failed to load ${file.fsPath}: ${msg}`);
    }
  }
  loaded.sort((a, b) => a.priority - b.priority || a.patternHash.localeCompare(b.patternHash));
  return loaded;
}
