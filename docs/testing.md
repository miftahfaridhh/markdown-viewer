# Testing — Markdown Viewer

## Unit Tests

Run with:
```bash
npm run test
npm run test:coverage
```

### Coverage targets
- `src/app/reducer.ts` — all action types, edge cases
- `src/shared/ipc/index.ts` — input normalization helpers (pure functions only)
- `src/features/markdown/plugins.ts` — plugin configuration exports

## Integration Tests

Located in `tests/`. Use Vitest + `@testing-library/react` + `jsdom`.

Tests mock all Tauri IPC calls (no Rust needed to run tests). See `tests/setup.ts`.

### What to test
- `AppProvider` state transitions (via `dispatch`)
- Sidebar file click → `read_markdown_file` IPC called with correct path
- Toolbar theme toggle → `data-theme` attribute updates on `document.documentElement`
- Zoom clamping in reducer

## Manual QA Checklist

### Install
- [ ] Clean install on Windows 10/11
- [ ] Desktop shortcut created
- [ ] Start Menu shortcut created
- [ ] App launches without errors

### File opening
- [ ] Open dialog filters to `.md` / `.markdown` only
- [ ] Drag and drop `.md` file onto window
- [ ] Very large file (> 20 MB) opens without freezing
- [ ] File with Unicode characters renders correctly
- [ ] File with all GFM features renders (headings, tables, task lists, code blocks, footnotes)

### Rendering
- [ ] Headings H1–H6 render correctly
- [ ] Task lists (- [ ] / - [x]) render with checkboxes
- [ ] Fenced code blocks have syntax highlighting
- [ ] Tables render with borders
- [ ] Blockquotes render with left border
- [ ] Images render (local paths, data URIs)
- [ ] Inline code is styled distinctly
- [ ] Footnotes render at bottom

### Security
- [ ] `<script>alert(1)</script>` in markdown is stripped
- [ ] `<img onerror="alert(1)">` attribute is stripped
- [ ] `[click](javascript:alert(1))` link does not execute JS

### Theme
- [ ] Light theme applies on first launch (if system is light)
- [ ] Toggle theme switches to dark
- [ ] Theme persists after restart
- [ ] Zoom in / zoom out adjusts font size
- [ ] Zoom persists after restart

### Performance
- [ ] Cold start to visible window < 2s
- [ ] 20 MB file fully rendered < 3s
- [ ] Scrolling large file is smooth (no jank)
- [ ] Re-opening same file is instant (no re-parse)

### Sidebar
- [ ] Open folder populates file tree with `.md` files only
- [ ] Nested folders expand/collapse
- [ ] Clicking file in tree opens it in viewer
- [ ] Recent files list updates on file open
- [ ] Recent files persist across restarts
