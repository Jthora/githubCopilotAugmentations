# Spec: Macro Registry

## Purpose
Central source of truth for available macros (built-in + user-defined) with lookup, validation, and change events.

## Responsibilities
- Store macro metadata `{ id, title, template, options }`
- Merge user config over built-ins
- Emit onDidChange event for UI consumers (tree view, status bar)
- Provide safe fallback when user config invalid

## Data Model
```ts
interface Macro {
  id: string;
  title: string;
  template: string;
  options?: {
    truncate?: boolean;
    summarize?: boolean;
  };
}
```

## API (Proposed)
```ts
class MacroRegistry {
  getAll(): Macro[];
  get(id: string): Macro | undefined;
  setUserMacros(macros: Macro[]): void; // triggers merge & event
  onDidChange(listener: () => void): Disposable;
}
```

## Merge Rules
- Start with built-ins
- For each user macro: if id exists, replace; else add
- Validate each macro; invalid ones skipped with warning

## Validation
| Rule | Action |
|------|--------|
| Missing id/title/template | Skip |
| Id length > 50 | Skip |
| Template length > 50k chars | Warn + allow (Phase 5 may restrict) |

## Events
Single change event after batch updates (debounced 100ms) to avoid UI thrash.

## Testing Notes
- Test override behavior
- Test invalid macro filtered
- Test event emission count (1 per batch)
