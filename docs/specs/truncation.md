# Spec: Truncation Utility

## Goal
Prevent oversized prompts while preserving salient code edges.

## Inputs
- Raw selection text
- Settings: `maxSelectionLines`, `maxSelectionChars`

## Algorithm
1. If `text.length <= maxSelectionChars` AND `lineCount <= maxSelectionLines` → return as-is.
2. Split into lines.
3. Compute headCount = floor(limitLines / 2), tailCount = limitLines - headCount.
4. Take first `headCount` and last `tailCount` lines.
5. Join with marker line: `...<TRUNCATED {omitted} lines omitted>...`
6. If char length still exceeds limitChars, hard truncate tail portion and append `...<CHAR TRUNCATED>`.

## Output
Truncated string + metadata `{ originalLines, keptLines, truncated }`.

## Edge Cases
| Case | Handling |
|------|----------|
| Single very long line | Hard char truncate at limitChars |
| Limit extremely small (<20) | Ensure at least 3 head + 3 tail lines if possible |

## Marker Style
Monospace safe, all caps for visibility, no markdown emphasis to avoid model mis-weighting.
