# Validation — Nicole Astronomy Database v0.3.3

- database_version: 0.3.3
- astronomical data: unchanged from v0.3.2
- description editor: PWA enabled
- PWA manifest: `editor.webmanifest`
- service worker: `editor-sw.js`
- service-worker cache scope: editor shell only
- `manifest.json` / `data/*.json`: not intercepted by service worker
- browser override key: `nicole0_description_overrides_v1` unchanged
- editor export/import: supported
- installed web-app storage isolation: documented in UI; use patch export for handoff to Safari/Nicole 2
- JSON parse validation: passed
- JavaScript syntax validation: passed
- Mac + Safari / iPhone installed-PWA runtime test: not executed in this build environment
