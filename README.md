# Markdown Viewer

A lightweight, fast, and completely offline Markdown viewer for Windows — built with Tauri v2, Rust, React, and TypeScript.

## Features

- Renders GitHub Flavored Markdown (GFM) — headings, tables, task lists, code blocks, footnotes, blockquotes, and more
- Syntax highlighting for code blocks (offline, no CDN)
- Light and dark themes — preference persisted locally
- File explorer sidebar with nested folder navigation
- Recent files list
- Drag and drop `.md` / `.markdown` files onto the window
- Opens files larger than 20 MB
- Sanitized HTML — no script execution
- Zoom in / zoom out with persisted zoom level
- No internet connection required, ever

## Screenshots

> Screenshots will be added after the first release build.

## Installation

1. Download `install.exe` from the [Releases](../../releases) page.
2. Run the installer — one-click setup with optional Desktop and Start Menu shortcuts.
3. Open a `.md` file or drag one into the application window.

## Build from Source

### Prerequisites

- [Rust](https://rustup.rs/) (stable toolchain)
- Node.js 20+
- On Windows: [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (usually pre-installed on Windows 10/11)
- On Linux (dev only): `libwebkit2gtk-4.1-dev`, `libxdo-dev`, `libssl-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`

### Development

```bash
npm install
npm run tauri dev
```

### Production build (Windows)

```bash
npm install
npm run tauri build
```

The installer is generated at `src-tauri/target/release/bundle/nsis/*.exe`.

### Tests and lint

```bash
npm run test          # run unit and integration tests
npm run test:coverage # with coverage report
npm run lint          # ESLint
npm run typecheck     # TypeScript type check
npm run format:check  # Prettier
```

## Git Flow

See [docs/git-flow.md](docs/git-flow.md) for the full branch strategy, merge strategy, and release process.

Short version:
- `main` — production only, every commit is a tagged release
- `develop` — integration branch
- `feature/*` — new features, PR into `develop`
- `release/*` — release preparation, PR into `main`, tag triggers CI build

Pushing a `v*` tag triggers GitHub Actions which builds `install.exe` on a `windows-latest` runner and publishes a GitHub Release automatically.

## Architecture

See [docs/architecture.md](docs/architecture.md) for full design decisions, folder structure, rendering strategy, and IPC surface.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
