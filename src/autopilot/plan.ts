import { canonicalDigest } from '../lib/hash';
import * as vscode from 'vscode';
import { RegisteredPattern } from '../lib/patterns';

export interface RootSpec { name: string; entities?: { name: string; [k:string]: unknown }[]; }
export interface TaskNode { id: string; title?: string; pattern: string; status: 'pending' | 'in_progress' | 'validated' | 'done' | 'blocked'; meta?: Record<string, unknown>; }
export interface ExpandedPlan { rootDigest: string; tasks: TaskNode[]; generatedAt: number; }

export async function loadRootSpec(workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined): Promise<{ spec: RootSpec | null; digest: string | null }> {
  if (!workspaceFolders || workspaceFolders.length === 0) return { spec: null, digest: null };
  const root = workspaceFolders[0].uri;
  const file = vscode.Uri.joinPath(root, 'autopilot', 'plan', 'rootspec.json');
  try {
    const data = await vscode.workspace.fs.readFile(file);
    const text = new TextDecoder('utf-8').decode(data);
    const spec = JSON.parse(text) as RootSpec;
    const { sha256 } = canonicalDigest(spec);
    return { spec, digest: sha256 };
  } catch {
    return { spec: null, digest: null };
  }
}

export function expandPlan(spec: RootSpec, patterns: RegisteredPattern[]): TaskNode[] {
  const tasks: TaskNode[] = [];
  // naive expansion: for each entity in spec, find patterns whose match.kind==entity
  if (spec.entities) {
    for (const ent of spec.entities) {
      for (const p of patterns) {
        const matchKind = (p.match as Record<string, unknown> | undefined)?.kind;
        if (matchKind === 'entity') {
          if (p.outputs?.tasks) {
            for (const t of p.outputs.tasks) {
              const id = t.id.replace('${name}', String(ent.name));
              tasks.push({ id, title: t.title?.replace('${name}', String(ent.name)), pattern: p.pattern, status: 'pending', meta: { entity: ent.name } });
            }
          }
        }
      }
    }
  }
  // dedupe by id
  const seen = new Set<string>();
  return tasks.filter(t => { if (seen.has(t.id)) return false; seen.add(t.id); return true; });
}

export function buildExpandedPlan(spec: RootSpec, digest: string, patterns: RegisteredPattern[]): ExpandedPlan {
  const tasks = expandPlan(spec, patterns);
  return { rootDigest: digest, tasks, generatedAt: Date.now() };
}
