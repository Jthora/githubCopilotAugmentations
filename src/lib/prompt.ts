// Standalone prompt utilities (no vscode dependency) for testability.

export const TEMPLATE_SELF_DIALOGUE = `Talk to yourself about it. Q&A. Dialog.\nFormat:\nThought:\nQuestion:\nAnswer:\nNext:\n\nContext:\n{{context}}`;

export const TEMPLATE_CRITIQUE = `Act as a senior reviewer. Provide:\n1. Summary\n2. Risks\n3. Edge Cases\n4. Suggested Refactors (bullets)\n5. Tests to add\n\nContext:\n{{context}}`;

export function interpolate(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((acc, [key, val]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), val), template);
}
