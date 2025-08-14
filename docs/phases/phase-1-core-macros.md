# Phase 1 – Core Macros & Keybindings

## Objective
Ship a minimal VS Code extension that eliminates repetitive manual prompt typing for the two highest-value meta-prompts.

## Scope (In)
- Extension scaffold (package.json, activation events, extension.ts)
- Two commands: Self Dialogue, Critique Pass
- Keybindings (configurable) and Command Palette entries
- Clipboard staging of assembled prompt
- Open Copilot Chat panel automatically
- Basic selection collection (or fallback to file name)
- Minimal README update with usage (already partially drafted)

## Scope (Out)
- Sidebar view, status bar, config files, truncation, summarization
- JSON-driven macro definitions
- Telemetry, secret scanning

## Success Criteria
- Commands appear via Command Palette
- Pressing bound key with a selection copies expected prompt to clipboard and opens Copilot panel
- No activation until a macro is invoked (lazy activation)

## Prompt Templates (Initial)
### Self Dialogue
```
Talk to yourself about it. Q&A. Dialog.
Format:
Thought:
Question:
Answer:
Next:

Context:
{{selectionOrFile}}
```
### Critique Pass
```
Act as a senior reviewer. Provide:
1. Summary
2. Risks
3. Edge Cases
4. Suggested Refactors (bullets)
5. Tests to add

Context:
{{selectionOrFile}}
```

## Technical Tasks
1. Scaffold extension structure
2. Implement command registration
3. Implement context collector helper
4. Implement template interpolation function
5. Implement runMacro helper (assemble → clipboard → open panel → info message)
6. Add keybindings
7. Add licensing header (MIT)
8. Update README usage section

## Edge Cases & Handling
| Case | Handling |
|------|----------|
| No active editor | Use placeholder text `No active editor` or show warning |
| Empty selection | Use file name as context |
| Very large file (>10k lines) | Still allow (phase 1) – defer truncation |

## Estimated Effort
~1 hour initial implementation + review.

## Follow-Up Next Phase Triggers
If number of frequently-used prompts > 3 or desire for visual palette → proceed to Phase 2.
