# Phase 2 – Sidebar Palette & Status Bar

## Objective
Introduce persistent UI surfaces for faster discovery and one-click macro execution.

## Additions vs Phase 1
- Secondary Sidebar container + tree view listing macros
- Status bar item for most-used macro (configurable)
- Optional context menu entry (editor selection)
- Basic configuration settings (enable/disable surfaces)

## Out of Scope
- JSON macro config (Phase 3)
- Webview form
- Truncation / summarization

## Success Criteria
- Sidebar shows macros and invokes Phase 1 logic
- Toggling settings hides/shows status bar & tree view dynamically

## Settings (proposed)
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `copilotMacros.showStatusBar` | boolean | true | Show status bar quick macro |
| `copilotMacros.statusBarMacro` | string | `selfDialogue` | Macro id assigned to status bar |
| `copilotMacros.enableSidebar` | boolean | true | Enable macro palette view |
| `copilotMacros.enableContextMenu` | boolean | true | Adds right-click option |

## Tasks
1. Implement TreeDataProvider using internal macro registry
2. Add view container & view contributions
3. Register status bar item created on activation respecting setting
4. Watch configuration changes to update UI
5. Add `menus` contribution for editor/context
6. Extend README with screenshots / usage

## Edge Cases
| Case | Handling |
|------|----------|
| User disables sidebar | Dispose TreeDataProvider & hide container |
| Macro id in statusBarMacro invalid | Fallback to first registered macro |

## Metrics (Optional Future)
Count macro invocations (if telemetry later enabled) – not in this phase.
