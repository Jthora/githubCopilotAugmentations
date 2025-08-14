# GitHub Copilot Augmentations

> Practical automation patterns, extension scaffolds, and macro workflows to reduce friction when using GitHub Copilot inside VS Code.

## Spirit & Purpose
This repository is a living laboratory for *augmenting* (not replacing) GitHub Copilot. The aim is to remove repetitive prompting rituals, encode high‑leverage “meta‑prompts” as reusable macros, and create ergonomic UI surfaces (commands, keybindings, sidebar views, status bar items) that let you operate Copilot at a higher level of abstraction.

Guiding principles:
- **Friction ↓**: Every repeated manual step should become a command or macro.
- **Leverage ↑**: Promote structured prompts (dialogue, critique, review) to first‑class reusable assets.
- **Composability**: Keep pieces small (commands, config, prompt templates) so they can be remixed.
- **Safety & Clarity**: No hidden data exfiltration. Make context packaging explicit, truncate responsibly.
- **Progressive Enhancement**: Start with simple keybindings → grow toward configurable macro engine and richer UI only if justified.

## Initial Focus
Phase 1 will ship a minimal VS Code extension providing:
- A couple of core macro commands (e.g. Self Dialogue, Critique Pass)
- Keybindings for instant access
- Automatic prompt assembly from current selection or file metadata
- Clipboard staging + opening Copilot Chat panel

Subsequent phases (documented under `docs/`) explore: sidebar palette, status bar buttons, config‑driven macros, webview form, context summarization, and guardrails.

## Repository Structure
```
README.md
LICENSE
/docs
  /architecture        # High‑level diagrams & extension layering concepts
  /phases              # Phase breakdowns with objectives & acceptance criteria
  /specs               # Detailed feature specifications (macro engine, truncation, etc.)
  /guides              # How‑to docs (adding a macro, binding keys, extending views)
  /research            # Notes on Copilot capabilities & limitations, API exploration
  /roadmap             # Forward-looking roadmap & release planning
```

## Key Concepts
| Concept | Description |
|---------|-------------|
| Macro | A predefined prompt template + context assembly strategy triggered by a command. |
| Surface | A UI entry point (command palette, keybinding, status bar item, sidebar view). |
| Guardrail | Logic to prevent problematic behavior (oversized context, binary files, secrets). |
| Prompt Template | Parameterizable text with placeholders for selection, file name, etc. |

## Improvement Opportunities (Snapshot)
See detailed table in `docs/roadmap/roadmap.md`.

Recently implemented improvements:
- Context collector & execution pipeline abstraction
- OutputChannel + debug logging flag (`copilotMacros.debug`)
- Large-selection soft warning (configurable threshold)
- Status bar macro cycling command & QuickPick macro picker
- Prompt preview command (opens assembled prompt as Markdown)

Still planned:
- Template snapshot tests
- Config-driven custom macros file
- Guardrails (secret/binary detection, length truncation)

## Planned Phases (Short Form)
1. Core Macros & Keybindings
2. Sidebar Macro Palette + Status Bar Shortcut
3. Configurable Macro Definitions (`.copilot-macros.json`)
4. Webview Form (parameter toggles) & Context Menu integration
5. Summarization / Truncation & Advanced Guardrails
6. Optional: Multi-file prompt assembly & test generation helpers

Full detail in `docs/phases/`.

## Getting Started
Extension now includes Phase 1 + Phase 2 surfaces.

### Install & Run in Development
1. Install dependencies (first time):
  - `npm install`
2. Launch Extension Development Host:
  - Press `F5` (Debug: Start Debugging)
3. In the new VS Code window, open any file and select code (optional).
4. Run a macro:
  - Command Palette: `Copilot: Self Dialogue` or `Copilot: Critique Pass`
  - Or press the default keybindings:
    - Self Dialogue: `Cmd+Alt+D` (macOS) / `Ctrl+Alt+D` (Win/Linux)
    - Critique Pass: `Cmd+Alt+C` / `Ctrl+Alt+C`
5. Copied prompt → Copilot Chat panel opens → paste (`Cmd+V`) and send.

### How It Works (Phase 1 Mechanics)
- Collects current selection (or falls back to file name only)
- Interpolates into a static template
- Places result on clipboard
- Attempts to open Copilot Chat (`github.copilot.openPanel`)
- Displays an info toast

### Phase 2 Additions
- Activity Bar (left) view container "Copilot Macros" listing built-in macros
- Status bar button (left) for quick macro (defaults to Self Dialogue)
- Editor context menu items (selection-sensitive for Self Dialogue)
- Settings to toggle these surfaces & choose status bar macro

### Settings
| Setting | Default | Description |
|---------|---------|-------------|
| `copilotMacros.showStatusBar` | true | Show/hide status bar macro button |
| `copilotMacros.statusBarMacro` | selfDialogue | Macro id bound to status bar |
| `copilotMacros.enableSidebar` | true | (Reserved) Toggle future sidebar usage (currently activity bar view always shows if enabled) |
| `copilotMacros.enableContextMenu` | true | Enable editor context menu entries |
| `copilotMacros.largeSelectionWarningLines` | 400 | Warn if selection exceeds this many lines |
| `copilotMacros.debug` | false | Verbose debug logging to OutputChannel |

### Current Design Constraints
- No auto-send (awaiting stable API)
- No truncation / secret scan (planned Phase 5)
- Macros fixed (config coming Phase 3)

## Contributing
- Open issues for new macro ideas with a clear “why” and example raw prompt.
- Prefer incremental, reversible changes.
- Include docs updates for any new concept.

## License
MIT (see `LICENSE`).

---
*This repository grows by turning everyday Copilot friction into shareable automation.*
