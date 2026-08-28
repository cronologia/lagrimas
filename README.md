# lagrimas — Nossa Senhora das Lágrimas (Campinas, 1929–1930)

An open, source-referenced chronology of the **reported apparitions of Our
Lady of Tears (Nossa Senhora das Lágrimas)** to Sister Amália de Jesus
Flagelado (born Amália Aguirre, 1901–1977) in Campinas, São Paulo, Brazil,
and of the **Chaplet of Tears** devotion that grew from them.

Published at **https://cronologia.github.io/lagrimas/** (en / es / pt), part
of the [cronologia](https://github.com/cronologia) family of chronology
projects.

## Editorial stance

Apparitions are **reported** events with Church judgments. This dataset
records who reported what and when, and what Church authority has ruled and
when, citing the ruling document — it never asserts the supernatural claims
as fact. Two things are kept strictly separate:

- the **devotion's publications** (devotional literature reports a 1931
  authorization/imprimatur by Bishop Francisco de Campos Barreto — the
  document itself has not been located), and
- any **judgment on the apparitions themselves** — none has been located.

The one primary Church document in the dataset is the Archdiocese of
Campinas' decree of **16 June 2023** creating a study commission on Sister
Amália's possible "odor of sanctity", toward the *possible* opening of a
beatification cause. It makes no pronouncement on the apparitions.

## The two text pages

Beside the chronology the site publishes two subpages, in all three locales:

- **`/{lang}/chaplet/`** — the text of the Chaplet of Tears, quoted in
  Portuguese with a working translation, laid out to be prayed straight
  through: seven groups, each with a meditation and both invocations as they
  are said. It is here because the imprimatur of 8 March 1932 and the four
  approvals abroad in 1935 are acts about *this text*, and a chronology that
  dates them should show what they were about. Reproducing it is not endorsing
  the claim behind it, and the page says so. The meditations are the project
  editor's own composition and are marked as such at every group.
- **`/{lang}/novena/`** — a nine-day arrangement of the chaplet, one sorrow of
  Mary at a time. The nine-day practice is attested by devotional literature
  and a printed novena already exists (Vozes, 2023); the arrangement itself is
  this site's own composition, carries no approval and says so on the page.

Every section of both pages declares its provenance: `sources[]` when someone
else transmits it, a rendered `basis` when it was composed here. The validator
refuses a section with neither.

## Layout

```
data/chronology.json   SOURCE OF TRUTH (hand-edited, English)
data/i18n/{es,pt}.json translation dictionaries (hand-authored, committed)
build.js               zero-dependency compiler -> docs/{en,es,pt}/
docs/                  compiled output, served by GitHub Pages (committed)
```

## Working on this repo

Read `AGENTS.md` and `context.md` first. Every data edit goes through the
gate:

```
node scripts/validate-data.js && node --test && node build.js
```

and commits the regenerated `docs/` together with the data.
