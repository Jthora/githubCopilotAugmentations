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

async function discoverFiles(dir: vscode.Uri, acc: vscode.Uri[]): Promise<void> {
  let entries: [string, vscode.FileType][];
  try { entries = await vscode.workspace.fs.readDirectory(dir); } catch { return; }
  for (const [name, type] of entries) {
    const child = vscode.Uri.joinPath(dir, name);
    if (type === vscode.FileType.Directory) {
      await discoverFiles(child, acc);
    } else if (type === vscode.FileType.File && /\.(ya?ml|json)$/i.test(name)) {
      acc.push(child);
    }
  }
}

function validatePattern(raw: RawPatternFile, source: string): { ok: boolean; messages: string[] } {
  const messages: string[] = [];
  if (raw.version !== 1) messages.push(`version must be 1 (got ${raw.version})`);
  if (!raw.pattern || typeof raw.pattern !== 'string') messages.push('pattern id missing');
  if (raw.priority !== undefined && typeof raw.priority !== 'number') messages.push('priority must be number');
  // Additional schema checks (shallow):
  if (raw.outputs && typeof raw.outputs !== 'object') messages.push('outputs must be object');
  return { ok: messages.length === 0, messages: messages.map(m => `${source}: ${m}`) };
}

export async function loadPatterns(workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined, channel: vscode.OutputChannel): Promise<RegisteredPattern[]> {
  if (!workspaceFolders || workspaceFolders.length === 0) { return []; }
  const root = workspaceFolders[0].uri;
  const patternDir = vscode.Uri.joinPath(root, 'autopilot', 'patterns');
  const files: vscode.Uri[] = [];
  await discoverFiles(patternDir, files);
  if (files.length === 0) {
    channel.appendLine('[patterns] No pattern files found.');
    return [];
  }
  const loaded: RegisteredPattern[] = [];
  const errors: string[] = [];
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
      const validation = validatePattern(norm, file.fsPath);
      if (!validation.ok) {
        errors.push(...validation.messages);
        continue;
      }
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
  // Duplicate id detection
  const byId: Record<string, RegisteredPattern[]> = {};
  for (const p of loaded) { (byId[p.pattern] ||= []).push(p); }
  for (const id of Object.keys(byId)) {
    if (byId[id].length > 1) {
      errors.push(`duplicate pattern id '${id}' in sources: ${byId[id].map(p => p.source).join(', ')}`);
    }
  }
  loaded.sort((a, b) => a.priority - b.priority || a.patternHash.localeCompare(b.patternHash));
  if (errors.length) {
    channel.appendLine(`[patterns] Validation errors (${errors.length}):`);
    errors.forEach(e => channel.appendLine(`  - ${e}`));
  } else {
    channel.appendLine(`[patterns] Loaded ${loaded.length} pattern(s) with no validation errors.`);
  }
  return loaded;
}
