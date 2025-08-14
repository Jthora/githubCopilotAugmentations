# Phase 5 – Guardrails, Truncation & Summarization

## Objective
Improve safety, performance, and prompt quality when dealing with large or sensitive contexts.

## Features
| Feature | Description |
|---------|-------------|
| Truncation | Enforce max lines/characters from selection |
| Summarization (optional) | Generate a structured summary before template injection |
| Secret Heuristics | Detect likely credentials and abort |
| Binary/Noise Detection | Skip high non-printable ratio selections |
| Telemetry (opt-in) | Anonymous macro usage counts & size buckets |

## Truncation Strategy
- Settings: `maxSelectionLines` (default 400), `maxSelectionChars` (default 12000)
- Implementation: Keep first N/2 and last N/2 lines when exceeding limit; insert marker `...<TRUNCATED n lines omitted>...`

## Summarization Strategy
Optional command path: `selection -> summarizer macro -> condensed summary`.
- Provide internal “Summarize Selection” macro used by others.
- Keep original selection length check (if short, skip summarization).

## Secret Detection (Heuristics)
Regex examples (non-exhaustive):
- AWS Access Key: `AKIA[0-9A-Z]{16}`
- Private Key header: `-----BEGIN (?:RSA|EC|DSA|OPENSSH) PRIVATE KEY-----`
- Generic high-entropy token: base64-ish 40+ chars
If match → show warning, allow user to Force Run (setting / quick pick) but never automatic.

## Binary Detection
If >15% bytes are non-printable (outside 0x09,0x0A,0x0D,0x20-0x7E) treat as binary; abort.

## Telemetry Data Shape
```
{
  macroId: string,
  selectionLines: number,
  truncated: boolean,
  durationMs: number,
  timestamp: string
}
```
No code content captured.

## Settings
| Setting | Default | Description |
|---------|---------|-------------|
| `copilotMacros.maxSelectionLines` | 400 | Truncation line limit |
| `copilotMacros.maxSelectionChars` | 12000 | Truncation char limit |
| `copilotMacros.enableSummarization` | false | Toggle summarization stage |
| `copilotMacros.telemetry.enabled` | false | Opt-in anonymous telemetry |
| `copilotMacros.secretScan.enabled` | true | Enable secret heuristics |
| `copilotMacros.secretScan.forceOverride` | false | Allow bypass on warning |

## Tasks
1. Implement truncation helper
2. Implement secret detector utility
3. Implement binary detection
4. Integrate into pipeline behind settings
5. Add telemetry publisher (no-op if disabled)
6. Add tests (especially detector heuristics)
7. Documentation updates

## Edge Cases
| Case | Handling |
|------|----------|
| Selection just over limits | Slight head/tail preservation, clear marker |
| Multiple secret patterns | Aggregate count in warning |
| Telemetry send failure | Silently ignore |

## Future Considerations
- Pluggable detectors (regex config)
- Hash-based content fingerprinting (privacy-preserving caching)
