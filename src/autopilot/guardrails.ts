import * as vscode from 'vscode';

export interface GuardrailContext {
  notes?: string[]; // Future: planDigest, iteration metadata, proposed diff summary
}

export interface GuardrailResult {
  status: 'ok' | 'warn' | 'fail';
  metrics: Record<string, number>;
  messages: string[];
  stage: string;
}

export type GuardrailStage = (ctx: GuardrailContext) => Promise<GuardrailResult>;

export class GuardrailPipeline {
  private stages: { name: string; fn: GuardrailStage }[] = [];
  register(name: string, fn: GuardrailStage) { this.stages.push({ name, fn }); }
  list(): string[] { return this.stages.map(s => s.name); }
  async run(initial: GuardrailContext, channel: vscode.OutputChannel): Promise<GuardrailResult[]> {
    const results: GuardrailResult[] = [];
    for (const stage of this.stages) {
      const res = await stage.fn(initial);
      results.push(res);
      channel.appendLine(`[guardrails] ${stage.name}: ${res.status}`);
      if (res.status === 'fail') break; // short-circuit on failure
    }
    return results;
  }
}

export function createDefaultGuardrailPipeline(): GuardrailPipeline {
  const gp = new GuardrailPipeline();
  gp.register('inputValidation', async () => ({ status: 'ok', metrics: {}, messages: [], stage: 'inputValidation' }));
  gp.register('staticRisk', async () => ({ status: 'ok', metrics: { risk: 0 }, messages: ['risk score placeholder'], stage: 'staticRisk' }));
  gp.register('policyEvaluation', async () => ({ status: 'ok', metrics: {}, messages: [], stage: 'policyEvaluation' }));
  return gp;
}
