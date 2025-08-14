import * as vscode from 'vscode';
import { TEMPLATE_SELF_DIALOGUE, TEMPLATE_CRITIQUE, interpolate } from './lib/prompt';
import { MacroRegistry, MacroDef } from './lib/registry';
import { executeMacro } from './lib/pipeline';
import { loadPatterns, PatternRegistry, RegisteredPattern } from './lib/patterns';
import { createDefaultGuardrailPipeline } from './autopilot/guardrails';
import { loadRootSpec, buildExpandedPlan } from './autopilot/plan';
import { runSingleIteration } from './autopilot/iteration';

const builtInMacros: MacroDef[] = [
  { id: 'selfDialogue', title: 'Self Dialogue', template: TEMPLATE_SELF_DIALOGUE },
  { id: 'critique', title: 'Critique Pass', template: TEMPLATE_CRITIQUE }
];
const registry = new MacroRegistry(builtInMacros);

async function loadUserMacros(workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined, includeBuiltIns: boolean, channel: vscode.OutputChannel) {
  if (!workspaceFolders || workspaceFolders.length === 0) {
    if (includeBuiltIns) registry.replaceAll(builtInMacros);
    return;
  }
  const root = workspaceFolders[0].uri; // single-root assumption for now
  const configFile = vscode.Uri.joinPath(root, '.copilot-macros.json');
  try {
    const stat = await vscode.workspace.fs.stat(configFile);
    if (stat) {
      const data = await vscode.workspace.fs.readFile(configFile);
      const text = new TextDecoder('utf-8').decode(data);
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        const valid: MacroDef[] = parsed.filter(m => m && typeof m.id === 'string' && typeof m.title === 'string' && typeof m.template === 'string');
        const combined = includeBuiltIns ? [...builtInMacros, ...valid] : valid;
        registry.replaceAll(combined);
        channel.appendLine(`[macros] Loaded ${valid.length} user macros (${combined.length} total).`);
        return;
      } else {
        channel.appendLine('[macros] Config file is not an array. Ignoring.');
      }
    }
  } catch (err: any) {
    channel.appendLine(`[macros] No user config or failed to load: ${err?.message || err}`);
  }
  if (includeBuiltIns) registry.replaceAll(builtInMacros);
}

class MacroTreeProvider implements vscode.TreeDataProvider<MacroDef> {
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  getTreeItem(element: MacroDef): vscode.TreeItem {
    const item = new vscode.TreeItem(element.title, vscode.TreeItemCollapsibleState.None);
    item.command = { command: `copilotMacros.${element.id}`, title: element.title };
    return item;
  }
  getChildren(): MacroDef[] { return registry.all(); }
  refresh() { this._onDidChangeTreeData.fire(); }
}

// Legacy helpers removed in favor of pipeline abstraction.

export function activate(context: vscode.ExtensionContext) {
  const treeProvider = new MacroTreeProvider();
  vscode.window.registerTreeDataProvider('copilotMacrosView', treeProvider);

  // Status bar item
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBar.name = 'Copilot Macro';
  const channel = vscode.window.createOutputChannel('Copilot Macros');

  function updateStatusBar() {
    const cfg = vscode.workspace.getConfiguration();
    const show = cfg.get<boolean>('copilotMacros.showStatusBar', true);
    if (!show) { statusBar.hide(); return; }
    const macroId = cfg.get<string>('copilotMacros.statusBarMacro', 'selfDialogue');
    const macro = registry.get(macroId) || registry.all()[0];
    statusBar.text = `$(comment-discussion) ${macro.title}`;
    statusBar.command = `copilotMacros.${macro.id}`;
    statusBar.show();
  }

  updateStatusBar();
  const cfg = vscode.workspace.getConfiguration();
  loadUserMacros(vscode.workspace.workspaceFolders, cfg.get('copilotMacros.includeBuiltIns', true), channel).then(() => treeProvider.refresh());
  context.subscriptions.push(statusBar);
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('copilotMacros.showStatusBar') || e.affectsConfiguration('copilotMacros.statusBarMacro')) {
      updateStatusBar();
    }
  }));

  function getRunOptions() {
    const cfg = vscode.workspace.getConfiguration();
    return {
      warnLines: cfg.get<number>('copilotMacros.largeSelectionWarningLines', 400),
      debug: cfg.get<boolean>('copilotMacros.debug', false),
      channel
    };
  }

  function runById(id: string) {
    const macro = registry.get(id);
    if (!macro) {
      vscode.window.showErrorMessage(`Macro not found: ${id}`);
      return;
    }
    executeMacro(macro, getRunOptions());
  }

  const patternRegistry = new PatternRegistry();
  let cachedPatterns: RegisteredPattern[] = [];
  async function refreshPatterns(initial = false) {
    cachedPatterns = await loadPatterns(vscode.workspace.workspaceFolders, channel);
    patternRegistry.replaceAll(cachedPatterns);
    if (initial) channel.appendLine(`[patterns] Activated with ${cachedPatterns.length} pattern(s).`);
  }
  // Initial pattern load (non-blocking)
  refreshPatterns(true);

  const guardrailPipeline = createDefaultGuardrailPipeline();
  let expandedPlan: import('./autopilot/plan').ExpandedPlan | null = null;

  context.subscriptions.push(
    vscode.commands.registerCommand('copilotMacros.selfDialogue', () => runById('selfDialogue')),
    vscode.commands.registerCommand('copilotMacros.critique', () => runById('critique')),
    vscode.commands.registerCommand('copilotMacros.cycleStatusBarMacro', () => {
      const cfg = vscode.workspace.getConfiguration();
      const all = registry.all();
      const currentId = cfg.get<string>('copilotMacros.statusBarMacro', all[0].id);
      const idx = all.findIndex(m => m.id === currentId);
      const next = all[(idx + 1) % all.length];
      cfg.update('copilotMacros.statusBarMacro', next.id, vscode.ConfigurationTarget.Global);
      updateStatusBar();
      vscode.window.showInformationMessage(`Status bar macro: ${next.title}`);
    }),
    vscode.commands.registerCommand('copilotMacros.pickMacro', async () => {
      const pick = await vscode.window.showQuickPick(registry.all().map(m => ({ label: m.title, description: m.id })), { placeHolder: 'Select a Copilot macro to run' });
      if (!pick) { return; }
      runById(pick.description!);
    }),
    vscode.commands.registerCommand('copilotMacros.previewPrompt', async () => {
      const pick = await vscode.window.showQuickPick(registry.all().map(m => ({ label: m.title, description: m.id })), { placeHolder: 'Select a macro to preview' });
      if (!pick) { return; }
      const macro = registry.get(pick.description!);
      if (!macro) { return; }
      // Reproduce executeMacro assembly, but show virtual doc instead of copying
      const editor = vscode.window.activeTextEditor;
      let contextText = 'No active editor';
      if (editor) {
        const sel = editor.selection;
        if (sel && !sel.isEmpty) {
          contextText = editor.document.getText(sel);
        } else {
          contextText = `File: ${editor.document.fileName}`;
        }
      }
      const prompt = interpolate(macro.template, { context: contextText });
      const doc = await vscode.workspace.openTextDocument({ content: prompt, language: 'markdown' });
      await vscode.window.showTextDocument(doc, { preview: true });
    }),
    vscode.commands.registerCommand('copilotMacros.reloadMacros', async () => {
      const cfg = vscode.workspace.getConfiguration();
      await loadUserMacros(vscode.workspace.workspaceFolders, cfg.get('copilotMacros.includeBuiltIns', true), channel);
      treeProvider.refresh();
      updateStatusBar();
      vscode.window.showInformationMessage('Copilot macros reloaded.');
    }),
    vscode.commands.registerCommand('autopilot.patterns.list', async () => {
      await refreshPatterns();
      if (cachedPatterns.length === 0) { vscode.window.showInformationMessage('No patterns loaded.'); return; }
      const lines = cachedPatterns.map(p => `${p.pattern} (priority=${p.priority}, hash=${p.patternHash.slice(0,8)}, source=${p.source})`);
      channel.appendLine('[patterns] List:\n' + lines.join('\n'));
      vscode.window.showInformationMessage(`${cachedPatterns.length} pattern(s) listed in OutputChannel.`);
    }),
    vscode.commands.registerCommand('autopilot.patterns.validate', async () => {
      await refreshPatterns();
      const errs = cachedPatterns.filter(p => !p.patternHash); // placeholder check
      if (errs.length) {
        vscode.window.showErrorMessage(`Pattern validation failed for ${errs.length} pattern(s). See OutputChannel.`);
      } else {
        vscode.window.showInformationMessage(`Pattern validation passed (${cachedPatterns.length}).`);
      }
    }),
    vscode.commands.registerCommand('autopilot.guardrails.dryRun', async () => {
      const results = await guardrailPipeline.run({}, channel);
      const worst = results.find(r => r.status === 'fail') || results.find(r => r.status === 'warn') || results[results.length-1];
      vscode.window.showInformationMessage(`Guardrail dry run: ${worst?.status || 'ok'} (${results.length} stages)`);
    }),
    vscode.commands.registerCommand('autopilot.plan.expand', async () => {
      const { spec, digest } = await loadRootSpec(vscode.workspace.workspaceFolders);
      if (!spec || !digest) { vscode.window.showErrorMessage('No root spec found at autopilot/plan/rootspec.json'); return; }
      await refreshPatterns();
      expandedPlan = buildExpandedPlan(spec, digest, cachedPatterns);
      channel.appendLine(`[plan] Expanded ${expandedPlan.tasks.length} task(s) from root digest ${digest.slice(0,8)}`);
      vscode.window.showInformationMessage(`Plan expanded: ${expandedPlan.tasks.length} tasks.`);
    }),
    vscode.commands.registerCommand('autopilot.iteration.runOnce', async () => {
      if (!expandedPlan) { vscode.window.showErrorMessage('Expand plan first.'); return; }
      const res = await runSingleIteration(expandedPlan, channel);
      vscode.window.showInformationMessage(`Iteration: ${res.status}${res.task ? ' task=' + res.task.id : ''}`);
    })
  );
  context.subscriptions.push(channel);
}

export function deactivate() {}
