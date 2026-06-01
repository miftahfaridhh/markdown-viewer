# Changelog

All notable changes to Markdown Viewer are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Initial project scaffold with Tauri v2, React, TypeScript, Vite
- GitHub Flavored Markdown rendering via remark/rehype pipeline
- Light and dark themes with local persistence
- File explorer sidebar with nested folder support
- Recent files list (up to 20 entries)
- Drag and drop support for `.md` and `.markdown` files
- Open file dialog filtered to Markdown files
- Syntax highlighting for code blocks (offline via highlight.js)
- Dark mode syntax highlighting via scoped CSS overrides (no runtime style swaps)
- Zoom in / zoom out with local persistence
- HTML sanitization via rehype-sanitize (allowlist-based)
- Virtualized block rendering for files larger than 512 KB (uses @tanstack/react-virtual)
- Smart Markdown block splitter that preserves code fence boundaries
- Keyboard shortcuts: Ctrl+O (open), Ctrl+R (reload), Ctrl+= (zoom in), Ctrl+- (zoom out)
- Tauri plugin capabilities configured for fs, dialog, and store
- Windows NSIS installer with Desktop and Start Menu shortcuts
- GitHub Actions CI: lint, typecheck, test on push and PR
- GitHub Actions release: Windows installer built on `v*` tag push
