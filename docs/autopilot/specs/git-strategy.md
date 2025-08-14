# Git Strategy (Draft)
Status: Draft (Phase 3)

## Goals
- Safe incremental commits
- Easy rollback
- Noise reduction in main history

## Default Approach
- Working branch: `autopilot/work` (recreated or updated per session)
- Checkpoint commit after each successful iteration (configurable via commitEvery)
- Merge (squash) into feature branch or main after review.

## Commit Message Template
`chore(autopilot): iter <n> task=<taskId> lines=<diffLines> risk=<score>`

## Rollback
- Use `git revert` on offending iteration commit(s) or reset the autopilot branch without touching main.

## Protected Refs
- Prevent autopilot from force-pushing main by gating commands to specified ref pattern `autopilot/*`.

## Pre-Commit Hooks
- Hooks may modify diffs post guardrail evaluation; mitigation: run hooks in sandbox before scoring OR disable for autopilot branch.

## Large Refactors
- If diff lines > threshold but legitimate (formatter), instruct user to run manually outside autopilot to avoid repeated pauses.

## Open Questions
- Automatic rebase of work branch onto updated main? (Future) 
- Tagging milestones (e.g., every 25 iterations) for archival? (Maybe)
