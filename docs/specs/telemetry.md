# Spec: Telemetry (Opt-In)

## Philosophy
Minimal, anonymous, user-controlled. Provide insight into macro usefulness without collecting code.

## Data Points
| Field | Type | Notes |
|-------|------|-------|
| macroId | string | Which macro executed |
| selectionLines | number | Raw line count of selection |
| truncated | boolean | Whether truncation occurred |
| durationMs | number | Time from invoke → prompt ready |
| timestamp | string | ISO 8601 |
| version | string | Extension version |

## Exclusions
- No raw code
- No file paths (only file extension optionally in future)

## Transport
- Phase 5 may implement: simple HTTPS POST to configurable endpoint (default none)
- If no endpoint configured, telemetry is a no-op.

## Settings
| Setting | Default | Description |
|---------|---------|-------------|
| `copilotMacros.telemetry.enabled` | false | Master toggle |
| `copilotMacros.telemetry.endpoint` | "" | URL to POST JSON payload |
| `copilotMacros.telemetry.batchSize` | 10 | Flush threshold |
| `copilotMacros.telemetry.flushIntervalMs` | 30000 | Periodic flush |

## Failure Handling
- Network errors silently ignored
- Queue capped (e.g., 200 records) – drop oldest on overflow

## API
```ts
interface TelemetryEvent { /* fields above */ }
class TelemetryBuffer {
  record(e: TelemetryEvent): void;
  flush(force?: boolean): Promise<void>;
  dispose(): void;
}
```

## Security
No secrets; user must actively enable.
