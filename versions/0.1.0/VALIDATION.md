# VALIDATION

Database: 0.1.0

- Constellations: 88
- Stars: 64 total / 22 with Nicole 1 full explanations
- Planets: 7
- Deep-sky objects: 47
- Asterisms: 8
- Catalog entries: 214
- Duplicate-ID check: PASS
- Asterism star-reference check: PASS
- Star→constellation reference check: PASS

## Intentionally unresolved in v0.1.0

1. Deep-sky objects do not have an explicit `constellation_id` in Nicole 1's source data, so this package does **not** guess it.
2. B−V, spectral type, and star display color are not stored in Nicole 1's static database. Fields are present but `null` for later enrichment.
3. Dynamic comet, meteor-shower, Milky Way, and Western constellation-line data stay as external sources; endpoints/URLs are listed in `data/external-sources.json`.
4. Planet positions remain calculated at runtime; the database stores their descriptive metadata only.

## Issues
- None.