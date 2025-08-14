import * as vscode from 'vscode';
import { TEMPLATE_SELF_DIALOGUE, TEMPLATE_CRITIQUE, interpolate } from './lib/prompt';
import { MacroRegistry, MacroDef } from './lib/registry';
import { executeMacro } from './lib/pipeline';

const registry = new MacroRegistry([
  { id: 'selfDialogue', title: 'Self Dialogue', template: TEMPLATE_SELF_DIALOGUE },
  { id: 'critique', title: 'Critique Pass', template: TEMPLATE_CRITIQUE }
]);

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
    })
  );
  context.subscriptions.push(channel);
}

export function deactivate() {}
