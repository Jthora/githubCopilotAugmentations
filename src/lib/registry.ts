export interface MacroDef { id: string; title: string; template: string; }

export class MacroRegistry {
  private macros: MacroDef[] = [];
  constructor(initial: MacroDef[]) { this.macros = [...initial]; }
  all(): MacroDef[] { return this.macros; }
  get(id: string): MacroDef | undefined { return this.macros.find(m => m.id === id); }
  replaceAll(macros: MacroDef[]) { this.macros = [...macros]; }
}
