import * as vscode from 'vscode';
import { ExpandedPlan, TaskNode } from './plan';
import { canonicalDigest } from '../lib/hash';

export interface IterationResult {
  task: TaskNode | null;
  status: 'no_tasks' | 'completed';
  iterationDigest: string;
  timestamp: number;
}

export function pickNextTask(plan: ExpandedPlan): TaskNode | null {
  // order: as-is for now; deterministic because expansion deterministic
  return plan.tasks.find(t => t.status === 'pending') || null;
}

export async function runSingleIteration(plan: ExpandedPlan, channel: vscode.OutputChannel): Promise<IterationResult> {
  const task = pickNextTask(plan);
  if (!task) {
    const { sha256 } = canonicalDigest({ noop: true });
    return { task: null, status: 'no_tasks', iterationDigest: sha256, timestamp: Date.now() };
  }
  // Mark in_progress then validated (placeholder without real work)
  task.status = 'in_progress';
  // Simulate validation success immediately
  task.status = 'validated';
  const { sha256 } = canonicalDigest({ task: task.id, prev: plan.rootDigest });
  channel.appendLine(`[iteration] Ran task ${task.id} -> validated`);
  return { task, status: 'completed', iterationDigest: sha256, timestamp: Date.now() };
}
