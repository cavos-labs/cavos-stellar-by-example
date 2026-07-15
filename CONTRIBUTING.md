# Contributing

Thanks for helping build **Cavos Stellar by Example**. This repo is a home for
small, focused reference apps, so contributions tend to be self-contained and
easy to review. This guide explains how to pick work, how we expect you to work,
and what a mergeable pull request looks like.

## Ground rules

- Be respectful and constructive. Assume good intent, keep feedback about the
  code, and help newcomers get unblocked.
- Code, comments, commit messages, and docs are written in **English**.
- Never commit secrets. No `.env` files, API keys, seed phrases, or private
  keys. If you think you leaked one, rotate it and tell a maintainer.

## Picking an issue

1. Browse the [issues](https://github.com/cavos-labs/cavos-stellar-by-example/issues).
   Look for labels like `good first issue` and `help wanted` if you're new.
2. Comment on the issue to claim it, or ask a maintainer to assign it to you.
   Please only claim what you can realistically start soon.
3. If there's no issue for what you want to build, open one first so we can
   agree on scope before you write code.

Check the issue's estimate/size label (e.g. `size: S/M/L`) before claiming, and
pick something that fits the time you actually have.

## How we work

- **Fork** the repo (or branch it if you have write access).
- **Branch** from `main` using a descriptive prefix:
  - `feat/…` for new features (e.g. `feat/escrow-timeline`)
  - `fix/…` for bug fixes
  - `docs/…` for documentation
  - `chore/…` for tooling and maintenance
- **Keep pull requests small.** One issue per PR is ideal. Small PRs get
  reviewed and merged faster.
- **Link the issue** your PR closes (e.g. "Closes #12") in the description.
- **Write clear commits.** A short imperative subject ("Add escrow timeline")
  and a body explaining the "why" when it isn't obvious.

## Time and ownership expectations

These are guidelines, not hard rules — communication matters more than speed.

- Claim work you can finish in roughly **one to three focused sessions**. If an
  issue is bigger than that, split it or say so on the issue.
- If you get **blocked for more than ~48 hours**, leave a short comment on the
  issue with what's blocking you so someone can help.
- If you can no longer continue, **unassign yourself** (or comment) so the issue
  is free for someone else. It's completely fine to step away — just let us
  know.
- Stale claims (no update for ~1 week with no response) may be reassigned.

## Definition of done

Before you open a pull request, make sure:

- [ ] The app builds and runs locally (`npm install`, `npm run build`,
      `npm run dev`).
- [ ] Your change matches the existing look and feel and code style of the app.
- [ ] You updated the relevant README or app notes if behavior or setup changed.
- [ ] No secrets, credentials, or generated junk are committed.
- [ ] The PR is scoped to a single issue and links to it.

## Local setup

Each app is independent. From the repo root:

```bash
cd <app-directory>
npm install
npm run dev
```

Questions? Open an issue or start a discussion. Happy building.
