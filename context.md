# context.md — domain background for lagrimas

Read together with `AGENTS.md`. This file carries the domain knowledge an
agent needs before editing data; the operating rules live in `AGENTS.md`.

## The subject in one paragraph

Amália Aguirre (Riós, Ourense, Galicia, Spain, 1901 – Taubaté, Brazil, 1977),
in religion Irmã Amália de Jesus Flagelado, was a member of the first group
of the Instituto das Missionárias de Jesus Crucificado, founded in Campinas,
São Paulo, in 1928 by Bishop Francisco de Campos Barreto and Maria Villac
(Madre Maria do Calvário). From 1928 she was reported to bear stigmata — a
sensation in the Brazilian press, immediately contested by physicians — and
from 1929–1930 to receive apparitions of Jesus ("Jesus Manietado", 8 November
1929) and of Mary presenting herself as "Nossa Senhora das Lágrimas" (8 March
and 8 April 1930), teaching the Chaplet (Coroa/Terço) of Tears and asking for
a medal. The chaplet became a widely practiced Brazilian devotion. In 2023
the Archdiocese of Campinas created a study commission on her possible "odor
of sanctity" toward the possible opening of a beatification cause.

## The source landscape (read before adding references)

- **Primary:** the Archdiocese of Campinas decree of 16 June 2023 (scanned
  PDF on the archdiocesan site; Livro XXXII dos Atos de Governo, Prot. 106).
  The ONLY primary Church document located during the bootstrap. Its recitals
  also attest her birth data, the 1928 founding, and the 1952 Decretum Laudis
  of Pius XII for the congregation.
- **Primary-adjacent:** the congregation's official history at
  mjc.org.br/nossa-historia — which, as consulted on 2026-08-05, recounts the
  founding WITHOUT mentioning Amália or the apparitions. That silence is
  itself a documented datum (see disambiguation).
- **Academic:** Centro de Memória da Unicamp, "O caso Amália de Jesus
  Flagelado: contexto e narrativa" — the 1928–29 press controversy, medical
  skepticism (Dr. Sousa Ribeiro's accusation against Barreto), and the 1929
  defense "Res Non Verba" by Arthur de Vasconcelos. CMU holds archival
  material on the case that has NOT been mined yet.
- **Devotional (derivative):** Canção Nova, Coroa das Lágrimas Oficial,
  Milícia da Imaculada, many blogs. They transmit the apparition narrative,
  the words attributed to Mary and Jesus, the 8-Nov-1929 / 8-Mar-1930 /
  8-Apr-1930 dates, and the 1931/1934/1935 approval claims — and cite no
  documents. They recycle one another; treat agreement among them as ONE
  attestation, not several.
- **Tertiary:** pt/en Wikipedia follow the devotional literature.

## What is established vs. what is only reported

| Claim | Status |
| --- | --- |
| Birth 22 Jul 1901, Riós | attested by the 2023 decree (primary) |
| Institute founded 1928 (3 May per the congregation) | congregation + decree agree; Unicamp says initiative 1927 — recorded in dateNote |
| Stigmata public from Nov 1928; press controversy | academic (Unicamp) |
| Apparitions 8 Nov 1929 / 8 Mar 1930 / 8 Apr 1930 | devotional literature only; `dateVerified: false` |
| Barreto recognition + imprimatur 8 Mar 1931 | devotional literature only; document NOT located |
| Episcopal declaration 20 Feb 1934; foreign imprimaturs 1935+ | devotional literature only; documents NOT located |
| Decretum Laudis 1952 (Pius XII) | attested by the 2023 decree |
| Death 18 Apr 1977, Taubaté | ACI Digital + Wikipedia; decree corroborates Taubaté competence; no primary record |
| Study commission 16 Jun 2023 | primary (the decree itself — read, not just cited) |

## Open questions for deep investigation

1. Locate the reported 1931 Barreto document (diocesan archive of Campinas;
   Centro de Memória da Unicamp; the Institute's archive) — or establish that
   the claim is untraceable beyond devotional retellings.
2. Same for the reported 20 Feb 1934 declaration and the foreign imprimaturs
   (Detroit 1935 and others named in devotional literature).
3. Maria Villac's death date; Amália's burial place; when and why Amália
   moved to Taubaté.
4. Whether the current Archdiocese has said anything about the apparitions
   as such (the 2023 decree does not), and how the annual celebrations at the
   Basílica do Carmo relate to official status (local press coverage exists
   but was bot-blocked during the bootstrap — acidadeon.com returned 403).
5. Mine the CMU archival collection references and the 1928–1930 Campinas
   press (Correio Popular etc.).

## Glossary and cross-links

The shared glossary (cronologia.github.io/glossary) currently has no entries
for imprimatur, beatification, private revelation or Decretum Laudis, so this
dataset uses no `[[term-id]]` links yet. If those terms land in the glossary,
sync `data/glossary-terms.json` and link them from the relevant prose.
