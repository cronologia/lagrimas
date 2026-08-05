# KEYWORDS — finding aid for lagrimas

Naming variants for searching corpora, archives and the web. **Listing a term
is not asserting it** — this is a finding aid, and it records spellings known
to appear in sources of any perspective. Accented and unaccented forms both
matter: OCRed Brazilian newspapers of the 1920s–30s frequently drop or mangle
diacritics, and pre-1943 Portuguese orthography differs ("Missionarias",
"Jesús Crucificado" in Spanish-language items).

## The devotion / title of Mary

| Language | Variants |
| --- | --- |
| pt | Nossa Senhora das Lágrimas; Nossa Senhora das Lagrimas; Coroa das Lágrimas; Terço das Lágrimas; Coroa de Nossa Senhora das Lágrimas; Medalha das Lágrimas |
| es | Nuestra Señora de las Lágrimas; Virgen de las Lágrimas; Corona de las Lágrimas; Rosario de las Lágrimas; Virgen Dolorosísima |
| fr | Notre-Dame des Larmes; Chapelet des Larmes; Rosaire des Larmes |
| la | Mater Dolorosa (adjacent title, not identical); Decretum Laudis (the 1952 recognition of the congregation) |
| en | Our Lady of Tears; Rosary/Chaplet/Crown of Tears |

Companion apparition figure (pt): **Jesus Manietado** (also "Jesus Manietado e
Chagado", "Jesús Maniatado" in es, "Jesus Bound" in en).

## The visionary

- Amália Aguirre (baptismal name; also misspelled "Amalia Aguirre",
  "Amelia Aguirre")
- Irmã Amália de Jesus Flagelado / Ir. Amália de Jesus Flagelado (religious
  name; es "Sor Amalia de Jesús Flagelado"; abbreviated "Amália, MJC")
- Born Riós, Ourense, Galicia (Spain) — sources also write "Ríos" and
  "Riós – Galiza"

## People and institutions

- Instituto das Missionárias de Jesus Crucificado; Congregação das
  Missionárias de Jesus Crucificado; sigla **MJC**; "Missionarias de Jesus
  Crucificado" (unaccented/old orthography)
- Dom Francisco de Campos Barreto (bishop of Campinas 1920–1941; also
  "D. Francisco de Campos Barreto", "Bispo de Campinas")
- Maria Villac / Madre Maria do Calvário (foundress)
- Dom João Inácio Müller ("Joao Inacio Muller"; archbishop, 2023 decree)
- Arquidiocese de Campinas (Diocese de Campinas before 1958)
- Centro de Memória da Unicamp (CMU) — archival holdings on the 1928–29 case
- "Res Non Verba" (Arthur de Vasconcelos, 1929 — contemporary defense)

## Disambiguation traps (terms that will pollute searches)

- **Madonna delle Lacrime / Our Lady of Tears of Syracuse (Sicily, 1953)** —
  a different case entirely; most international "Our Lady of Tears" hits are
  about Syracuse, not Campinas.
- **Nossa Senhora da Salette / La Salette** — "the weeping Virgin" of 1846,
  frequently conflated in devotional prose.
- **Nossa Senhora das Dores / Mater Dolorosa** — the general sorrowful-Mother
  title; overlaps in iconography, not the same devotion.

## Auto-caption manglings (from the three 2020s video transcripts)

These are what YouTube's Portuguese ASR does to the names in this case. They
are recorded as prose rather than as table rows on purpose: `corpus-index.py`
turns rows into query expansions, and feeding it "Maria" or "malha" as an alias
for Amália would poison every future sweep. Use them when reading a transcript,
never as search terms.

**Amália** comes out as *malha*, *mamária*, *amia*, *am*, *a irmã Maria* and
even *arma Amália*; the surname **Aguirre** as *guirri* ("Amália guirri").
**Villac** comes out as *Vilac*, *vilá*, *Villar* and — most often and most
confusingly — as *Bilac*, so that Madre Villac appears throughout as *amada
Bilac*, *Amado Vilac* or *Amado Bilac* (the ASR hears "a Madre Villac").
**Campos Barreto** survives mostly intact but the vocative collapses: *não
Barreto* and *toda Barreto* both mean "Dom Barreto", and *Barreiro* appears
once. **Jesus Manietado** appears as *Jesus maniado*, *Jesus maninhado* and
*Jesus manietado*. **Dom Lourenço Zeller** appears as *donzeller*, *donzel*,
*Donzela* and *do Lourenço zeller*. **Santa Sé** is almost never transcribed
correctly: it appears as *Santa Ceia*, *Santa Fé*, *Santa Ce* and *santa cela*,
which matters, because a sweep for "Santa Sé" over these transcripts returns
far fewer hits than the speaker actually produced. The **Hotel d'Europe**, the
Villac family property in which the convent was installed, is transcribed
*hotel dorope*. *Pagelas* is not a mangling: it is the Portuguese word for the
folded devotional leaflets Barreto had printed, and it is worth searching for.

## Archival and bibliographic leads (named in sources, not yet consulted)

Named out loud in the transcripts or in the academic literature, and not held
by this dataset. Listing them is not asserting that they contain anything.

- **Livro do Tombo, Arquivo da Arquidiocese de Campinas** (Cúria Metropolitana)
  — the acts-of-government series. Raphael Tonon states he has read the
  originals there. This is where a 1931/1932 episcopal act would be.
- **"A Missionária"** (also *"A Missionária de Jesus Crucificado"*) — the
  Institute's own periodical of the period, in which Tonon says Barreto
  authorised the sisters to publish the apparition narrative with the people
  involved reduced to initials. No holding library was identified.
- **Correio Popular** (Campinas, 1929) — quoted at length by Santos (2019),
  including Barreto's own description of the phenomena and a reference to an
  attestation by Dr. Falcão de Miranda "que se acha em poder de d. Barreto".
- **Nihil obstat nº 924/1935**, Ansgarus Borsiczky, diocesan censor, **Sopron**
  (Hungary) — the only protocol number any source attaches to any act in this
  case. Companion chanceries: Detroit, Győr, Munich and Freising.
- Barreto's editions of Sister Amália's notebooks: *Glórias e Poder de Nossa
  Senhora das Lágrimas*, *Licções de Jesus Victima* (modern spelling *Lições de
  Jesus Vítima*), *Do Presídio de Amor*. Santos (2019) records that the first
  disappeared from Catholic library holdings after 1941.
- Addresses in Campinas that recur in the transcripts: **Rua Benjamin Constant
  1344** (the Villac property, ex-Hotel d'Europe, where the apparitions are
  reported) and **Rua Senador Saraiva 85** (the Aguirre family home).
- **Pe. Rafael Capelato** — a Gregorian dissertation on Dom Barreto, per Tonon;
  Capelato is a coordinator of the 2023 archdiocesan commission.

## Known-zero / thin terms (as of 2026-08-05)

- "Decreto" + "8 de março de 1931" (the reported Barreto recognition):
  searches over the open web returned only devotional retellings, never the
  document — see the Bootstrap epic issue before treating this as absent
  everywhere (diocesan and congregational archives were NOT searched).
  Note that the date to search for may be wrong: Santos (2019) dates the
  imprimatur on the chaplet and medal to **8 de março de 1932**, and one
  devotional site and Tonon both give 1932 as well.
- **"Virgo Lacrimarum"**: the Archdiocese of Campinas published a note on the
  devotion to this title alongside the 16 June 2023 commission decree — its own
  article headline says so — but the article URL returned HTTP 404 on
  2026-08-05 after a site migration, the archdiocesan site's own search returns
  nothing for the phrase, no PDF of it was found under `wp-content/uploads`,
  and web.archive.org was rate-limited (429) on both attempts. The note's text,
  date and protocol number are therefore UNREAD, not absent.
- "Lourenço Zeller" + Campinas: the man is real and well documented as a
  Benedictine (b. Riedlingen 1873, titular bishop of Dorylæum 7 Jan 1939,
  d. Belém 1 Sep 1945, buried in the Rio monastery cloister), but nothing
  outside the three videos connects him to the Campinas case, to an apostolic
  visitation in 1935, or to a Holy Office decree.
- catholic-hierarchy.org URL for Barreto is `bcambar.html` (not `bbarr.html`);
  the site returned 429 during this pass, so allow for rate limiting.
