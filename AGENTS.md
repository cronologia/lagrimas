# AGENTS.md — lagrimas

Operating guide for AI coding agents (and humans) working in this repository.
Read this and `context.md` before making changes. The shared method lives in
`cronologia/core` (skills: **sourcing-rules** — non-negotiable, load it before
touching any `data/*.json`; in a Claude Code Remote session it is at
`/home/user/core/skills/sourcing-rules/SKILL.md` — plus bootstrap-project,
data-edit, mine-video, dossier-research); the architecture rationale in
`cronologia/fsp` → `docs/adrs/`.

**Every data edit goes through the data-edit gate** (see the `data-edit`
skill): query → edit `data/chronology.json` → `node scripts/validate-data.js`
→ `node --test` → `node build.js` → commit the data AND the regenerated
`docs/` in the same commit. Never hand-edit anything under `docs/`.

## What this project is

A compiled static website documenting the chronology of the **reported
apparitions of Nossa Senhora das Lágrimas (Our Lady of Tears) to Sister
Amália de Jesus Flagelado in Campinas, Brazil (1929–1930), and of the Chaplet
of Tears devotion**. A single JSON file is the source of truth; a
zero-dependency Node script compiles it into static HTML served by GitHub
Pages.

## Repository map

```
data/chronology.json     SOURCE OF TRUTH — facts, events, figures, organizations, references (hand-edited, English)
data/i18n/{es,pt}.json   HAND-AUTHORED translation dictionaries (exact-key; committed). In THIS repo they were written by hand (see _meta.generatedBy), not by scripts/translate.js — keep them in sync with the English by hand, and use `node scripts/translate.js --stats` only to audit coverage
data/archives.json       MACHINE-GENERATED Wayback snapshot cache (written by scripts/archive-refs.js; committed)
data/glossary-terms.json VENDORED, PINNED list of cronologia/glossary term ids (written by scripts/sync-glossary-terms.js; committed) — validates [[term-id]] cross-links offline
data/places.json         VENDORED, PINNED copy of the cronologia/core gazetteer (written by scripts/sync-places.js; committed) — coordinates for the optional placesMap renderer; only needed when placesMap is declared
src/styles.css           Stylesheet (copied into the build)
src/latam.svg            VENDORED Latin America base map (Natural Earth, public domain) — used by the `map` tier renderer; regenerate with scripts/gen-latam-svg.js (dev-only, needs npm)
src/world-land.json      COMMITTED world basemap for the placesMap renderer (Natural Earth 1:110m, public domain; see its _meta) — only needed when placesMap is declared
scripts/validate-data.js Schema check (runs in CI before the build) — also fails on unknown glossary [[term-id]] links
scripts/archive-refs.js  Wayback preservation: snapshot lookup + Save Page Now for references[] -> data/archives.json
scripts/check-links.js   Link-health checker (out-of-band/CI): HEAD/ranged-GET status + soft-404 heuristic + Wayback lookup for references[]; JSON + Markdown report. Never edits data.
scripts/sync-glossary-terms.js  Refresh data/glossary-terms.json from cronologia/glossary (out-of-band; needs network)
scripts/sync-places.js   Refresh data/places.json from cronologia/core (out-of-band; sibling checkout or network); --check detects a stale copy
scripts/translate.js     Fills data/i18n/*.json from a translation backend (env-configured; no-op offline)
build.js                 Compiler: data/chronology.json (+ i18n + archives) -> docs/{en,es,pt}/ (chronology + one dir per declared subpage) + sitemap + robots
test/                    node:test suites (helpers + data invariants + per-locale drift check)
.github/workflows/deploy.yml  CI: validate, test, build, drift check, Pages deploy (main + manual dispatch)
.github/workflows/wayback.yml CI: weekly archive-refs run; commits data/archives.json + rebuilt docs/
.github/workflows/link-health.yml CI: weekly check-links run; opens/updates a single "link health" issue with the failures (never edits data)
docs/                    COMPILED OUTPUT, served by GitHub Pages (committed)
  index.html               root redirect stub -> preferred locale
  en/ es/ pt/              one localized site per locale (index.html + chaplet/ + novena/)
  sitemap.xml robots.txt   per-locale SEO
```

## Multi-language (i18n) & SEO

The site ships in **English (default, authoritative), Spanish and Portuguese**.
`es`/`pt` are **machine-translated** from the committed caches in `data/i18n/`
and carry a visible "machine-translated" disclaimer. The language is a path
segment **after** the project (`/<repo>/{en|pt|es}/…`) because GitHub Pages
serves each repo under `https://<org>.github.io/<repo>/`; `/<repo>/` redirects
to the visitor's locale. See `adrs/0001-multilingual.md` and `cronologia/core#9`.

- **No backend, ever.** The site is static HTML on GitHub Pages; nothing
  translates at runtime. `es`/`pt` are **pre-authored, committed** caches in
  `data/i18n/` baked into the static pages at build time. Fill them by authoring
  the translations and committing them; `node scripts/translate.js --stats`
  reports which strings still need one. (An env-configured MT service is an
  optional convenience — not required.) Keep them fresh when English changes.
- Localization is **data-level** (a key-based walk in `build.js`), so every
  renderer — chronology, genealogy, charts, glossary links — is covered.
- **Never translated:** reference titles/publishers, proper names, URLs, dates, ids.
- **Subtrees where the general rule misfires get their own allowlist.**
  `TRANSLATABLE_KEYS` decides the dataset at large; `SUBTREE_TRANSLATABLE` in
  `build.js` maps a subtree's key to the keys that are prose *inside* it, and
  the walk resolves it as it descends (nearest enclosing subtree wins, and it
  is sticky). `references` ships: bibliography passes through verbatim except
  `publisherNote`, which is the project's own voice. A repo whose dataset has
  another such subtree adds one entry in the `subtree-allowlists` ADOPT block —
  in `olavo`, a bibliography where `note`/`sourceNote`/`label`/`blurb`/`role`/
  `when` are prose and `title` is a book's name and must not be translated.
  `test/i18n-completeness.test.js` parses that map and MIRRORS the walk; its
  last test drives `localizeData` with a marking dictionary and asserts the two
  select exactly the same strings, so the audit cannot drift from the compiler
  in either direction.
- Each page emits localized `<title>`/description/OG/Twitter, a self canonical,
  `hreflang` (en/es/pt + x-default) and JSON-LD; the build also writes
  `sitemap.xml` (with hreflang alternates) and `robots.txt`.

## Optional visualizations (data-driven, off by default)

The compiler renders extra visual sections only when the corresponding key
exists in `data/chronology.json`; when a key is absent the output is
byte-identical to a build without the feature. Shapes are shown in
`data/chronology.example.json`; the validator checks all of them.

- **`meta.vizChips[]`** — header pill links to the visual sections
  (`{ "href": "#lineage", "label": "🌳 Genealogy" }`).
- **`lineage`** (alias `episcopalLineage`, the original fsspx key) — genealogy
  / lineage trees (`renderLineageSection`). One `trees[]` entry per branch;
  `separate: true` sets a branch apart visually for lines that must NOT be
  read as connected (the fsspx Thục/Palmar pattern). **Typed edges**: a node
  with `edge: "indirect"` (plus optional `edgeLabel`) renders a DASHED
  connector — a reference/association, not a direct consecration/initiation —
  and a solid/dashed legend appears automatically (labels overridable via
  `edgeLegend`). With no typed edges the markup is byte-identical to the
  fsspx site's genealogy section. `heading`/`navLabel` default to
  "Episcopal genealogy"/"Genealogy".
- **`branchTimeline`** — horizontal "subway diagram" of an organization's
  divisions (`renderBranchTimeline`): a trunk line with labeled branches
  forking off at dated points (e.g. SSPX → SSPV 1983 → Resistance 2012 →
  2026). Static inline SVG — print scales it to the page via its viewBox;
  on screen it sits in its own horizontal-scroll container (`.viz-scroll`).
  Lanes follow listing order; `from` forks a branch off an earlier branch;
  `end` terminates a branch (dot) instead of running to the right edge.
  Every trunk/branch entry needs `sources[]` — the figure's claims are cited
  in its `<figcaption>` list.
- **`numbersChart`** — contested-numbers / series chart (`renderNumbersChart`):
  for figures that must NOT be silently unified (e.g. a movement's
  self-reported participant count vs. an external survey's population share).
  Each `series[]` is drawn as its OWN panel on its OWN axis, with its OWN
  `unit`, its OWN `sourceLabel` (WHO reported it), and its OWN `sources[]` —
  the series are never merged onto one scale. A required `unitNote` renders the
  explicit **"not directly comparable"** banner. `axisMax` sets that series'
  axis top (defaults to its largest point); each `points[]` entry has a numeric
  `value`, a human-readable attributed `display`, and an optional `year`. The
  `<figcaption>` cites every series. `heading`/`navLabel` default to "Numbers".
  Sits in its own `.viz-scroll` container; prints as static panels.
- **`map`** — country tier map (`renderTierMap`): a static choropleth of the
  vendored Latin America base map, the tl presence-map pattern. Tiers are a
  per-repo, DATA-DECLARED vocabulary (`tiers: [{ id, label }]`, 1–4 entries,
  listing order = visual rank) — what a tier means is an editorial claim, so
  it lives in the data with its legend label, never in the renderer. Each
  `countries[]` entry (`code` ISO alpha-2, must exist in src/latam.svg;
  `name`; `tier`; cited `note`) fills its country and gets a hover/focus
  tooltip (aria-live caption) plus a citation card. `unlistedLabel` is
  REQUIRED: on a contested subject, an unfilled country is a statement too,
  and the legend must say what it means. Distinct from `placesMap` (event
  pins): this says what KIND of place a country is in the story, not where
  events happened. fsp's year-slider membership map is a declared follow-up
  (core#3), not covered by this key yet.

- **`approvalLadder`** — how far a reported apparition got through Church
  judgment (`renderApprovalLadder`), rendered at the TOP of the page, above
  `about`, because for a reported apparition the verdict is what a reader looks
  for first and what devotional sources most often blur. Rungs are DATA-DECLARED
  (`stages[]`), never hardcoded: real cases do not all have three. Four
  properties are load-bearing and any redesign must keep them — (1) no overall
  verdict is ever rendered for the case, only per-rung ones; (2) `not-found`
  ("we searched and found nothing"), `not-reached` ("the case positively did not
  go here"), `negative` and `adjacent` (core#68 — a real dated act about a
  DIFFERENT object: an imprimatur, a feast, a person's cause) stay four
  different things; (3) every rung carries
  `sources[]` or a `noDocument` note saying what was searched, or the build
  fails; (4) status is text + glyph + prose, never colour alone. `status` is a
  closed enum (`STATUS_GLYPH`) and is deliberately EXCLUDED from the
  `approvalLadder` entry in `SUBTREE_TRANSLATABLE` — translating it would turn
  `favourable` into `Investigado` and break only the localized build. For this
  repo the finding is an absence: no Church judgment on the Campinas apparitions
  themselves has been located, and the 16 June 2023 decree concerns Sister
  Amália's possible beatification cause, not the apparitions, so it appears only
  in the ladder's intro prose saying exactly that — never as a rung. The two
  imprimatur rungs (1933; 1932 and the 1935 foreign approvals) are `adjacent`
  for the same reason: their object is a book, a chaplet and a medal.

- **`meta.threads`** — the per-repo lane taxonomy (core#23) and, once declared,
  the **swimlanes** figure (`renderSwimlanes`): one row per lane, one column per
  decade, each cell that lane's event count, rendered as a real `<table>`
  because the data is categorical-over-time. Declaring a taxonomy is what turns
  the figure on — a classification the site keeps but never shows would be
  latent editorialising. Three rules the renderer enforces and any redesign must
  keep: `meta.threads.note` renders WITH the figure (it is the visible statement
  that the lanes are a reading); every lane's `basis` renders below it with its
  citations; and lane labels render VERBATIM, because a label may carry a
  load-bearing hedge ("Antecedents (attributed, not adopted)"). Gap collapsing is
  shared with the spine via `decadeColumns()`, so two figures on one page cannot
  disagree about the same gap.

Print baseline: `src/styles.css` ships an `@media print` block (nav/chips
hidden, figures `break-inside: avoid`, the subway SVG scaled to page width) —
extend it when adding a new visualization.

## Documentary subpages (`pages[]`, optional — off by default)

The chronology is not the only page the build emits. A dataset may declare
`pages[]`, and each entry compiles to `/{lang}/<id>/` in every locale, with its
own `<title>`, description, canonical, hreflang alternates and sitemap entries
(`routesFor()` derives the routes; nothing is hardcoded). With no `pages` key
there are no extra routes and the chronology page is byte-identical to a build
without the feature — the same opt-in contract as the visualizations.

This repo declares two, and the reason is specific to the subject: most of the
Church acts the record can date have a *text* as their object. The 8 March 1932 imprimatur
and the four 1935 approvals abroad permit the printing of the chaplet's prayers
and a medal, and judge nothing about the apparitions. A chronology that dates
those acts and never shows what they were about leaves a reader one click short
of the thing being judged.

- **`chaplet`** — the prayers, quoted in Portuguese with a working translation,
  laid out as a PRAY-ALONG: opening prayer, the two invocations once with their
  sources, then the seven groups, each with a meditation and both invocations as
  they are actually said, then the final beads, final prayer and closing
  invocations.
- **`novena`** — a nine-day arrangement of the chaplet with the seven sorrows,
  composed for this site and labelled as such throughout.

Four rules the renderer and the validator enforce together; any redesign keeps
them:

1. **A transmitted text is quoted in its own language.** A `kind: "prayer"`
   block carries `original` — the wording its publishers print — and `original`
   is deliberately OUTSIDE `TRANSLATABLE_KEYS`, so the localization walk never
   touches it. A prayer is not the site's prose, and a Spanish page printing a
   Spanish "original" would be lying about what it reproduces.
2. **The translation says it is one.** `text` beside a prayer renders under the
   label "Working translation", and is SUPPRESSED when localization has
   returned the original — on the pt page the gloss of a Portuguese prayer is
   the prayer, so the pt dictionary maps the English gloss to the original
   itself and the page prints it once. `test/subpages.test.js` pins both.
3. **Every section says where it comes from.** `sources[]` when someone else
   transmits it, `basis` when it is this site's own composition — and `basis`
   RENDERS, for the same reason the thread lanes' does. A section with neither
   fails validation: an arrangement that names no author reads as tradition,
   which on this subject is the confusion the whole dataset exists to undo.
4. **A subpage lists only the sources it cites, with the SITE-WIDE numbers**
   (`<li value="n">` pins the marker), so `[26]` means the same document on
   every page of the site. A source cited only through a `sameAs` counts as
   cited, or the marker would appear with no entry under it.
5. **A reproduced text has exactly one home.** A pray-along says the same two
   invocations at all seven groups and shares its meditations with the novena
   page; the text is declared once with an `id` and referenced by
   `sameAs: "block-id"` (or `"page-id#block-id"` across pages), which carries
   the original, its translation, its kind and its citations to the point of
   use while the referring block supplies only its own rubric. Copying instead
   would give a typo fourteen places to hide in on a page whose whole claim is
   that it reproduces a text faithfully. `test/subpages.test.js` fails on any
   duplicated `original` in the dataset.

Two quoted kinds, and the difference is editorial rather than cosmetic:
`prayer` is transmitted and must cite a source; `meditation` is considered
rather than said, may be an original composition, and is then accounted for by
the section's rendered `basis`. The seven meditations on these pages are the
project editor's own, written for this devotion — not transmitted text, no
imprimatur, attributed to no one else — and every group says so beneath it.

Adding a page is a data edit like any other: declare it in `data/chronology.json`,
translate every new string in `data/i18n/{es,pt}.json` (the i18n completeness
test fails otherwise), then run the gate and commit the regenerated `docs/`.

## Thread lanes (optional, off by default — schema only; renderer pending, core#23)

Events may carry `threads: string[]` naming which parallel storyline(s) an
event belongs to (always an array — cross-cutting events belong to more than
one). The vocabulary is **per-repo and editorial**: it must be declared in
`meta.threads`, never invented in code or derived by clustering the text:

```json
"meta": {
  "threads": {
    "note": "<visible editorial statement: these lanes are a reading of the chronology, not a neutral fact>",
    "lanes": [
      { "id": "rome-relations", "label": "Relations with Rome",
        "basis": "<what grounds this lane — the actor's own periodization, a scholarly framework… cite it>",
        "sources": ["optional-ref-id"] }
    ]
  }
}
```

`scripts/validate-data.js` enforces: unknown lane id on an event → error;
`threads` used without a declared taxonomy → error; missing `note` or a lane
missing `basis` → error; **absent field → valid** (no flag day), and a dataset
without the key builds byte-identically. Choosing the lanes is an editorial
decision governed by the sourcing-rules skill ("Thread taxonomies are a
reading") — decide and record it per repo before tagging events. The swimlane
renderer is a follow-up (core#23 → #22); until it ships the field is inert in
the build.

## Glossary cross-links (optional, off by default)

Prose fields can link into the shared **Cronologia glossary**
(`https://cronologia.github.io/glossary/<term-id>/`) instead of re-explaining a
term, using an inline marker:

- `[[term-id]]` — link whose visible text is the id (e.g. `[[schism]]`).
- `[[term-id|visible text]]` — link with custom visible text
  (e.g. `[[latae-sententiae|latae sententiae]]`).

`term-id` is a glossary slug (`[a-z0-9]` then `[a-z0-9-]*`). Markers are
expanded **after** HTML-escaping and only when a `[[` is present, so a field
with no marker renders byte-for-byte identically to a build without the feature
(the same opt-in contract as the visualizations above). Markers are honored in
the main prose fields: `facts[].value`, `events[].text`, `figures[].role` /
`.notes`, `organizations[].relation` / `.notes`, and `disambiguation.items[].text`.

**Validation is offline and deterministic.** `data/glossary-terms.json` is a
*pinned, vendored* copy of the glossary's term-id list — the build never fetches
it, matching this repo's no-network-in-build rule (only the out-of-band
`archive-refs.js` / `sync-glossary-terms.js` scripts touch the network).
`scripts/validate-data.js` scans every string field for `[[…]]` markers and
**fails the build** on any id not in that pinned list. Refresh the list after
the glossary changes and commit the diff:

```
node scripts/sync-glossary-terms.js                       # sibling ../glossary or the published raw JSON
node scripts/sync-glossary-terms.js ../glossary/data/glossary.json   # explicit local source
```

## Link-health checker (out-of-band / CI only)

The references ARE the product, so link-rot is tracked automatically.
`scripts/check-links.js` reads every `references[].url` and reports, per URL:
its HTTP status (a `HEAD` probe, falling back to a **ranged `GET`** when HEAD is
unsupported or blocked); whether it redirected, plus a **soft-404 heuristic**
(a redirect — or a 200 — whose page `<title>` no longer matches the reference's
declared title, or reads as a not-found/parking page, is flagged **SUSPECT**);
and whether an Internet Archive snapshot exists. A URL that is **dead or suspect
AND has no snapshot** is marked `priorityArchive` — top of the queue for
`scripts/archive-refs.js`.

- **It hits the live network, so it is NEVER part of the build** (the build is
  network-free). Run it out of band or in CI:
  `node scripts/check-links.js --json report.json --md issue.md`.
- **Politeness / semantics:** ≥ 1 request/second (global throttle), a
  User-Agent that names the project, bounded per-request timeout. `403`/`429`
  (and `5xx`/timeouts) are **INCONCLUSIVE, never "dead"** — many publishers
  block bots or HEAD; only real `4xx` (404/410/451…) count as dead.
- **It never edits `data/chronology.json`.** Fixing rot (correct the URL, or
  archive it) is a human decision.
- `.github/workflows/link-health.yml` runs it weekly on GitHub runners
  (`schedule` + `workflow_dispatch`) and opens/updates a **single** "Link health
  report" issue with the failures. Like `wayback.yml`, it runs in CI precisely
  so it never routes around a sandbox's egress policy (fsp ADR-0006).
- Offline helpers (title parsing, the soft-404 rule, status classification, the
  Wayback parser) are unit-tested in `test/link-health.test.js`.

## Working agreements

1. **Edit data, not output.** Change `data/chronology.json`, run
   `node build.js`, commit the regenerated `docs/` in the same change.
2. **Keep the build green.** `node scripts/validate-data.js`, `node --test`
   and `node build.js` must all pass; CI fails if `docs/` drifts.
3. **Cite every fact; flag every uncertainty; attribute every contested
   characterization.** The validator enforces non-empty `sources[]`.
4. **A merged PR is finished** — branch fresh from `main` for new work.

## Data quality & sourcing rules

The five rules of the `sourcing-rules` skill (cite or flag; attribute, don't
assert; sources span the spectrum; date every status; testimony is a
perspective) govern everything here. Subject-specific rules for THIS repo:

1. **Apparitions are REPORTED events.** The dataset records who reported what
   and when, and what Church authority ruled and when, citing the ruling
   document. It never asserts the supernatural claim as fact. Write
   "Sister Amália reports…", "devotional literature states…".
2. **Chaplet approval ≠ apparition approval.** The imprimatur/authorization
   devotional literature reports for 1931 concerns *publication of prayers
   and writings*; it is not a declaration of supernaturality. Never let one
   stand in for the other. As of the bootstrap (2026-08-05) NO Church
   judgment on the apparitions themselves has been located — if you find one,
   cite the document itself, not a retelling.
3. **The devotional chain is derivative.** Canção Nova, Coroa das Lágrimas
   Oficial, the blogs and both Wikipedias largely recycle one another without
   citing documents. Label provenance in `publisherNote`; prefer the
   Archdiocese of Campinas (primary), the congregation's own site
   (primary-adjacent — which, notably, omits Amália and the apparitions), and
   the Centro de Memória da Unicamp (academic).
4. **Dates from devotional literature stay `dateVerified: false`** with a
   `dateNote` saying exactly what attests them, until a primary or archival
   source is found. Record disagreements between sources in `dateNote`
   instead of resolving them. As of core#73 `dateNote` RENDERS, beneath the
   event, and is translatable — it is reader-facing prose, so every one needs
   an es and a pt entry in `data/i18n/`, not a private note to the next editor.
5. **Check `KEYWORDS.md` before searching** (name variants pt/es/fr/la, OCR
   traps, the Syracuse-1953 disambiguation that pollutes every English
   search), and pair every reported zero with a positive control.

**If this project derives a searchable corpus** from PDFs, captions or scans,
it ships a test beside the corpus asserting its SHAPE — nothing ending
mid-sentence, more than one content unit per source document, a size floor and
no runt files, no glyph doubling, and the field the corpus was built to mine
present on every record. A corpus that is silently 20% of itself answers
"never" to questions whose answer is not never; a positive control proves the
search worked, not that the corpus is entire. See
`core/adr/0006-derived-corpora-ship-an-integrity-test.md` and the reference
implementation in `cronologia/fsp` → `test/declaration-corpus.test.js`.
