# Launch Checklist

Use this checklist when making the repository public and announcing the standard.

## Before Visibility Changes

- Run `npm run verify`.
- Confirm GitHub Actions passes on `main`.
- Confirm `npm view perspective-room version` still returns not found.
- Confirm the repository visibility is still private until launch timing is approved.
- Review `README.md`, `docs/standard.md`, `docs/self-hosting.md`, and `docs/investor-agent-consumption.md`.
- Review examples for invented data only.
- Run the internal-reference scan.

## GitHub Launch

- Set repository description: `Open standard for AI-native fundraising bundles.`
- Set repository topics: `fundraising`, `data-room`, `ai-native`, `agents`, `startup`, `venture-capital`.
- Make the repository public.
- Refresh `v0.1.0` so it points at the launch commit.
- Publish release notes from `CHANGELOG.md`.

## npm Launch

- Confirm npm authentication and package ownership.
- Run `npm run verify`.
- Run `npm publish`.
- Confirm `npm view perspective-room version` returns `0.1.0`.
- Update README install instructions if needed.

## Announcement Check

- Link to the GitHub repository.
- State the standard clearly: AI-native fundraising for founders.
- Explain the bundle: `index.html` for humans, `room.json` and `agent.md` for agents.
- Avoid overclaiming adoption or investor behavior.
- Invite founders, investors, and agent builders to try the format and propose changes.
