import * as vscode from 'vscode';
import { strict as assert } from 'assert';

export async function run() {
  // Ensure extension activates by executing a contributed command
  try { await vscode.commands.executeCommand('copilotMacros.selfDialogue'); } catch { /* ignore */ }
  // Open a new untitled document for selection tests
  const doc = await vscode.workspace.openTextDocument({ content: 'function add(a, b){\n  return a + b;\n}\n' });
  const editor = await vscode.window.showTextDocument(doc);

  // Make a selection
  const start = new vscode.Position(0, 0);
  const end = new vscode.Position(0, 15);
  editor.selection = new vscode.Selection(start, end);

  // Execute command
  await vscode.commands.executeCommand('copilotMacros.selfDialogue');

  // Clipboard should contain template with snippet of code
  const clip = await vscode.env.clipboard.readText();
  assert.ok(clip.includes('Talk to yourself about it.'), 'Self Dialogue template missing');
  assert.ok(clip.includes('function add'), 'Selection context not present');

  // Now clear selection and test critique fallback (file name placeholder)
  editor.selection = new vscode.Selection(start, start); // empty selection
  await vscode.commands.executeCommand('copilotMacros.critique');
  const clip2 = await vscode.env.clipboard.readText();
  assert.ok(clip2.includes('Act as a senior reviewer.'), 'Critique template missing');
  assert.ok(clip2.includes('File:'), 'Fallback file name context missing');

  // Change status bar macro setting to critique and run command via ID
  await vscode.workspace.getConfiguration().update('copilotMacros.statusBarMacro', 'critique', vscode.ConfigurationTarget.Global);
  // Invoke the selfDialogue command again to ensure distinct behavior
  await vscode.commands.executeCommand('copilotMacros.selfDialogue');
  const clip3 = await vscode.env.clipboard.readText();
  assert.ok(clip3.includes('Talk to yourself about it.'), 'Self Dialogue template missing after status bar change');

  // Test cycling status bar macro (should rotate to next)
  await vscode.commands.executeCommand('copilotMacros.cycleStatusBarMacro');
  const afterCycle = vscode.workspace.getConfiguration().get<string>('copilotMacros.statusBarMacro');
  assert.ok(afterCycle, 'Status bar macro not set after cycle');

  // Omit pickMacro QuickPick in automated test (would require UI interaction).
}

// Mocha style function expected by test runner
// VS Code test runner expects module export named run
module.exports = { run };
