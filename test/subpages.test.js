'use strict';
/**
 * Documentary subpages (`pages[]`).
 *
 * The feature exists so a chronology of a devotion can SHOW the text every
 * dated act in it is about, and the risk it carries is not a broken link: it is
 * a page that reproduces a prayer and reads as if the site were praying it.
 * So the assertions here are mostly about provenance and about the seams —
 * where the two languages meet, where the site's own composition meets what
 * someone else transmits, and where a subpage's relative paths meet the locale
 * tree one directory up.
 *
 * The opt-in contract is checked too: with no `pages` key there must be no
 * route, no nav link and no sitemap entry, exactly as with the viz renderers.
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  subPages, routesFor, upTo, proseLines, renderPrayerBlock, renderPageSection,
  renderSubPage, renderPage, renderSitemap, langSwitcher, localizeData, loadDict,
  siteBase, LOCALES, UI,
} = require('../build.js');

const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'chronology.json'), 'utf8'));
const base = siteBase(data.meta);
const ui = UI.en;

/** The dataset minus its subpages — the "feature not used" state. */
function without() {
  const copy = JSON.parse(JSON.stringify(data));
  delete copy.pages;
  return copy;
}

test('upTo walks back to docs/ from any route depth', () => {
  assert.equal(upTo(''), '../');
  assert.equal(upTo('chaplet/'), '../../');
  assert.equal(upTo('a/b/'), '../../../');
});

test('the language switcher stays on the same route from a subpage', () => {
  const root = langSwitcher('', 'en', ui);
  assert.match(root, /href="\.\.\/es\/"/, 'the locale root must keep its one-level links');
  const sub = langSwitcher('chaplet/', 'en', ui);
  assert.match(sub, /href="\.\.\/\.\.\/es\/chaplet\/"/, 'a subpage must swap the locale and keep the page');
});

test('routes are derived from the declared pages, and vanish with them', () => {
  assert.deepEqual(routesFor(without()), ['']);
  assert.deepEqual(routesFor(data), [''].concat(data.pages.map((p) => `${p.id}/`)));
  const sitemap = renderSitemap(base, routesFor(data));
  for (const page of subPages(data)) {
    for (const lang of LOCALES) {
      assert.ok(sitemap.includes(`<loc>${base}${lang}/${page.id}/</loc>`), `sitemap missing ${lang}/${page.id}/`);
    }
  }
});

test('the chronology page links to the subpages, and is untouched without them', () => {
  const html = renderPage(data, {}, { lang: 'en', base, route: '' });
  for (const page of subPages(data)) {
    assert.ok(html.includes(`<a class="nav-page" href="${page.id}/">`), `no nav link to ${page.id}/`);
  }
  const bare = renderPage(without(), {}, { lang: 'en', base, route: '' });
  assert.ok(!bare.includes('nav-page'), 'a dataset with no pages must render no page links');
});

test('a prayer block quotes the original and labels the translation as working', () => {
  const html = renderPrayerBlock({
    kind: 'prayer', label: 'On the bead', original: 'Vêde, ó Jesus.', text: 'Behold, O Jesus.', sources: [],
  }, new Map(), ui, 'pt');
  assert.match(html, /<blockquote class="prayer-original" lang="pt">/);
  assert.ok(html.includes('Vêde, ó Jesus.'), 'the original must be reproduced verbatim');
  assert.ok(html.includes(ui.prayerGloss), 'the gloss must say it is a working translation');
});

test('the gloss disappears once localization has returned the original', () => {
  // What the Portuguese page does: the "translation" of a Portuguese prayer is
  // the prayer, and printing it twice would suggest two texts where there is one.
  const html = renderPrayerBlock({
    kind: 'prayer', original: 'Meu Jesus, ouvi os nossos rogos.', text: 'Meu Jesus, ouvi os nossos rogos.', sources: [],
  }, new Map(), UI.pt, 'pt');
  assert.ok(!html.includes('prayer-gloss'), 'an identical gloss must not be printed beside the original');
  assert.equal(html.match(/Meu Jesus, ouvi os nossos rogos\./g).length, 1);
});

test('a multi-line prayer keeps its lines', () => {
  assert.deepEqual(proseLines('a\n\nb\n'), ['a', 'b']);
  const html = renderPrayerBlock({ kind: 'prayer', original: 'Linha um.\nLinha dois.', sources: [] }, new Map(), ui, 'pt');
  assert.ok(html.includes('<p>Linha um.</p>'));
  assert.ok(html.includes('<p>Linha dois.</p>'));
});

test('a section always says what it rests on', () => {
  const cited = renderPageSection({
    id: 's', heading: 'H', sources: ['cancaonova-nsl'], blocks: [{ kind: 'note', text: 'x' }],
  }, new Map([['cancaonova-nsl', 7]]), ui, 'pt');
  assert.ok(cited.includes(ui.pageBasis));
  assert.match(cited, /href="#ref-7"/);

  const composed = renderPageSection({
    id: 's', heading: 'H', basis: 'Composed for this site.', blocks: [{ kind: 'note', text: 'x' }],
  }, new Map(), ui, 'pt');
  assert.ok(composed.includes('Composed for this site.'),
    'a section of the site\'s own composition must SAY so on the page, not in a note nobody opens');
});

test('every section of every declared page declares its provenance', () => {
  // The validator refuses the alternative; this pins it from the render side,
  // where a reader would meet it.
  for (const page of subPages(data)) {
    const html = renderSubPage(page, data, {}, { lang: 'en', base });
    for (const section of page.sections) {
      const cited = Array.isArray(section.sources) && section.sources.length > 0;
      assert.ok(cited || typeof section.basis === 'string' && section.basis.trim(),
        `${page.id}#${section.id}: neither cited nor declared as this site's own`);
      assert.ok(html.includes(`<section id="${section.id}">`), `${page.id}: section ${section.id} missing`);
    }
  }
});

test('a subpage cites site-wide reference numbers and pins the list to them', () => {
  const page = subPages(data).find((p) => p.id === 'chaplet');
  const html = renderSubPage(page, data, {}, { lang: 'en', base });
  const numById = new Map(data.references.map((r, i) => [r.id, i + 1]));
  const n = numById.get('cancaonova-nsl');
  assert.match(html, new RegExp(`href="#ref-${n}"`), 'a citation must use the site-wide number');
  assert.match(html, new RegExp(`<li id="ref-${n}" value="${n}">`),
    'the list marker must be pinned to the citation number, or a sparse list renumbers itself');
  // Only what the page cites, and nothing else.
  const listed = [...html.matchAll(/<li id="ref-(\d+)"/g)].map((m) => Number(m[1]));
  assert.ok(listed.length > 0 && listed.length < data.references.length,
    'a subpage lists the sources it cites, not the whole bibliography');
});

test('a subpage carries its own SEO identity and points home', () => {
  const page = subPages(data)[0];
  const html = renderSubPage(page, data, {}, { lang: 'en', base });
  assert.ok(html.includes(`<link rel="canonical" href="${base}en/${page.id}/">`));
  assert.ok(html.includes('"@type": "WebPage"'), 'a subpage is a WebPage, not a second WebSite');
  assert.ok(html.includes(`<title>${page.title}</title>`));
  assert.match(html, /<link rel="stylesheet" href="\.\.\/\.\.\/styles\.css">/);
  assert.match(html, /<a href="\.\.\/">/, 'a subpage must link back to the chronology');
});

test('the reproduced prayers survive localization untouched', () => {
  // `original` is outside TRANSLATABLE_KEYS on purpose: a prayer is not the
  // site's prose. If the walk ever starts translating it, the Spanish page
  // would print a Spanish "original" and the page would be lying about what it
  // reproduces.
  for (const lang of ['es', 'pt']) {
    const localized = localizeData(data, loadDict(lang), lang);
    for (const [i, page] of subPages(localized).entries()) {
      for (const [j, section] of page.sections.entries()) {
        for (const [k, block] of (section.blocks || []).entries()) {
          if (block.kind !== 'prayer') continue;
          assert.equal(block.original, data.pages[i].sections[j].blocks[k].original,
            `${lang}: pages[${i}].sections[${j}].blocks[${k}].original was translated`);
        }
      }
    }
  }
});

test('the Portuguese page prints each prayer once', () => {
  const localized = localizeData(data, loadDict('pt'), 'pt');
  for (const page of subPages(localized)) {
    const html = renderSubPage(page, localized, {}, { lang: 'pt', base });
    assert.ok(!html.includes('prayer-gloss'),
      `${page.id}: the pt page glosses a Portuguese prayer — its dictionary entry should be the original itself`);
  }
});
