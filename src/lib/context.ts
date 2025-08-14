import * as vscode from 'vscode';

export interface CollectedContext {
  text: string;
  origin: 'selection' | 'filename' | 'none';
  lineCount: number;
}

export function collectContext(): CollectedContext {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return { text: 'No active editor', origin: 'none', lineCount: 0 };
  }
  const sel = editor.selection;
  if (sel && !sel.isEmpty) {
    const text = editor.document.getText(sel);
    return { text, origin: 'selection', lineCount: text.split(/\r?\n/).length };
  }
  const fileName = `File: ${editor.document.fileName}`;
  return { text: fileName, origin: 'filename', lineCount: 1 };
}
