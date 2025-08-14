# FAQ (Draft)

Q: Why no external LLMs?  
A: Design constraint for local determinism, privacy, and reproducibility.

Q: How does it "reason" without a model?  
A: It applies rule-based patterns and structural heuristics; summaries are mechanical.

Q: What if I need to change the spec mid-run?  
A: Modify rootspec.yaml → run Acknowledge Spec Change → re-expand plan.

Q: Why did Autopilot pause?  
A: Check timeline.log; most likely risk threshold exceeded or spec signature mismatch.

Q: Can I add my own patterns?  
A: Yes—drop YAML into patterns/ and run Expand Plan (after doc stable).

Q: How do I rollback a bad iteration?  
A: Use git revert on the iteration commit or reset the autopilot branch; patch diff archived.

Q: Will it delete files automatically?  
A: File deletions count toward deletionPercent; large deletions trigger pause.
