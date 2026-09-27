# MIGRATION PLAN

## Phase 1 — Mirror (this package)
Nicole 1 remains unchanged. Its embedded astronomy data has been extracted into a normalized, versioned common database.

## Phase 2 — Nicole 2 first
Switch Nicole the Astrorium to read this database through `database-loader.js`.
This is lower risk because Nicole 2 is still under active development.

## Phase 3 — Nicole 1 compatibility adapter
Use `adapters/nicole1-compat.js` so Nicole 1 can receive the same legacy-shaped arrays it currently expects.
Keep the embedded data as a temporary fallback for one release.

## Phase 4 — Remove duplicate embedded data
After parity tests, remove duplicated static astronomy records from Nicole 1 and make this database authoritative.

## Phase 5 — Hosting
Recommended initial deployment:
`Hoshinotori/data/astronomy/` or a dedicated `Nicole-Astronomy-Database` GitHub repository.
Both Nicole 1 and Nicole 2 should pin a database version in production, with an optional latest-channel for development.

## ID rule
Existing Nicole 1 IDs are frozen. Never rename an ID just to improve wording.
Names and aliases may change; IDs must remain stable.
