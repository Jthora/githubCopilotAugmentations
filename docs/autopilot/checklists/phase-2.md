# Phase 2 Checklist (Single Iteration Engine)

Goal: Run exactly one deterministic iteration selecting a task and simulating scaffold (no destructive edits yet by default).

Item | Done | Notes
---- | ---- | -----
Accept ADR-002 (guardrail philosophy) |  | 
Scaffold iteration state machine types |  | 
Select task ordering function (priority -> hash tie-break) |  | 
Implement guardrail pipeline wiring (no-op stages) | ✅ | `guardrails.ts`
Add dry run command for guardrails | ✅ | `autopilot.guardrails.dryRun`
Implement basic task status transitions (pending->in_progress->validated) |  | 
Add logging for iteration result (hot + warm tiers stub) |  | 
Create JSONL writer utility |  | 
Unit tests: pipeline short-circuit on fail |  | 
Unit tests: ordering stability given seed |  | 
Update reproducibility doc with iteration hash chain |  | 
Risk matrix: add iteration failure / guardrail false pos/neg entries |  | 

Exit Criteria:
- Single iteration command logs stages & statuses
- Guardrail pipeline runs deterministic ordered stages
- Re-run with same inputs yields identical ordering & hash chain
