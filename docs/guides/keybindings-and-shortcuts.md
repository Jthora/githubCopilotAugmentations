# Guide: Keybindings & Shortcuts

## Default Keybindings (Planned)
| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Self Dialogue | `Cmd+Alt+D` | `Ctrl+Alt+D` |
| Critique Pass | `Cmd+Alt+C` | `Ctrl+Alt+C` |

## Customizing
1. Open Keyboard Shortcuts (`Cmd+K Cmd+S`).
2. Search for `Copilot: Self Dialogue`.
3. Click the pencil icon, press your preferred keys, press Enter.

## Best Practices
- Avoid overriding core navigation (`Cmd+P`, `Cmd+Shift+P`).
- Use mnemonic letters (D for Dialogue, C for Critique).
- Keep combos under 3 keys.

## Advanced: Multi-Step Macros
You can chain other commands first (e.g., format selection) using a multi-command extension *or* future built-in chaining.

## Troubleshooting
| Issue | Fix |
|-------|-----|
| Keybinding unresponsive | Conflicts – check `When` clauses or run `Developer: Toggle Keyboard Shortcuts Troubleshooting` |
| Fires wrong macro | Ensure unique command id in config / no duplicates |
