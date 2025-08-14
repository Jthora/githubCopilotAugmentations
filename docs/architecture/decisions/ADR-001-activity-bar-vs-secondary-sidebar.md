# ADR 001: Activity Bar vs Secondary Sidebar for Macro Palette
Date: 2025-08-13
Status: Accepted

## Context
Original concept used the secondary sidebar to host the macro palette. During implementation, schema validation issues arose with the `secondarySidebar` container in `package.json` (warnings / errors in tooling). Activity bar view containers are stable, well-documented, and familiar to users.

## Decision
Use an Activity Bar view container (`viewsContainers.activitybar`) named "Copilot Macros" for Phase 2 instead of the secondary sidebar.

## Consequences
- Positive: Stable API surface, predictable placement, fewer validation issues.
- Positive: Easy discoverability alongside existing icons.
- Negative: Consumes horizontal icon space; user cannot simultaneously see all other activity bar views on narrow screens.
- Neutral: We can reintroduce a secondary sidebar variant later behind a setting if stability improves.

## Alternatives Considered
1. Secondary Sidebar: Closer to original ask ("secondary sidebar") but current schema friction.
2. Webview Panel Only: Less persistent discoverability.
3. Status Bar Only: Limited affordance for multiple macros.

## Follow-Up
- If VS Code improves secondary sidebar container contributions with stable schema, consider optional migration back or dual-mode toggle.
