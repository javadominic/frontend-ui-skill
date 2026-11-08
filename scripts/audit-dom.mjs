#!/usr/bin/env node
// audit-dom.mjs - render a page and measure what source code cannot show.
//
//   node audit-dom.mjs <url-or-file> [--out ./ui-audit] [--selector "#dashboard"] [--json]
//
// Needs Playwright (npm i -D playwright && npx playwright install chromium).
// --selector limits the checks to one area, for scope mode. Screenshots are always full page
// of the scoped element (or the whole page) at 375, 768 and 1440 wide.

import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const target = argv.find((a) => !a.startsWith('--') && !['--out', '--selector'].includes(argv[argv.indexOf(a) - 1]));
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i > -1 ? argv[i + 1] : d; };
if (!target) {
  console.error('usage: node audit-dom.mjs <url-or-file> [--out dir] [--selector css] [--json]');
  process.exit(2);
}
const outDir = resolve(opt('out', './ui-audit'));
const selector = opt('selector', null);
const url = /^https?:|^file:/.test(target) ? target : pathToFileURL(resolve(target)).href;

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  // ES imports ignore global installs, so look in the global node_modules before giving up.
  try {
    const { createRequire } = await import('node:module');
    const { execSync } = await import('node:child_process');
    const roots = [process.env.NODE_PATH, execSync('npm root -g', { encoding: 'utf8' }).trim(), '/opt/npm-tools/node_modules']
      .filter(Boolean).flatMap((p) => p.split(':'));
    for (const r of roots) {
      try { ({ chromium } = createRequire(r + '/').call ? createRequire(r + '/x.js')('playwright') : {}); if (chromium) break; } catch { /* next */ }
    }
  } catch { /* fall through */ }
  if (!chromium) {
    console.error('Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium');
    process.exit(2);
  }
}

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const WIDTHS = [375, 768, 1440];
const report = { url, selector, widths: {}, summary: [] };

// Runs inside the page. Keep it self-contained.
function measure(rootSelector) {
  const root = rootSelector ? document.querySelector(rootSelector) : document.body;
  if (!root) return { error: `selector not found: ${rootSelector}` };

  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = 1] = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);
    return { r, g, b, a };
  };
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const L = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const ratio = (a, b) => { const [hi, lo] = [L(a), L(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
  const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const bgOf = (el) => {
    let stack = [];
    for (let n = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; }
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (const c of stack.reverse()) base = blend(c, base);
    return base;
  };
  const selectorOf = (el) => {
    const id = el.id ? `#${el.id}` : '';
    const cls = (el.className && typeof el.className === 'string') ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    return `${el.tagName.toLowerCase()}${id}${cls}`.slice(0, 80);
  };

  const out = { contrast: [], touch: [], fonts: {}, offGrid: [], emoji: [], looping: [], smallText: [], overflowX: false, focusRing: { checked: 0, missing: 0 } };
  const emojiRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}]/u;
  const interactive = 'a[href],button,[role=button],input,select,textarea,summary,[tabindex]:not([tabindex="-1"])';

  const all = [root, ...root.querySelectorAll('*')];
  for (const el of all) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    // fonts
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length);
    if (hasText) out.fonts[fam] = (out.fonts[fam] || 0) + 1;

    if (hasText) {
      // contrast
      const fg = parse(cs.color);
      if (fg && fg.a > 0.05 && cs.backgroundImage === 'none') {
        const bg = bgOf(el);
        const eff = blend(fg, bg);
        const r = ratio(eff, bg);
        const size = parseFloat(cs.fontSize);
        const bold = parseInt(cs.fontWeight, 10) >= 700;
        const large = size >= 24 || (size >= 18.66 && bold);
        const need = large ? 3 : 4.5;
        if (r < need) out.contrast.push({ el: selectorOf(el), ratio: Number(r.toFixed(2)), need, size, text: el.textContent.trim().slice(0, 40) });
      }
      // text size
      if (parseFloat(cs.fontSize) < 11) out.smallText.push({ el: selectorOf(el), size: cs.fontSize });
      // emoji
      if (emojiRe.test(el.textContent) && [...el.childNodes].some((n) => n.nodeType === 3 && emojiRe.test(n.textContent))) {
        out.emoji.push({ el: selectorOf(el), text: el.textContent.trim().slice(0, 30) });
      }
    }

    // touch targets (WCAG 2.2 minimum is 24px; we require 44px on coarse-pointer widths, 32px otherwise)
    if (el.matches(interactive)) {
      const min = window.innerWidth <= 768 ? 44 : 32;
      if (rect.width < min || rect.height < min) {
        // inline links inside paragraphs are exempt from the size check
        const inline = el.tagName === 'A' && cs.display === 'inline';
        if (!inline) out.touch.push({ el: selectorOf(el), w: Math.round(rect.width), h: Math.round(rect.height), min });
      }
      out.focusRing.checked++;
    }

    // spacing grid: padding and gap on containers
    for (const p of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'rowGap', 'columnGap']) {
      const v = parseFloat(cs[p]);
      if (v > 0 && Math.round(v) % 4 !== 0 && ![1, 2, 6].includes(Math.round(v))) {
        out.offGrid.push({ el: selectorOf(el), prop: p, value: v });
      }
    }

    // looping animation
    if (cs.animationIterationCount === 'infinite' && cs.animationName !== 'none') {
      out.looping.push({ el: selectorOf(el), name: cs.animationName });
    }
  }

  out.overflowX = document.documentElement.scrollWidth > window.innerWidth + 1;
  out.fontFamilies = Object.keys(out.fonts).length;
  out.offGrid = out.offGrid.slice(0, 40);
  return out;
}

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' }).catch(() => page.goto(url));
  await page.waitForTimeout(400);
  report.widths[w] = await page.evaluate(measure, selector);

  // keyboard focus visibility on the first few interactive elements
  const focusable = await page.$$(selector ? `${selector} a[href], ${selector} button` : 'a[href], button');
  let missing = 0, checked = 0;
  for (const el of focusable.slice(0, 8)) {
    await el.focus();
    const visible = await el.evaluate((n) => {
      const cs = getComputedStyle(n);
      return (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || /rgba?\([^)]*\)\s+\d+px/.test(cs.boxShadow);
    });
    checked++;
    if (!visible) missing++;
  }
  if (report.widths[w] && !report.widths[w].error) report.widths[w].focusRing = { checked, missing };

  const shotTarget = selector ? await page.$(selector) : null;
  const file = `${outDir}/shot-${w}.png`;
  if (shotTarget) await shotTarget.screenshot({ path: file });
  else await page.screenshot({ path: file, fullPage: true });
  await ctx.close();
}

// reduced motion check: does anything still animate with the preference on?
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' }).catch(() => page.goto(url));
  report.reducedMotionStillLooping = await page.evaluate(() =>
    [...document.querySelectorAll('*')].filter((e) => {
      const c = getComputedStyle(e);
      return c.animationName !== 'none' && c.animationIterationCount === 'infinite';
    }).length);
  await ctx.close();
}
await browser.close();

// summary
const s = report.summary;
for (const w of WIDTHS) {
  const r = report.widths[w];
  if (!r || r.error) { s.push(`${w}px: ${r?.error || 'no result'}`); continue; }
  if (r.contrast.length) s.push(`${w}px: ${r.contrast.length} text elements below contrast (worst ${Math.min(...r.contrast.map((c) => c.ratio))}:1)`);
  if (r.touch.length) s.push(`${w}px: ${r.touch.length} controls smaller than ${r.touch[0].min}px`);
  if (r.overflowX) s.push(`${w}px: page scrolls sideways`);
  if (r.fontFamilies > 2) s.push(`${w}px: ${r.fontFamilies} font families in use (limit 2)`);
  if (r.emoji.length) s.push(`${w}px: ${r.emoji.length} emoji in text`);
  if (r.looping.length) s.push(`${w}px: ${r.looping.length} infinitely looping animations`);
  if (r.smallText.length) s.push(`${w}px: ${r.smallText.length} text elements under 11px`);
  if (r.offGrid.length) s.push(`${w}px: ${r.offGrid.length}+ spacing values off the 4px grid`);
  if (r.focusRing && r.focusRing.missing) s.push(`${w}px: ${r.focusRing.missing}/${r.focusRing.checked} sampled controls show no focus ring`);
}
if (report.reducedMotionStillLooping) s.push(`reduced motion on: ${report.reducedMotionStillLooping} elements still loop`);

if (argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(s.length ? s.join('\n') : 'No measurable problems found.');
  console.log(`\nScreenshots: ${outDir}/shot-375.png, shot-768.png, shot-1440.png`);
  console.log('Measured checks only. Look at the screenshots: hierarchy, taste and fit cannot be measured.');
}
