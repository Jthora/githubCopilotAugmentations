# How-To: Recover / Rollback

Scenario | Action Steps | Notes
-------- | ------------ | -----
High-risk patch paused | Inspect `patches/pending/<iter>.diff` → approve or discard | Use approval command (future)
Accidental destructive change applied | Use git log to find iter commit → `git revert` or reset branch | Ensure patch archived
Spec changed mid-run | Acknowledge signature mismatch → re-expand plan | Blocks further iterations until done
Corrupted logs | Verify hash chain; restore from last good commit | Consider increasing commitEvery frequency
Excessive orphan tasks | Run reconciliation diagnostic (future) | Adjust patterns / uniqueness keys

Proactive: Tag stable milestone commits (`git tag autopilot-milestone-<n>`).
