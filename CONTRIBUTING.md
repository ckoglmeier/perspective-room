# Contributing

Perspective Room Standard is the open format for AI-native fundraising bundles.

Contributions should keep the standard useful for founders, investors, and agents.

## Contribution Rules

- Schema changes need tests.
- Schema changes need at least one example update when behavior changes.
- Breaking changes require a new schema version.
- New trust states should explain how investors and agents should treat them.
- New fields should be optional unless the bundle cannot work without them.
- Public docs should describe current behavior, not roadmap plans.

## Local Verification

```bash
npm install
npm run verify
```

## Pull Request Checklist

- Tests pass.
- Examples validate.
- Generated bundle files still include `room.json`, `materials.json`, `agent.md`, and `index.html`.
- No private Perspective app references or local file paths are introduced.
- README and docs stay focused on the public standard.
