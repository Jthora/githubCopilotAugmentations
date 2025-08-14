import * as vscode from 'vscode';
import { collectContext } from './context';
import { interpolate } from './prompt';
import { MacroDef } from './registry';

export interface RunOptions { warnLines: number; debug: boolean; channel: vscode.OutputChannel; }

export async function executeMacro(macro: MacroDef, opts: RunOptions): Promise<void> {
  const start = Date.now();
  const ctx = collectContext();
  const prompt = interpolate(macro.template, { context: ctx.text });

  if (opts.debug) {
    opts.channel.appendLine(`[debug] macro=${macro.id} origin=${ctx.origin} lines=${ctx.lineCount}`);
  }

  if (ctx.origin === 'selection' && ctx.lineCount > opts.warnLines) {
    vscode.window.showWarningMessage(`Selection has ${ctx.lineCount} lines (> ${opts.warnLines}). Consider narrowing for focus.`);
  }

  await vscode.env.clipboard.writeText(prompt);
  try { await vscode.commands.executeCommand('github.copilot.openPanel'); } catch { /* ignore */ }
  const elapsed = Date.now() - start;
  if (opts.debug) {
    opts.channel.appendLine(`[debug] prompt length=${prompt.length} elapsedMs=${elapsed}`);
  }
  vscode.window.showInformationMessage(`${macro.title} prompt copied (${ctx.lineCount} lines). Paste into Copilot Chat.`);
}
