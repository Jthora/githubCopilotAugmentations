# Guide: Prompt Template Design

## Goals
Create reusable, terse templates that encourage structured, high-signal responses without over-constraining the model.

## Principles
- Lead with action ("Act as", "Perform", "Enumerate").
- Specify output structure (numbered list, table headings) sparingly.
- Provide context label before raw code (`Context:`) to orient the model.
- Avoid overlong preambles—model learns patterns quickly.

## Anatomy of a Good Template
```
Act as a senior reviewer. Provide:
1. Summary
2. Risks
3. Edge Cases
4. Suggested Refactors
5. Tests to Add

Context:
{{context}}
```

## Common Sections
| Name | Purpose |
|------|---------|
| Summary | Forces model to internalize content before critique |
| Risks | Surfaces potential failure modes |
| Edge Cases | Encourages enumerating boundaries |
| Refactors | Actionable improvements |
| Tests | Immediately translatable into code coverage |

## Token Usage
Prefer `{{context}}` for basic macros; use `{{selection}}` only when you require that the selection *must* be present (to detect empty case).

## Anti-Patterns
| Pattern | Issue |
|---------|-------|
| Wall of instructions > 300 words | Token waste; risk of model ignoring tail |
| Repeating the same directive | Redundant; may skew probability mass |
| Embedding secrets / proprietary data | Security risk |

## Iterating
1. Draft template.
2. Run on varied selections (small, large, different languages).
3. Collect response issues (missing section? hallucinated details?).
4. Adjust ordering & specificity.

## Measuring Effectiveness
Track (manually or via future telemetry):
- Average time to paste & send
- Need for follow-up clarifications
- Response completeness vs. template sections

## Versioning Templates
Include a comment line with version if stability matters (e.g., `# v1`). Update docs when changed.
