# How-To: Run Single Iteration

Prereq: Plan expanded (`expanded.json` exists) & config tuned.

1. Execute command: `Autopilot: Iterate Once`.
2. System selects next pending task.
3. Draft patch generated & validated.
4. Guardrails evaluated -> decision logged.
5. On proceed: patch committed (or staged if commitEvery > 1).
6. Memory/logs updated; task status advanced.

## Outputs to Inspect
- `.autopilot/logs/details/<iter>.json`
- `.autopilot/patches/applied/<iter>.diff`
- `timeline.log` last line

## Common Pause Reasons
Reason | Meaning | Action
------ | ------- | ------
RISK_THRESHOLD | Risk score >= threshold | Review diff; adjust config if acceptable
PROTECTED_TOUCH | Attempted protected path | Fix pattern or remove path from task scope
FAILURE_STREAK | Consecutive failures reached | Investigate failing tests or rules
