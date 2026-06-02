---
sessionId: session-260602-155503-5jg2
---

# Requirements

### Overview & Goals
Replace the default placeholder icons with proper Libero/football-themed assets:
1. Replace the clock SVG icon in the React app header with a football (soccer ball) icon.
2. Replace the default Tauri app icons (used for taskbar, dock, window title, installers) with a custom Libero logo.
3. Update the browser favicon (`/public`) to use the new logo.

### Scope
**In Scope:**
- Clock SVG → football ball SVG in `App.tsx` header.
- New logo image file for the React app header (optional branding enhancement).
- New icon set in `src-tauri/icons/` (all required sizes: `.icns`, `.ico`, multiple `.png` sizes).
- Favicon update in `index.html` / `public/`.

**Out of Scope:**
- Redesigning the overall UI layout.
- Changing the app name or color scheme.

### Functional Requirements
- The header logo area shows a football ball SVG icon instead of a clock.
- The Tauri desktop app shows the Libero logo in the OS dock/taskbar/window title.
- The browser tab shows the Libero favicon.
- All required Tauri icon sizes are present and correctly referenced in `tauri.conf.json`.

# Technical Design

### Current Implementation
- **Clock icon**: inline SVG in `src/App.tsx` lines 64–66 — a clock path (`M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z`).
- **Tauri icons**: default Tauri placeholder icons in `src-tauri/icons/` (`.icns`, `.ico`, multiple `.png` sizes).
- **Favicon**: `public/vite.svg` referenced in `index.html`.

### Proposed Changes

#### 1. Football ball SVG icon in `App.tsx`
Replace the clock `<path>` with a football/soccer ball SVG path inside the existing `<svg>` wrapper (lines 64–66). A clean inline SVG ball icon will be used — no external dependency needed.

#### 2. New Libero logo image
Create a `libero-logo.svg` (or `.png`) in `public/` representing the Libero brand (e.g., a football with "L" or the app name). This file will also serve as the favicon.

#### 3. Tauri icon set
Replace all files in `src-tauri/icons/` with properly sized versions derived from the new logo:
- `icon.png` (1024×1024 source)
- `icon.icns` (macOS)
- `icon.ico` (Windows)
- `32x32.png`, `128x128.png`, `128x128@2x.png`
- All `Square*Logo.png` Windows sizes

The `src-tauri/tauri.conf.json` `bundle.icon` array already references these paths — no config change needed as long as filenames stay the same.

#### 4. Favicon
Update `index.html` to reference the new logo SVG/PNG instead of `vite.svg`.

### File Structure
 File | Change |
---|---|
 `src/App.tsx` | Replace clock SVG path with football ball SVG path |
 `public/libero-logo.svg` | New — Libero logo SVG |
 `public/vite.svg` | Remove or keep; `index.html` updated to point to new logo |
 `index.html` | Update `<link rel="icon">` href |
 `src-tauri/icons/*` | Replace all icon files with Libero-branded versions |

# Delivery Steps

### ✓ Step 1: Replace clock icon with football ball SVG in App.tsx
The header logo area shows a football/soccer ball icon instead of a clock.
- In `src/App.tsx` lines 64–66, replace the clock SVG `<path>` with a football ball SVG path.
- Keep the existing `<svg>` wrapper, `className`, and `bg-indigo-600 p-2 rounded-lg` container unchanged.
- Use a clean inline SVG path for a soccer ball (e.g. circle with pentagon patches pattern or a simple ball outline).

### ✓ Step 2: Create Libero logo SVG and update favicon
The browser tab shows a Libero-branded favicon instead of the Vite logo.
- Create `public/libero-logo.svg` — a simple football/soccer ball SVG with Libero branding colors (indigo/white).
- Update `index.html` `<link rel="icon">` to reference `/libero-logo.svg` instead of `/vite.svg`.
- Optionally remove or keep `public/vite.svg` (it is no longer referenced).

### ✓ Step 3: Replace Tauri app icons with Libero-branded icons
The desktop app shows the Libero logo in the OS dock, taskbar, and window title bar.
- Design or source a 1024×1024 PNG master icon based on the Libero logo (football + brand colors).
- Generate all required sizes and formats from the master: `icon.png`, `icon.icns`, `icon.ico`, `32x32.png`, `128x128.png`, `128x128@2x.png`, and all `Square*Logo.png` Windows sizes.
- Replace all files in `src-tauri/icons/` with the new versions.
- Verify `src-tauri/tauri.conf.json` `bundle.icon` paths still match (no rename needed if filenames are kept).