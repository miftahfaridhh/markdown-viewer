# Contributing to Markdown Viewer

Thank you for your interest in contributing.

## Getting Started

1. Fork the repository.
2. Clone your fork and create a branch from `develop`:
   ```bash
   git checkout develop
   git checkout -b feature/your-feature-name
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. For backend changes, install [Rust](https://rustup.rs/).

## Development Workflow

- Run the app in dev mode: `npm run tauri dev`
- Run tests: `npm run test`
- Lint: `npm run lint`
- Format: `npm run format`
- Typecheck: `npm run typecheck`

Make sure all checks pass before opening a pull request.

## Code Standards

- Follow the existing folder structure: features are isolated under `src/features/`.
- TypeScript strict mode is enabled — no `any` without justification.
- Comments only when the **why** is non-obvious.
- No dead code, no duplicated logic.

## Commit Messages

Use conventional commits:

```
feat: add X
fix: resolve Y
refactor: simplify Z
docs: update build instructions
build: bump Tauri to 2.x
test: add unit test for reducer
chore(release): prepare v1.1.0
```

## Pull Request Guidelines

- Target `develop`, not `main`.
- Keep PRs small and focused on one thing.
- Describe what and why in the PR description.
- All CI checks must pass before merge.

## Reporting Issues

Open an issue describing:
- What you expected
- What happened instead
- Steps to reproduce
- OS version and app version
