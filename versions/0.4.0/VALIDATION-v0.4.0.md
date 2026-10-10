# Validation — Nicole Astronomy Database v0.4.0

- database_version: 0.4.0（2026-10-10）
- JSON parse validation: passed（data/*.json, manifest.json, latest.json）
- IDs: deep-sky 119 / stars 64 / planets 7 / constellations 88 / catalog 287 — v0.3.3 と同一順・同一ID
- enriched explanations: 278/278（各項目に `explanation.enrichment.version = "0.4.0"` と `raw_html`）
- constellation standard: 88 entries, 722 segments, 761 line-star IDs, unresolved 0（embedded 273 / upstream 488）
- description editor: JavaScript syntax check passed; new fields (story / latest / observing for constellations); `raw_html` rebuilt on edit
- service worker cache name: `nicole0-editor-shell-v0.4.0-r1`
- checksums: `manifest.json` の `checksums_sha256` を再計算
- 内容の確認: 数値・年・人名は主要な公表資料（NASA Hubble Messier Catalog、各ミッション・研究発表）にもとづいて記述。時刻に依存する記述は2026年10月時点。
- 未実施: 公開サイト（GitHub Pages）での表示確認、Safari / iPhone の解説エディタPWAでの実機確認
