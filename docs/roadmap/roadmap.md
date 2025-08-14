# Roadmap

## Vision
Turn repeated high-value Copilot prompting patterns into streamlined, configurable, and safe automations.

## Milestones
| Milestone | Description | Target |
|-----------|-------------|--------|
| Phase 1 | Core commands & keybindings | Short-term |
| Phase 2 | UI surfaces (sidebar, status bar, context) | Short-term |
| Phase 3 | Configurable macros via JSON | Medium |
| Phase 4 | Webview macro builder | Medium |
| Phase 5 | Guardrails & summarization | Medium |
| Phase 6 | Advanced context assembly | Long |

## Stretch Goals
- Multi-file diff inclusion
- Issue / PR metadata fetching
- Test skeleton generation
- Pluggable summarizers

## Risk Register (Snapshot)
| Risk | Impact | Mitigation |
|------|--------|------------|
| Copilot internal command changes | Medium | Feature flag; graceful fallback |
| Feature creep early | Medium | Phase gating & scope discipline |
| False positives in secret scan | Low | Allow override run |

## Decision Log (To Start)
Maintain a lightweight log of key design decisions under `docs/architecture/decisions/` (TBD).

## Improvement Opportunities (Phase 1–2 Foundations)
Prioritized enhancements building atop implemented features.

### 1. Quick Wins
| Item | Benefit | Effort |
|------|---------|--------|
| Rich clipboard toast (include line count) | User awareness of context size | S |
| OutputChannel logging | Debuggability, future telemetry prep | S |
| Rename/repurpose `enableSidebar` to `enableActivityBar` | Consistency | XS |
| Hover tooltips for macros | Discoverability | XS |
| Status bar macro cycle command | Faster macro switching | S |

### 2. UX & Discoverability
| Item | Benefit | Effort |
|------|---------|--------|
| QuickPick macro switch (Alt+Click) | Rapid context change | M |
| Submenu for context menu entries | Less clutter | S |
| Prompt preview command | Safe review before paste | M |

### 3. Architecture & Maintainability
| Item | Benefit | Effort |
|------|---------|--------|
| Context collector module | Easier guardrail insertion | S |
| Execution pipeline abstraction | Pluggable phases (truncate, scan) | M |
| Typed settings accessor | Fewer config lookups & typos | S |
| Registry change events | Hot reload readiness | S |

### 4. Testing & Reliability
| Item | Benefit | Effort |
|------|---------|--------|
| No-editor integration test | Stability assurance | XS |
| Rapid invoke race test | Clipboard determinism | S |
| Template snapshot hash test | Detect accidental drift | S |

### 5. Pre-Guardrail Prep (Phase 5 Alignment)
| Item | Benefit | Effort |
|------|---------|--------|
| Large selection soft warning | Prevent token waste early | S |
| Secret pattern placeholder redaction (optional) | Early safety | M |
| Central constants file | Single source for limits | XS |

### 6. Developer Experience
| Item | Benefit | Effort |
|------|---------|--------|
| CONTRIBUTING.md | Easier onboarding | XS |
| GitHub Actions CI (lint + tests) | Prevent regressions | S |
| Package verification script | Catch manifest issues | XS |

### 7. Observability & Debug
| Item | Benefit | Effort |
|------|---------|--------|
| Debug mode setting | Controlled verbosity | XS |
| Execution timing log | Performance baseline | XS |

Legend: XS=Very Low, S=Low, M=Moderate, L=High

### Suggested Order of Implementation
1. Context collector + output logging
2. Large selection warning + snapshot tests
3. Status bar cycle & QuickPick switching
4. Prompt preview command
5. Execution pipeline abstraction
6. Pre-guardrail redaction & constants
7. CI workflow & CONTRIBUTING

## Exit Criteria per Phase
Defined in each phase doc; all must meet success criteria + README updates.
