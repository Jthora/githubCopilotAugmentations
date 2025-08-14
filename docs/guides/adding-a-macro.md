# Guide: Adding a Macro (Future Config System)

Until Phase 3 (configurable macros) ships, macros are code-defined. Afterward, use the JSON config.

## Steps (Config-Based)
1. Open `.copilot-macros.json` (create if absent).
2. Add new entry under `macros` array:
```json
{
  "id": "edgeCaseReview",
  "title": "Edge Case Review",
  "template": "List potential edge cases for the following context, grouped by category.\nContext:\n{{context}}"
}
```
3. Save file. If `autoReloadConfig` enabled the macro appears automatically; otherwise run `Copilot Macros: Reload Config` command.
4. Bind a key (optional) via `Preferences: Open Keyboard Shortcuts` searching for the macro command id (`copilotMacros.edgeCaseReview`).

## Naming Tips
- Use camelCase ids; keep under 30 chars.
- Title is what appears in UI surfaces.
- Keep templates concise; model can expand structure.

## Token Reference
See `docs/specs/template-engine.md` for supported tokens.

## Testing Your Macro
Select a representative code block, invoke the macro, paste into Copilot Chat, confirm formatting is respected.

## Debugging
- If macro missing: check for JSON parse errors.
- If template not substituting: verify token names exactly.
