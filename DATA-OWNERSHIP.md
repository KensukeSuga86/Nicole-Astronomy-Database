# Nicole Astronomy Database — Data Ownership & Consumer Specification

**Document status:** Authoritative repository specification  
**Database baseline:** v0.3.3  
**Schema version:** 5  
**Last updated:** 2026-10-04

---

## 1. Purpose

This document defines:

1. What data is authoritatively owned by **Nicole Astronomy Database**.
2. Which component is allowed to edit each class of data.
3. Which application consumes each data class and where it is used.
4. Which data is intentionally **not** owned by this database.
5. The publication path from editing to the authoritative GitHub database.

The purpose is to keep a single source of truth and prevent the same astronomical information from being edited independently in multiple applications.

---

## 2. Authority model

### 2.1 Authoritative source

**Nicole Astronomy Database is the authoritative shared astronomy database.**

Applications may cache, bundle, transform, index, or render data from this repository, but those copies are not authoritative.

### 2.2 Shared-description editing

Shared descriptions are edited only through:

**Nicole Astronomy Database Editor**

The Editor stores work-in-progress changes locally and does **not** directly modify the authoritative GitHub database.

The formal publication flow is:

```text
Nicole Astronomy Database Editor
        ↓
local editing / review
        ↓
Formal Database Update Package
        ↓
review
        ↓
apply to GitHub repository
        ↓
new authoritative database version
        ↓
consumer applications adopt that version
```

### 2.3 Application-specific editing

Application-specific display state, observing settings, scripts, annotations, media, layouts, and other runtime/user data are not automatically promoted into the shared database.

Where an application has an editor for a shared structural asset, such as constellation lines or constellation artwork, its output becomes authoritative only after review and explicit promotion into Nicole Astronomy Database.

---

## 3. Current authoritative datasets

| Dataset | Current scope | Authority / purpose |
|---|---:|---|
| `data/constellations.json` | 88 | Constellation identity, names, representative position, shared science/myth descriptions, cultural and verification metadata |
| `data/stars.json` | 64 | Curated stars: identity, position, magnitude, photometry, shared descriptions and observing metadata |
| `data/planets.json` | 7 | Planet identity, shared descriptions, physical diameter and rendering metadata |
| `data/deep-sky.json` | 119 | Deep-sky objects including Messier M1–M110, position, magnitude, angular size, shared descriptions and catalog metadata |
| `data/asterisms.json` | 9 | Asterism identity, member stars and line topology |
| `data/catalog.json` | 287 | Cross-dataset object index |
| `data/solar-system.json` | 9 | Shared solar-system physical/rendering metadata |
| `data/constellation-standard.json` | 88 | Standard constellation line topology and constellation-art placement |
| `data/constellation-line-stars.json` | 759 | Stars referenced by standard constellation lines and their coordinate-resolution status |
| `data/constellation-art-manifest.json` | 88 | Constellation artwork asset mapping, provenance and SHA-256 |
| `assets/constellation-art/*.png` | 88 | Authoritative constellation artwork assets |
| `data/constellation-editor-audit.json` | 88 | Audit trail for constellation-line/art editing results |
| `data/external-sources.json` | object | Registry of external astronomy endpoints and upstream resources |
| `data/sources.json` | object | Source registry and editorial/source policy |
| `manifest.json` | 1 | Database version, counts, provenance and checksums |

---

## 4. Consumer applications

Formal application names used in this specification:

- **Nicole the Astronavigator**
- **Nicole the Astrorium**
- **Nicole the Auroragazer**
- **Nicole the Meteor searcher**

Development nicknames are intentionally not used as product/UI names.

### Consumption status legend

- **Primary** — directly drives a visible application feature.
- **Supporting** — used by a subsystem, conversion layer, lookup, or optional feature.
- **Management** — primarily for provenance, auditing, validation, or maintenance.
- **Not currently consumed** — no current runtime dependency is defined.

---

## 5. Dataset → application usage matrix

| Dataset | Nicole the Astronavigator | Nicole the Astrorium | Nicole the Auroragazer | Nicole the Meteor searcher |
|---|---|---|---|---|
| `constellations.json` | **Primary** — constellation list/search, sky-map constellation identity, science/myth detail | **Primary** — constellation identity, search/detail, shared descriptive content | Not currently consumed | Not currently consumed |
| `stars.json` | **Primary** — curated-object search/detail, sky-map stars, star color/photometry | **Supporting / Primary for curated objects** — named-star/object data and shared descriptions; large background-star renderer uses a separate large catalog | Not currently consumed | Not currently consumed |
| `planets.json` | **Primary** — object cards/detail and mapping into planet ephemeris engine | **Primary** — planet identity/detail/rendering metadata; position remains dynamically calculated | Not currently consumed | Not currently consumed |
| `deep-sky.json` | **Primary** — object search/list/detail, sky map, observing information | **Primary** — deep-sky rendering/search/detail | Not currently consumed | Not currently consumed |
| `asterisms.json` | **Primary** — asterism lines and member-star mapping on sky map | **Primary** — asterism rendering/state | Not currently consumed | Not currently consumed |
| `catalog.json` | **Supporting** — common database index is loaded; application currently also builds compatibility structures | **Supporting** — intended/common cross-dataset lookup/index | Not currently consumed | Not currently consumed |
| `solar-system.json` | **Supporting** — physical/rendering metadata available to the common database layer | **Primary** — shared physical/rendering metadata for Sun/Moon/planets | Not currently consumed | Not currently consumed |
| `constellation-standard.json` | **Primary** — standard constellation line topology | **Primary** — constellation lines and artwork placement | Not currently consumed | Not currently consumed |
| `constellation-line-stars.json` | **Primary** — coordinate resolution for standard constellation lines | **Primary** — constellation-line rendering coordinates | Not currently consumed | Not currently consumed |
| `constellation-art-manifest.json` + artwork PNG | Not currently consumed in the current Astronavigator release | **Primary** — constellation artwork and asset integrity | Not currently consumed | Not currently consumed |
| `constellation-editor-audit.json` | Management | **Management** — constellation editing/audit workflow | Not currently consumed | Not currently consumed |
| `external-sources.json` | **Supporting** — registry for Milky Way / constellation-line upstream / comet / meteor resources | Supporting where the WebCore needs common upstream resource metadata | Not currently a shared-DB runtime dependency | Not currently consumed |
| `sources.json` | Management / attribution basis | Management / attribution basis | Not currently consumed | Not currently consumed |
| `manifest.json` | **Primary** — version validation before loading a pinned DB version | **Primary** — database version/configuration and integrity context | Not currently consumed | Not currently consumed |

---

## 6. Field ownership and usage

### 6.1 Constellations — `data/constellations.json`

| Field / group | Meaning | Edit authority | Astronavigator usage | Astrorium usage |
|---|---|---|---|---|
| `id` | Stable constellation ID | Repository maintenance only; immutable once published | Identity/key | Identity/key |
| `name.ja` | Japanese name | Database maintenance | Lists, search, detail, sky map | Labels, search, detail |
| `name.en` | English name | Database maintenance | Detail/search | Labels/detail |
| `name.abbr` | IAU abbreviation | Database maintenance | Mapping and sky-map structures | Constellation-line/art mapping |
| `season` | Legacy seasonal grouping | Database maintenance | Supporting observing UI | Supporting metadata |
| `visible_months_legacy[]` | Legacy visible-month guide | Database maintenance | Observing/filter compatibility | Supporting metadata |
| `main_stars_text` | Human-readable major stars | Nicole Astronomy Database Editor / reviewed DB update | Constellation detail | Shared detail |
| `legacy_story` | Legacy summary text | Nicole Astronomy Database Editor / reviewed DB update | Compatibility/detail | Compatibility |
| `explanation.science` | Shared science explanation | **Nicole Astronomy Database Editor only** | Constellation detail | Shared explanation |
| `explanation.myth` | Shared mythology/origin explanation | **Nicole Astronomy Database Editor only** | Constellation detail | Shared explanation |
| `representative_position.ra_deg` / `dec_deg` | Representative sky position | Database maintenance | Sky-map navigation / mapping | Search/navigation/centering |
| `mythology.*` | Myth provenance/variant metadata | Database maintenance / reviewed editorial work | Future/detail support | Future/detail support |
| `scientific_context.*` | Scientific/IAU context | Database maintenance | Attribution/context | Attribution/context |
| `cultural_context.*` | Cultural tags, currently including Miyazawa Kenji metadata | Reviewed database maintenance | Search/detail extension | Search/detail extension |
| `source.*` / `verification.*` | Provenance and verification | Database maintenance | Management | Management |

### 6.2 Curated stars — `data/stars.json`

| Field / group | Meaning | Edit authority | Astronavigator usage | Astrorium usage |
|---|---|---|---|---|
| `id` | Stable star ID | Repository maintenance | Identity | Identity |
| `name.*` | Japanese/English names | Database maintenance | Search, object card, detail | Search/detail |
| `position.ra_deg`, `dec_deg` | Fixed database position | Catalog/database maintenance | Sky map | Curated-object positioning |
| `magnitude_v` | Visual magnitude | Catalog/database maintenance | Sorting/display/sky map | Display |
| `constellation_id` | Parent constellation | Database maintenance | Constellation relation | Constellation relation |
| `catalog_category`, `icon` | UI/category metadata | Database maintenance | Cards/list | Detail/UI |
| `distance_text`, `size_text` | Public-facing descriptive values | Database Editor / reviewed update | Detail | Detail |
| `recommended_magnification` | Observing guide | **Nicole Astronomy Database Editor / reviewed DB update** | Observing/detail | Shared detail |
| `highlight` | Short highlight | **Nicole Astronomy Database Editor only** | Object cards/detail | Shared detail |
| `visible_months_legacy[]` | Legacy month guide | Database maintenance | Observing compatibility | Supporting |
| `explanation.overview` | Shared overview | **Nicole Astronomy Database Editor only** | Detail | Shared explanation |
| `explanation.observing` | Observing advice | **Nicole Astronomy Database Editor only** | Detail | Shared explanation |
| `explanation.science` | Science explanation | **Nicole Astronomy Database Editor only** | Detail | Shared explanation |
| `explanation.history` | History/name explanation | **Nicole Astronomy Database Editor only** | Detail | Shared explanation |
| `explanation.raw_html` | Legacy/pre-rendered compatibility text | Derived/compatibility; not a parallel editorial source | Compatibility fallback | Compatibility only |
| `photometry.*` | B−V, spectral type, estimated temperature and display color | Catalog/database maintenance | Star color/detail | Star metadata/rendering support |
| `roles[]` | Curated object / sky-chart role | Database maintenance | Selects curated objects/chart stars | Selection/support |
| `source.*`, `verification.*` | Provenance/verification | Database maintenance | Management | Management |

**Important:** the 64 curated stars in this file are not the full background-star catalog used by Nicole the Astrorium. The large background-star renderer remains a separate catalog.

### 6.3 Planets — `data/planets.json`

| Field / group | Meaning | Edit authority | Astronavigator usage | Astrorium usage |
|---|---|---|---|---|
| `id`, `name.*` | Identity/names | Database maintenance | Search/detail | Search/detail |
| `position.mode`, `position.planet_key` | Dynamic ephemeris mapping | Database maintenance | Maps object to astronomy calculation engine | Maps object to dynamic rendering/calculation |
| `magnitude_v` | Reference UI magnitude | Database maintenance | UI reference | UI reference |
| `physical_diameter_km` | Physical diameter | Scientific DB maintenance | Supporting | Rendering/physical metadata |
| `rendering.*` | Apparent-diameter model/minimum display size | Database maintenance | Supporting | Rendering |
| `distance_text`, `size_text` | Public-facing guide text | Database Editor / reviewed update | Detail | Detail |
| `recommended_magnification`, `highlight` | Observing guidance | **Nicole Astronomy Database Editor only** | Object cards/detail | Shared detail |
| `explanation.*` | Shared overview/observing/science/history | **Nicole Astronomy Database Editor only** | Detail | Shared explanation |
| `source.*`, `verification.*` | Provenance | Database maintenance | Management | Management |

Dynamic planetary coordinates, phase, geocentric distance, current apparent diameter, rise/set and similar epoch-dependent values are calculated at runtime and are **not** stored as authoritative static values here.

### 6.4 Deep Sky — `data/deep-sky.json`

| Field / group | Meaning | Edit authority | Astronavigator usage | Astrorium usage |
|---|---|---|---|---|
| `id`, `name.*`, `aliases[]` | Identity/names | Database maintenance | Search/list/detail | Search/labels/detail |
| `type`, `catalog_category` | Object classification | Catalog/database maintenance | Filtering/cards | Rendering/filtering |
| `position.*` | Fixed sky position | Catalog/database maintenance | Sky map | Rendering |
| `magnitude_v` | Visual magnitude | Catalog/database maintenance | Sort/display | Display |
| `constellation_id` | Parent constellation | Catalog/database maintenance | Relation/search | Relation/search |
| `messier_number` | Messier ID | Catalog/database maintenance | M1–M110 support | Messier display/search |
| `distance_text`, `size_text` | Human-readable public values | Database Editor / reviewed update | Detail | Detail |
| `recommended_magnification`, `highlight` | Observing guide | **Nicole Astronomy Database Editor only** | Cards/detail | Shared detail |
| `explanation.*` | Shared descriptions | **Nicole Astronomy Database Editor only** | Detail | Shared explanation |
| `catalog_metadata.*` | Catalog metadata | Catalog/database maintenance | Supporting/detail | Supporting/rendering |
| `angular_size.*` | Normalized apparent angular size | Catalog/database maintenance | Detail/support | Rendering/detail |
| `cultural_context.*` | Cultural tags | Reviewed database maintenance | Search/detail extension | Search/detail extension |
| `verification.*` | Verification record | Database maintenance | Management | Management |

### 6.5 Asterisms — `data/asterisms.json`

| Field | Meaning | Edit authority | Consumers |
|---|---|---|---|
| `id`, `name.*` | Asterism identity | Database maintenance | Astronavigator and Astrorium |
| `star_ids[]` | Member stars | Reviewed structural DB update | Astronavigator sky map; Astrorium renderer/state |
| `lines[].from/to` | Asterism line topology | Reviewed structural DB update | Astronavigator sky map; Astrorium renderer |
| `definition_note` | Definition note | Database maintenance | Supporting/detail |
| `cultural_context.*` | Cultural tags | Reviewed editorial update | Optional search/detail |
| `source.*` | Provenance | Database maintenance | Management |

### 6.6 Standard constellation lines and artwork — `data/constellation-standard.json`

This file is the authoritative shared record for the completed constellation-line/art project after explicit promotion into this repository.

| Field / group | Meaning | Edit origin / authority | Consumers |
|---|---|---|---|
| `id`, `name.*` | Constellation identity | Database maintenance | Astronavigator / Astrorium |
| `standard_version` | Standard dataset version | Repository release management | Both |
| `line.segments[].from/to` | Standard line topology | May originate in **Nicole the Astrorium constellation editor**, becomes authoritative only after reviewed DB promotion | Astronavigator sky map; Astrorium renderer |
| `line.star_ids[]` | Unique line-star IDs | Derived from reviewed topology | Both |
| `line.source_mode` | Edited/base provenance | Audit/DB maintenance | Management |
| `line.excluded_membership_star_ids[]` | Explicit exclusions | Astrorium edit workflow → reviewed DB promotion | Astrorium / audit |
| `line.editor_added_stars_used[]` | Manually added line stars | Astrorium edit workflow → reviewed DB promotion | Astrorium / line resolution |
| `art.asset` | Artwork asset path | Reviewed DB promotion | Astrorium |
| `art.placement.*` | Center, size, rotation, flips, opacity | Astrorium art editor → reviewed DB promotion | Astrorium projector/renderer |
| `provenance.*` | Project provenance/workflow status | Database release process | Management |

**Rule:** Nicole the Astrorium may be an editing tool for these structural assets, but it is not the authoritative store. A constellation edit is shared only after explicit promotion into Nicole Astronomy Database.

### 6.7 Constellation line stars — `data/constellation-line-stars.json`

| Field / group | Meaning | Authority | Consumers |
|---|---|---|---|
| `id`, `hip`, `name` | Line-star identity | Catalog/database maintenance | Astronavigator / Astrorium |
| `ra_deg`, `dec_deg` | Embedded coordinate when available | Reviewed catalog/project data | Line rendering |
| `magnitude_v` | Reference magnitude | Catalog/project data | Rendering |
| `coordinate_status` | Embedded vs upstream-reference status | Database maintenance | Loader / diagnostics |
| `coordinate_source`, `source_file`, `source_urls` | Coordinate provenance | Database maintenance | Management/fallback |
| `used_by_constellations[]` | Reverse usage mapping | Derived | Diagnostics/editing |

### 6.8 Constellation artwork manifest/assets

`data/constellation-art-manifest.json` and `assets/constellation-art/*.png` own:

- constellation → asset mapping
- image SHA-256
- source mode
- override provenance
- the actual 88 authoritative PNG assets

Primary consumer: **Nicole the Astrorium**.

The current **Nicole the Astronavigator** release intentionally does not bundle/use these artwork PNGs.

### 6.9 Solar-system shared metadata — `data/solar-system.json`

Owns shared static physical/rendering metadata:

- identity/name/type
- physical diameter
- distance-model identifier
- apparent-diameter rendering model
- minimum display size
- display color
- scientific source metadata

Primary rendering consumer: **Nicole the Astrorium**.  
Supporting common-data consumer: **Nicole the Astronavigator**.

It does not own epoch-dependent ephemerides.

### 6.10 Cross-dataset catalog — `data/catalog.json`

Each record maps:

```text
id
kind
name_ja
file
```

This is the authoritative cross-dataset index, currently 287 entries.

It should be preferred for future shared search/index work rather than creating a second independently maintained object index.

### 6.11 Audit and provenance datasets

#### `data/constellation-editor-audit.json`

Owns editing/audit facts including line source, segment/star counts, editor-added-star counts, artwork flags and workflow status.

#### `data/sources.json`

Owns science-source policy, mythology editorial policy, Miyazawa Kenji tagging policy, and the institutional/catalog source registry.

#### `data/external-sources.json`

Owns **where external data is obtained**, not the dynamic external data itself.

Current registries include Milky Way GeoJSON, upstream western constellation-line resources, comet endpoints / Hoshinotori, meteor-shower endpoint template, and constellation-standard project provenance.

---

## 7. Nicole the Astronavigator integration

Current architecture uses a database bootstrap/compatibility layer.

The application:

1. checks an expected database version,
2. attempts to load that pinned version online,
3. falls back to the bundled `database/` copy,
4. falls back to legacy embedded data only if both shared-DB paths fail.

The common database is converted into application compatibility structures such as:

```text
CONSTELLATIONS
CONSTELLATION_TEXT
CONST_COORD
STARS_DB
DSO_DB
SKY_EXTRA_STARS
SKY_ASTERISM_STARS
SKY_ASTERISMS
SKY_STAR_CONSTELLATION_MAP
SKY_CONSTELLATION_STANDARD
SKY_STANDARD_LINE_STARS
SKY_STANDARD_LINE_STAR_REFERENCES
```

This conversion is a consumer adapter, not a second source of truth.

**Current adoption note:** the currently published Nicole the Astronavigator baseline is pinned to Nicole Astronomy Database v0.3.2. Publishing v0.3.3 does not automatically change the application’s adopted database version; that pin must be updated in the application release.

---

## 8. Nicole the Astrorium integration

Nicole the Astrorium consumes the shared database for planetarium content such as:

- constellation identity and shared descriptions
- curated astronomical objects
- deep-sky objects
- planets / solar-system physical-rendering metadata
- asterisms
- standard constellation lines
- line-star coordinates
- constellation artwork and placement

The planetarium also has application-specific state and large rendering datasets that are not owned by Nicole Astronomy Database.

Examples include camera/FOV, date/time and observer location, display/layer switches, annotations, scripts, media, Presenter/Projector state, UI layout, and temporary/local constellation-editing workspace before promotion.

### Shared-description rule

**Nicole the Astrorium must not be a parallel editor of the shared `explanation.*` fields.**

If a UI exposes common descriptions, those descriptions are read-only from the perspective of shared DB ownership. Shared-description changes belong in **Nicole Astronomy Database Editor**.

### Structural constellation editing rule

Constellation-line/art editing may occur in Nicole the Astrorium because it has the specialized visual editor.

However:

```text
Astrorium edit
   ≠ authoritative shared DB update
```

Only reviewed promotion into Nicole Astronomy Database makes that structural edit authoritative.

---

## 9. Other applications

### Nicole the Auroragazer

Current main data sources are space-weather/observation services such as NOAA SWPC, NASA DONKI and Open-Meteo. No primary runtime dependency on the shared astronomy datasets above is currently defined.

### Nicole the Meteor searcher

Its main responsibility is meteor detection/selection in image workflows. No primary runtime dependency on the shared astronomy datasets above is currently defined.

If either application begins consuming shared astronomical records later, this specification must be updated at the same time.

---

## 10. Data intentionally not owned by Nicole Astronomy Database

| Data | Owner / source |
|---|---|
| Current Sun/Moon/planet coordinates | Application astronomy calculation engines |
| Current planet distance, phase, rise/set, altitude/azimuth | Runtime calculations |
| Weather forecasts | Weather providers / consumer application cache |
| Aurora nowcast/forecast, Kp, Bz, Bt, solar wind, Dst | NOAA/NASA/provider data |
| Current comet ephemerides | Hoshinotori / JPL / comet services |
| Current meteor-shower activity | Meteor data source/API |
| Observer location | User/application state |
| Camera/FOV/display switches | Application state |
| Presenter/Projector scene state | Nicole the Astrorium |
| Annotations/scripts/media | Nicole the Astrorium user/project data |
| Large background-star render catalog | Renderer/catalog subsystem, unless separately promoted into this DB |
| Lightroom image-analysis state/results | Nicole the Meteor searcher |

---

## 11. Editing authority matrix

| Data class | Allowed editor/source of change | How it becomes authoritative |
|---|---|---|
| Shared constellation/star/planet/deep-sky descriptions | **Nicole Astronomy Database Editor** | Formal Database Update Package → reviewed GitHub update |
| Names, coordinates, magnitudes, physical/catalog values | Reviewed database/catalog maintenance | Reviewed GitHub update with source/verification |
| Standard constellation lines | Nicole the Astrorium visual editor may originate changes | Explicit reviewed promotion into shared DB |
| Constellation artwork / placement | Nicole the Astrorium visual editor may originate changes | Explicit reviewed promotion into shared DB |
| Asterism definitions | Reviewed database maintenance | Reviewed GitHub update |
| Source policy / provenance | Repository maintenance | Reviewed GitHub update |
| Application UI/preferences/layout/media | Respective application only | Never promoted automatically |
| Runtime astronomical/weather/space-weather values | Calculation engine / external provider | Not stored as static authoritative DB values |

---

## 12. Formal Database Update Package

Nicole Astronomy Database Editor can export a formal update package.

The package is a transport/review artifact, not the database itself.

Current package schema:

```text
nicole-astronomy-database-update-package-v1
```

It contains:

- source database version
- source schema version
- proposed next patch version
- changed-item count
- changed IDs and fields
- complete edited category JSON for affected categories
- SHA-256 for those category JSON files
- publication plan metadata

The package **does not directly write to GitHub**.

A database release is authoritative only after the package has been reviewed and applied to the repository, including appropriate root `data/*.json`, versioned release copy, `manifest.json` checksums, `latest.json`, and validation/release documentation as required.

---

## 13. Rules for future development

1. **Do not introduce a second editor for shared descriptions.**
2. A consumer application may transform shared data for runtime use, but must not treat the transformed copy as authoritative.
3. Stable IDs must not be silently renamed.
4. New shared fields must declare meaning/unit, edit authority, provenance, consumers, and whether the value is static, derived, or runtime.
5. If a shared field is no longer consumed, check all consumers and migrations before deletion.
6. A new consumer of shared data must update this document.
7. A new editor of shared structural data must define a reviewed promotion path back into this repository.
8. UI-facing applications should use formal product names; development nicknames are not part of the public data contract.

---

## 14. Quick decision guide

**Shared astronomical knowledge used by multiple applications?**  
→ Nicole Astronomy Database.

**Shared explanatory text?**  
→ Nicole Astronomy Database Editor.

**Constellation-line/art visual edit intended to become shared?**  
→ Edit with specialized Nicole the Astrorium tooling, then explicitly promote into Nicole Astronomy Database.

**Calculated for a date/location?**  
→ Runtime calculation, not static shared DB.

**Weather, aurora, comet-nowcast or other live external feed?**  
→ External provider / application cache.

**User preference, layout, annotation, script or media?**  
→ Application/user data.

---

## 15. Canonical terminology

| Role | Formal name |
|---|---|
| Shared authoritative astronomy database | **Nicole Astronomy Database** |
| Shared database editing PWA | **Nicole Astronomy Database Editor** |
| Observation/navigation application | **Nicole the Astronavigator** |
| Planetarium application | **Nicole the Astrorium** |
| Aurora observation application | **Nicole the Auroragazer** |
| Meteor image-selection application | **Nicole the Meteor searcher** |

Development nicknames may be used in internal conversation, but they are not formal product names and should not appear in public-facing UI labels.
