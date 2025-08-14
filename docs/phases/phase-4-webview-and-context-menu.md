# Phase 4 – Webview Form & Enhanced Context Menu

## Objective
Provide a richer UI for constructing prompts with toggleable sections and integrate more deeply with context interactions.

## Scope (In)
- Webview panel: macro selection + dynamic options (checkboxes, sliders, text inputs)
- Enhanced context menu: sub-menu grouping macros
- Optional CodeLens for top-of-file access (behind setting)

## Out of Scope
- Summarization / truncation (Phase 5)
- Multi-file smart context assembly (Phase 6)

## Webview Features
| Feature | Description |
|---------|-------------|
| Macro Selector | Dropdown of macro ids |
| Live Preview | Rendered template with current tokens |
| Options Panel | Toggle sections (e.g., include edge case checklist) |
| Insert Button | Executes same pipeline (assemble → clipboard → open chat) |

## Messaging Flow
Extension <-> Webview via `postMessage` events: update selection, request preview, apply macro.

## Settings
| Setting | Default | Description |
|---------|---------|-------------|
| `copilotMacros.enableWebview` | true | Master toggle |
| `copilotMacros.enableCodeLens` | false | Show CodeLens entries |

## Tasks
1. Implement command `copilotMacros.openMacroBuilder`
2. Create webview HTML/JS bundle (lightweight, no framework or use vanilla + small helper)
3. Wire postMessage handlers (load macros, update preview)
4. Add context menu sub-menu `Copilot Macros > <macro>`
5. Add optional CodeLens provider
6. Update docs & screenshots

## Edge Cases
| Case | Handling |
|------|----------|
| Too large selection for preview | Show truncated preview with notice |
| Webview disposed | Clean listeners |

## Security Considerations
- No remote script loads
- CSP: inline scripts avoided (or hashed) |

## Performance Notes
Macros small; simple string interpolation—should remain instant.
