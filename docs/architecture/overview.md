# Architecture Overview

The project will evolve from a minimal command set into a modular macro engine. Each layer adds capability while preserving backward compatibility.

## Layered Model
1. Core Commands: Hard-coded prompt templates.
2. UI Surfaces: Secondary sidebar view, status bar, context menu, CodeLens.
3. Configurable Macros: External JSON defines templates + options.
4. Processing Pipeline: Selection capture → sanitization → truncation → template interpolation → clipboard or (future) direct chat prefill.
5. Guardrails & Enhancements: Summarization, secret filters, size thresholds, telemetry opt-in.

## Data Flow
```
[User Action] -> [Command] -> [Context Collector]
                -> [Sanitizer/Truncator] -> [Template Engine]
                -> [Prompt Output]
                -> (Clipboard | Prefill API when available) -> Copilot Chat UI
```

## Components
- Command Handlers: glue logic only.
- Context Collector: derives selection text, file name, language id, line counts.
- Sanitizer: strips leading/trailing whitespace, collapses >2 blank lines.
- Truncator: enforces line/character budgets, inserts marker.
- Template Engine: simple token replacement (`{{selection}}`, `{{fileName}}`, `{{language}}`).
- Macro Registry: loads built-ins + user config (later phases).
- View Providers: TreeDataProvider for macro palette; optional Webview for advanced form.

## Extension Activation
Lazy: activate on first macro command OR view expansion (`onCommand:` + `onView:` events). Avoid global activation to keep startup light.

## Configuration (Phase 3+)
`copilotMacros.configPath` (string, default `.copilot-macros.json`)
`copilotMacros.maxSelectionLines` (number, default 400)
`copilotMacros.telemetry.enabled` (boolean, default false)

## Telemetry Philosophy
Off by default. If enabled, only log macro id, selection size bucket, duration. No raw code content.

## Secret & Binary Guards (Phase 5)
- Heuristics: detect high ratio non-printable chars → abort.
- Regex blocklist for obvious secret patterns (AWS keys, private keys) with user override.
- If blocked, show warning & require explicit user re-run with `force` flag (future param).

## Future API Hook
If VS Code / Copilot exposes a stable prefill or programmatic chat send command, integrate as an optional pathway guarded by a feature flag. Until then, copy to clipboard and surface a toast instructing paste.

## Open Questions
- Do we want multi-file context packaging (concatenate selection + related test file)? (Phase 6 maybe.)
- Should summarization call Copilot or a local model? (Token cost vs. accuracy.)

## Non-Goals (For Now)
- Full conversational session management outside Copilot Chat.
- Storing or replaying Copilot responses.
- Reverse engineering private APIs.
