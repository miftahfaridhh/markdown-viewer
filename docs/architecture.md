# Architecture — Markdown Viewer

A lightweight, fast, fully offline, local-first Markdown viewer for Windows.

- **Status:** Phase 1 (Architecture Design) — awaiting approval checkpoint
- **Stack:** Tauri v2 · Rust · React · TypeScript · Vite

---

## 1. Goals & Non-Goals

### Goals
- Run entirely **offline**, local-first, free and open source (MIT).
- **Minimal RAM** and **fast cold start** (target: < 1s window paint on a warm OS).
- Open and render Markdown files **> 20 MB** without freezing the UI.
- Render close to **GitHub README** + **Notion reading** experience.
- Safe rendering: **sanitized HTML, no script execution**.

### Non-Goals (v1)
- No Markdown *editing* (viewer only).
- No cloud sync, accounts, or telemetry.
- No live-server / collaboration features.

---

## 2. Technology Choices & Rationale

| Concern | Choice | Why |
|---|---|---|
| Shell | **Tauri v2** | ~3–10 MB installer vs ~100 MB+ Electron; uses OS WebView2 (no bundled Chromium) → lower RAM, faster start. |
| Backend | **Rust** | Fast, safe file I/O; streams large files off the UI thread. |
| UI | **React + TypeScript** | Component model + strong typing; large ecosystem. |
| Bundler | **Vite** | Fast dev server, fast builds, first-class TS. |
| Quality | **ESLint + Prettier** | Enforced style + lint, no dead code. |

### Markdown library decision

Candidates evaluated: `markdown-it`, `react-markdown`, `remark`, `rehype`.

**Decision: `remark` + `rehype` pipeline, consumed via `react-markdown`.**

Pipeline:
```
react-markdown
  ├─ remark-parse        (Markdown → mdast)
  ├─ remark-gfm          (tables, task lists, strikethrough, autolinks)
  ├─ remark-footnotes    (footnotes — built into remark-gfm in modern versions)
  ├─ remark-rehype       (mdast → hast)
  ├─ rehype-raw          (parse inline HTML so it can be sanitized, NOT trusted)
  ├─ rehype-sanitize     (allowlist-based HTML sanitization — security boundary)
  ├─ rehype-highlight    (syntax highlighting for code blocks, offline)
  └─ rehype-slug         (heading anchors)
```

**Rationale vs `markdown-it`:**
- `react-markdown` renders to **real React elements**, not `dangerouslySetInnerHTML`. This is the strongest XSS posture and integrates cleanly with React rendering/virtualization.
- The `remark`/`rehype` ecosystem gives **composable, auditable** plugins; security is a discrete, testable stage (`rehype-sanitize`).
- `markdown-it` is excellent and fast but emits an HTML string, pushing us toward `dangerouslySetInnerHTML` and a separate DOMPurify pass — more moving parts for the same result.

**Security note:** GFM does not permit raw HTML by default. We include `rehype-raw` *only* so that any inline HTML present in documents is parsed and then forced through `rehype-sanitize`'s allowlist. `<script>`, event handlers (`onclick`, …), and `javascript:` URLs are stripped. This satisfies "sanitize HTML / prevent script execution / disable unsafe HTML rendering."

---

## 3. Folder Structure

```
markdown-viewer/
├─ docs/
│  ├─ architecture.md        # this file
│  ├─ git-flow.md            # branch/merge/release strategy
│  └─ testing.md             # unit/integration/manual QA (Phase 4)
├─ src/                      # React + TS frontend
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ app/                   # composition root, providers, routing
│  ├─ features/
│  │  ├─ markdown/           # rendering engine (components + plugin config)
│  │  ├─ explorer/           # sidebar: file tree + recent files
│  │  ├─ toolbar/            # open, reload, zoom, theme toggle
│  │  └─ theme/              # light/dark, persistence
│  ├─ shared/               # pure utilities, types, hooks (no UI deps)
│  │  ├─ ipc/                # typed wrappers over Tauri commands
│  │  └─ types/
│  └─ styles/                # global CSS, GitHub/Notion-like tokens
├─ src-tauri/                # Rust backend
│  ├─ src/
│  │  ├─ main.rs
│  │  ├─ commands.rs         # read_file, list_dir, recent files
│  │  └─ fs_service.rs       # streaming/chunked large-file reads
│  ├─ tauri.conf.json
│  ├─ Cargo.toml
│  └─ icons/
├─ tests/                    # frontend unit/integration tests (Vitest)
├─ .github/workflows/        # CI (lint, test, build)
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ .eslintrc.cjs
├─ .prettierrc
├─ .gitignore
├─ README.md
├─ CONTRIBUTING.md
├─ CHANGELOG.md
└─ LICENSE                   # MIT
```

Architecture style: **Clean Architecture / feature-sliced**. `shared` has no UI dependencies; `features` depend on `shared`; the Rust backend exposes a small, typed command surface. This enforces separation of concerns and the dependency rule (SOLID).

---

## 4. Rendering Strategy (large-file performance)

The hard requirement is **> 20 MB files feeling instant**. Plan:

1. **Off-thread read (Rust):** `read_file` streams the file in Rust and returns content to the webview; the UI never blocks on disk I/O.
2. **Block-level parsing + windowed rendering:** split the document into top-level blocks (by Markdown block boundaries). Parse and render only blocks near the viewport using **virtualization** (`@tanstack/react-virtual`). This is the key to 20 MB+ files — we never mount tens of thousands of DOM nodes at once.
3. **Memoization:** each block is memoized by content hash so scrolling does not re-parse. `react-markdown` instances are keyed per block.
4. **Lazy assets:** images use `loading="lazy"`; syntax highlighting runs per visible block.
5. **Debounced reload** and stable keys to avoid unnecessary re-renders.

Fallback for small files (< ~256 KB): render as a single pass (virtualization overhead not worth it). A size threshold selects the path.

---

## 5. State Management

Deliberately minimal — no Redux.

- **React Context + `useReducer`** for app state (current file, theme, zoom, recent files, file tree).
- **Tauri Store plugin** (or a small JSON file via Rust) for **persistence**: theme, zoom level, recent files, last opened folder.
- Derived/view state stays in components. Heavy data (file content) is held once and passed by reference.

Rationale: the app has few global concerns; a full state library would add weight against the "minimal" goal.

---

## 6. IPC Surface (Rust ↔ React)

Typed commands (TypeScript wrappers in `shared/ipc`):

| Command | Input | Output |
|---|---|---|
| `read_markdown_file` | `path` | `{ content, sizeBytes, mtime }` |
| `list_directory` | `path` | tree of `.md`/`.markdown` entries |
| `get_recent_files` | — | `RecentFile[]` |
| `add_recent_file` | `path` | `void` |
| `load_prefs` / `save_prefs` | — / `Prefs` | `Prefs` / `void` |

Drag-and-drop uses Tauri's file-drop events; the Open dialog uses the Tauri dialog plugin. Filesystem access is scoped via Tauri v2 capabilities (allowlist) — no broad FS permission.

---

## 7. Build Pipeline

- **Dev:** `npm run tauri dev` → Vite dev server + Tauri shell with hot reload.
- **Frontend build:** `vite build` → static assets in `dist/`.
- **App build:** `cargo` compiles the Rust shell and embeds `dist/`.
- **Lint/format gates:** `eslint` + `prettier --check` + `tsc --noEmit` run in CI before build.

## 8. Packaging Pipeline (Windows)

- `npm run tauri build` produces:
  - **NSIS installer** → one-click `*-setup.exe` (we will rename/output as `install.exe`), with **Desktop shortcut** + **Start Menu shortcut** options.
  - Optionally an MSI (WiX) as a secondary artifact.
- Tauri config: product name, version, icons, file associations for `.md` / `.markdown`.

> **Environment constraint (must read):** Tauri produces Windows installers **on Windows** (it needs the Windows toolchain + WebView2 + NSIS/WiX). This dev machine is **WSL2 Linux with no Rust installed**. Two viable paths:
> 1. **GitHub Actions `windows-latest`** runner builds `install.exe` automatically on release tags (recommended; reproducible, no local Windows setup). I will provide this workflow.
> 2. Build locally **on a Windows host** (install Rust + WebView2 + run `npm run tauri build`). I will document exact commands.
>
> All **code, config, tests, docs, repo, and Git Flow** are fully deliverable from this environment. The actual `.exe` artifact is produced by path (1) or (2).

---

## 9. Theming

- CSS custom properties (design tokens) for light/dark.
- Typography: system UI font stack + a readable measure (~72ch), GitHub-like headings/spacing, Notion-like calm reading rhythm.
- Theme + zoom persisted via prefs; respects `prefers-color-scheme` on first run.

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| 20 MB file jank | Virtualized block rendering + Rust streaming + memoization. |
| XSS via inline HTML | `rehype-sanitize` allowlist; no `dangerouslySetInnerHTML`. |
| Windows build on Linux | CI Windows runner or documented Windows-local build. |
| Scope creep | Viewer-only v1; editing explicitly out of scope. |

---

## 11. Phase Plan

1. **Phase 1 — Architecture** (this doc) → *approval checkpoint*.
2. **Phase 2 — Scaffolding:** Tauri v2 + React + TS + Vite + ESLint + Prettier.
3. **Phase 3 — Engine:** rendering, themes, file loading, sidebar.
4. **Phase 4 — Testing:** Vitest unit/integration + `docs/testing.md` QA checklist.
5. **Phase 5 — Packaging:** production build + Windows installer + verification.
