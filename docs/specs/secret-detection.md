# Spec: Secret Detection

## Purpose
Prevent accidental inclusion of credential material in prompts.

## Strategy
Heuristic regex scanning + entropy checks (Phase 5). Conservative: prefer false positives over false negatives.

## Regex Set (Initial)
| Name | Pattern (simplified) |
|------|----------------------|
| AWS Access Key | `AKIA[0-9A-Z]{16}` |
| AWS Secret Key | `(?:AWS|aws)?['\"][0-9a-zA-Z/+]{40}['\"]` (broad) |
| Private Key Header | `-----BEGIN (?:RSA|EC|DSA|OPENSSH) PRIVATE KEY-----` |
| Generic Token | `(?<![A-Za-z0-9])[A-Za-z0-9_-]{32,}(?![A-Za-z0-9])` |

## Entropy Heuristic
- Sliding window (length 20) Shannon entropy threshold > 4.0 triggers suspicion (optional; avoid heavy false positives initially).

## API Sketch
```ts
interface SecretScanResult {
  matches: { name: string; index: number; match: string }[];
  entropyFlag: boolean;
}

function scanForSecrets(text: string, settings): SecretScanResult;
```

## Actions
- If matches found: show warning message with count & types.
- If `forceOverride` disabled: abort macro.
- Else allow rerun with `force: true` flag.

## Logging
If telemetry enabled, log only counts & types (not raw matches).

## Future
- User-provided custom patterns in config
- Hashing matches before logging (privacy)
