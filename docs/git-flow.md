# Git Flow — Markdown Viewer

## Branch Strategy

| Branch | Purpose | Direct commits |
|--------|---------|----------------|
| `main` | Production-ready code, every commit is tagged | No |
| `develop` | Integration branch, base for all feature work | No |
| `feature/*` | New features | Yes |
| `bugfix/*` | Bug fixes against develop | Yes |
| `hotfix/*` | Critical fixes against main in production | Yes |
| `release/*` | Release preparation (bump version, changelog) | Changelog only |

## Workflow

### New feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
# ... work and commit ...
git push origin feature/your-feature-name
# Open PR: feature/* → develop
```

### Bug fix on develop
```bash
git checkout develop && git pull
git checkout -b bugfix/describe-the-bug
# ... fix and commit ...
git push origin bugfix/describe-the-bug
# Open PR: bugfix/* → develop
```

### Release
```bash
git checkout develop && git pull
git checkout -b release/v1.x.y
# Bump version in package.json and src-tauri/tauri.conf.json
# Update CHANGELOG.md
git commit -m "chore(release): prepare v1.x.y"
git push origin release/v1.x.y
# PR: release/* → main, then merge back → develop
```

### Hotfix (production bug)
```bash
git checkout main && git pull
git checkout -b hotfix/critical-description
# Fix, commit
git push origin hotfix/critical-description
# PR → main, merge back → develop
```

## Merge Strategy

- All merges via Pull Request (no direct push to `main` or `develop`).
- Squash and merge for `feature/*` and `bugfix/*` PRs to keep history clean.
- Merge commit for `release/*` and `hotfix/*` to preserve the context.

## Release Strategy

1. Create `release/vX.Y.Z` from `develop`.
2. Update version numbers (`package.json`, `tauri.conf.json`).
3. Update `CHANGELOG.md`.
4. PR to `main`, merge, tag `vX.Y.Z` on `main`.
5. Tag triggers the GitHub Actions release workflow → builds `install.exe`.
6. Merge `main` back into `develop`.

## Tagging
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```
Pushing a `v*` tag triggers the `release.yml` workflow and produces `install.exe`.

## Commit Message Convention

Format: `type(scope): description`

| Type | When to use |
|------|------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change without behavior change |
| `docs` | Documentation only |
| `build` | Build system or dependency changes |
| `test` | Adding or fixing tests |
| `chore` | Maintenance tasks (version bumps, CI) |
| `perf` | Performance improvement |

Examples:
```
feat: add virtualized rendering for large markdown files
fix: resolve sidebar scroll position lost on file switch
docs: update build instructions for Windows CI
build: upgrade Tauri to 2.1.0
test: add unit tests for app reducer
chore(release): prepare v1.1.0
```
