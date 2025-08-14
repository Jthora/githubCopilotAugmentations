# Research: Copilot Limitations & Considerations

## Current Constraints (Observed)
- No stable public API to programmatically send chat prompts & receive answers within extensions.
- Chat input prefill not officially supported; clipboard + user paste workaround required.
- Large prompts may be truncated internally; aim for concise, structured templates.
- Token limits vary by model; avoid sending entire large files unless necessary.

## Behavioral Notes
| Behavior | Observation |
|----------|------------|
| Overly broad critiques | Providing explicit sections improves focus |
| Hallucinated file references | Occurs if template hints at external context not supplied |
| Response verbosity | Model mirrors instruction verbosity closely |

## Prompt Optimization Levers
- Prepend reasoning style ("Think step by step") sparingly; overuse can add fluff.
- Structured numbered lists yield more consistent coverage.
- Asking for tests + edge cases drives deeper analysis than generic "improve this".

## Risks
- Copy/pasting proprietary code into a third-party service may violate policy; macro should make data inclusion intentional.
- Automated summarization (future) may drop critical nuances.

## Monitoring Ideas
- (Future) Compare response length & section coverage vs. template design iterations.

## Open Questions
- Will forthcoming Copilot APIs allow secure, direct invocation flows?
- How to gracefully degrade features if API surface changes?
