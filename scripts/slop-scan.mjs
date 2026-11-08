#!/usr/bin/env node
// slop-scan.mjs - static scan for the slop signs that code can find without judgment.
//
//   node slop-scan.mjs <path> [<path> ...] [--json] [--fail-on high|medium|none]
//
// Scans .html .css .scss .js .jsx .ts .tsx .vue .svelte .astro .md(x) files.
// Exit code 1 when a finding at or above --fail-on exists (default: high).
// A pattern match is a candidate, not a verdict: read the line before you fix it.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i > -1 ? argv[i + 1] : d; };
const paths = argv.filter((a, i) => !a.startsWith('--') && !(argv[i - 1] || '').startsWith('--fail-on'));
if (!paths.length) {
  console.error('usage: node slop-scan.mjs <path> [...] [--json] [--fail-on high|medium|none]');
  process.exit(2);
}

const EXT = new Set(['.html', '.css', '.scss', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro', '.md', '.mdx']);
const SKIP = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'out', '.turbo', 'coverage']);

// severity: high = almost always slop, medium = usually slop, low = look at it.
// area: the unslop pass that fixes it.
const RULES = [
  // colour
  { id: 'hue-gradient', sev: 'high', area: 'colour',
    re: /\b(?:from|via|to)-(?:purple|violet|fuchsia|pink|indigo|blue|cyan|teal|rose)-\d{2,3}\b.*\b(?:from|via|to)-(?:purple|violet|fuchsia|pink|indigo|blue|cyan|teal|rose|orange|amber)-\d{2,3}\b/,
    msg: 'Hue-to-hue gradient. Use a flat surface from the neutral ramp.' },
  { id: 'css-hue-gradient', sev: 'high', area: 'colour',
    re: /(?:linear|radial|conic)-gradient\([^)]*(?:#(?:[89a-f][0-9a-f]){0,1}[0-9a-f]{3,6}|rgba?\([^)]*\))[^)]*,[^)]*(?:#[0-9a-f]{3,6}|rgba?\([^)]*\))/i,
    msg: 'CSS gradient with two colour stops. Check that it is a small tone shift inside one neutral, not hue to hue.', sev2: 'medium' },
  { id: 'gradient-text', sev: 'high', area: 'colour',
    re: /\bbg-clip-text\b|-webkit-background-clip\s*:\s*text|background-clip\s*:\s*text/,
    msg: 'Gradient or clipped text. Use a solid text colour.' },
  { id: 'colored-shadow', sev: 'high', area: 'colour',
    re: /\bshadow-(?:purple|violet|fuchsia|pink|indigo|blue|cyan|teal|rose|orange|amber|emerald|green|red|sky)-\d{2,3}(?:\/\d+)?\b/,
    msg: 'Coloured shadow or glow. Use a neutral shadow, or none on dark themes.' },
  { id: 'glow-shadow', sev: 'medium', area: 'colour',
    re: /box-shadow\s*:[^;]*0\s+0\s+\d{2,}px[^;]*(?:rgba?\(|#)/i,
    msg: 'Large zero-offset shadow, which reads as a glow.' },
  { id: 'backdrop-blur', sev: 'medium', area: 'colour',
    re: /\bbackdrop-blur(?:-\w+)?\b|backdrop-filter\s*:/,
    msg: 'Backdrop blur (glass). Allowed only for a header over scrolling content, with a reason.' },
  { id: 'blob-bg', sev: 'medium', area: 'visuals',
    re: /\bblur-(?:2xl|3xl|\[\d{2,3}px\])\b.*\bbg-(?:purple|violet|fuchsia|pink|indigo|blue|cyan)-\d{2,3}/,
    msg: 'Blurred colour blob behind content.' },
  { id: 'neon-border', sev: 'medium', area: 'colour',
    re: /\bborder-(?:purple|violet|fuchsia|pink|indigo|cyan|rose)-\d{2,3}\/\d+\b|hover:border-(?:purple|violet|fuchsia|pink|indigo|cyan|rose)-\d{2,3}/,
    msg: 'Coloured translucent border. Use a hairline from the ramp.' },

  // motion
  { id: 'loop-animation', sev: 'high', area: 'motion',
    re: /\banimate-(?:pulse|ping|bounce|spin)\b|animation(?:-iteration-count)?\s*:[^;]*\binfinite\b|\brepeat\s*:\s*(?:Infinity|-1)\b|\brepeatType\s*:/,
    msg: 'Looping animation. Keep it only where the thing is live (spinner while loading, a real status).' },
  { id: 'transition-all', sev: 'high', area: 'motion',
    re: /\btransition-all\b|transition\s*:\s*all\b/,
    msg: 'transition-all. Name the properties (transition-colors, transform, opacity).' },
  { id: 'hover-scale', sev: 'medium', area: 'motion',
    re: /\bhover:(?:-?scale-\[?[\d.]+\]?|-translate-y-\d+)\b/,
    msg: 'Hover lift or scale. Change surface or colour instead.' },
  { id: 'layout-anim', sev: 'medium', area: 'motion',
    re: /transition(?:-property)?\s*:[^;]*\b(?:width|height|top|left|right|bottom|margin|padding)\b/,
    msg: 'Animating a layout property. Animate transform or opacity.' },
  { id: 'bounce-spring', sev: 'low', area: 'motion',
    re: /type\s*:\s*['"]spring['"][^}]*bounce\s*:\s*(?:0\.[4-9]|[1-9])|\bease-\[cubic-bezier\([^)]*-\d/,
    msg: 'Bouncy spring or overshoot easing.' },
  { id: 'scroll-listener', sev: 'medium', area: 'motion',
    re: /addEventListener\(\s*['"]scroll['"]|\bonscroll\s*=|\bwindow\.scrollY\b.*(?:opacity|transform|style)/,
    msg: 'Animation driven by a scroll listener. Use ScrollTrigger, a CSS scroll timeline or IntersectionObserver.' },
  { id: 'banned-motion-lib', sev: 'medium', area: 'motion',
    re: /\bfrom\s+['"](?:aos|scrollreveal|typed\.js|vanta[^'"]*|react-tsparticles|tsparticles[^'"]*)['"]|animate\.css|hover\.css|magic\.css/,
    msg: 'Preset-effect library (AOS, ScrollReveal, Typed.js, Vanta, tsParticles, Animate.css). See references/motion.md.' },
  { id: 'no-reduced-motion', sev: 'high', area: 'motion', file: true,
    // evaluated per file below: has animation but never mentions reduced motion
    msg: 'Animation code in this file but no prefers-reduced-motion handling anywhere in it.' },

  // type
  { id: 'uppercase-tracked', sev: 'medium', area: 'type',
    re: /\buppercase\b[^"'`]*\btracking-(?:wide|wider|widest)\b|\btracking-(?:wide|wider|widest)\b[^"'`]*\buppercase\b|text-transform\s*:\s*uppercase[^}]*letter-spacing\s*:\s*0?\.\d+em/,
    msg: 'Uppercase label with wide tracking. Use sentence case.' },
  { id: 'heavy-heading', sev: 'medium', area: 'type',
    re: /\bfont-(?:bold|extrabold|black)\b[^"'`]*\btext-(?:2xl|3xl|4xl|5xl|6xl|7xl|8xl)\b|\btext-(?:2xl|3xl|4xl|5xl|6xl|7xl|8xl)\b[^"'`]*\bfont-(?:bold|extrabold|black)\b/,
    msg: 'Heavy heading weight. Use 400-600 and let size carry the hierarchy.' },
  { id: 'tight-small-text', sev: 'low', area: 'type',
    re: /\btext-(?:xs|sm)\b[^"'`]*\btracking-(?:tight|tighter)\b|\btracking-(?:tight|tighter)\b[^"'`]*\btext-(?:xs|sm)\b/,
    msg: 'Negative tracking on small text.' },
  { id: 'italic-emphasis', sev: 'low', area: 'type', re: /<(?:em|i)>|\bitalic\b/, msg: 'Italic. Check it is not used for emphasis.' },
  { id: 'default-font-only', sev: 'low', area: 'type',
    re: /font-family\s*:\s*['"]?(?:Inter|Roboto|Poppins|Space Grotesk|Arial)\b[^;]*;/i,
    msg: 'Common default font. Fine if chosen for the product, slop if it was never decided. See references/fonts.md.' },

  // copy
  { id: 'emoji-ui', sev: 'high', area: 'icons',
    re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2705}\u{274C}]/u,
    msg: 'Emoji in the interface. Use a line icon from one set.' },
  { id: 'greeting-headline', sev: 'high', area: 'copy',
    re: /Welcome back,?\s|Hey there|Hi there,?\s*(?:[A-Z]|\{)/i,
    msg: 'Greeting headline. Name the context instead (page, period).' },
  { id: 'exclamation-ui', sev: 'medium', area: 'copy',
    re: />\s*[A-Z][^<>{}\n]{2,60}!\s*</,
    msg: 'Exclamation mark in interface text.' },
  { id: 'hype-words', sev: 'high', area: 'copy',
    re: /\b(?:supercharge[sd]?|seamless(?:ly)?|unlock(?:s|ed)?\s+the\s+power|revolutioni[sz]e[sd]?|game[- ]chang(?:er|ing)|next[- ]gen(?:eration)?|cutting[- ]edge|state[- ]of[- ]the[- ]art|elevate\s+your|take\s+your\s+\w+\s+to\s+the\s+next\s+level|magic(?:al)?|effortless(?:ly)?|10x|AI[- ]powered)\b/i,
    msg: 'Hype wording. Say what the product does, in plain words.' },
  { id: 'unverified-claim', sev: 'medium', area: 'copy',
    re: /\b(?:loved|trusted)\s+by\s+[\d,]+\+?|\b[\d,]+\+?\s+(?:happy\s+)?(?:customers|clients|teams|users)\b|\b#1\b|\bbest[- ]in[- ]class\b/i,
    msg: 'Claim that must be confirmed as real by the client, otherwise remove it.' },
  { id: 'placeholder-data', sev: 'high', area: 'copy',
    re: /\bLorem ipsum\b|\bJohn Doe\b|\bJane Doe\b|\$?123,456|\bexample@example\.com\b|\[X\]|\bYour (?:Company|Name) Here\b|\bacme\s+(?:corp|inc)\b/i,
    msg: 'Placeholder content. Use plausible, real-looking data.' },
  { id: 'fake-testimonial', sev: 'medium', area: 'copy',
    re: /unsplash\.com\/photo|randomuser\.me|i\.pravatar\.cc|ui-avatars\.com/i,
    msg: 'Stock or random avatar. If it sits next to a testimonial, check the person is real.' },
  { id: 'placeholder-badge', sev: 'low', area: 'copy',
    re: />\s*(?:New|Beta|Pro|PRO|Hot|Popular)\s*(?:✨|🚀|🔥)?\s*</,
    msg: 'Badge. Keep only if the product really needs it, as quiet text.' },

  // spacing and layout
  { id: 'arbitrary-spacing', sev: 'medium', area: 'spacing',
    re: /\b(?:m|p|mx|my|mt|mb|ml|mr|px|py|pt|pb|pl|pr|gap|space-x|space-y)-\[(?:\d+(?:\.\d+)?)px\]/,
    check: (m) => { const n = parseFloat(m[0].match(/\[(\d+(?:\.\d+)?)px\]/)[1]); return n % 4 !== 0; },
    msg: 'Arbitrary spacing value not on the 4px grid.' },
  { id: 'arbitrary-css-spacing', sev: 'low', area: 'spacing',
    re: /\b(?:margin|padding|gap|row-gap|column-gap)(?:-(?:top|right|bottom|left))?\s*:\s*(?:\d+px\s*){1,4}[;}]/,
    check: (m) => (m[0].match(/(\d+)px/g) || []).some((v) => parseInt(v, 10) % 4 !== 0 && parseInt(v, 10) !== 2 && parseInt(v, 10) !== 1),
    msg: 'CSS spacing value not a multiple of 4.' },
  { id: 'all-rounded-full', sev: 'low', area: 'details',
    re: /\brounded-full\b/, msg: 'Pill shape. Check it is used for a reason, not for everything.' },
  { id: 'huge-radius', sev: 'low', area: 'details',
    re: /\brounded-(?:3xl|\[(?:2[8-9]|[3-9]\d)px\])\b/, msg: 'Very large radius.' },
  { id: 'center-everything', sev: 'low', area: 'layout',
    re: /\btext-center\b[^"'`]*\bmx-auto\b[^"'`]*\bmax-w-/, msg: 'Centered stacked block. Fine for a short hero, a template default for anything else.' },

  // theme costume
  { id: 'snake-label', sev: 'high', area: 'copy',
    re: />\s*[A-Z][A-Z0-9]+(?:_[A-Z0-9&]+)+(?:\s[^<>{}\n]*)?</,
    msg: 'SNAKE_CASE label in the interface. Use plain sentence-case words.' },
  { id: 'snake-title', sev: 'high', area: 'copy',
    re: />\s*[\/>$#]?\s*[A-Z][a-z]+(?:_[A-Z][a-z]+)+\b[^<>{}\n]*</,
    msg: 'Title_Case_With_Underscores heading. Use the plain words a visitor would search for.' },
  { id: 'slash-prefix', sev: 'high', area: 'copy',
    re: />\s*\/\/\s*[A-Za-z\[]|>[^<>{}]*\s\/\/\s[A-Z_][^<>{}]*</,
    msg: '"//" used as a label separator or prefix. Remove, or keep one prompt glyph as the signature.' },
  { id: 'bracket-tag', sev: 'medium', area: 'copy',
    re: />\s*\[[A-Z][A-Z0-9_ ]{2,}\]\s/,
    msg: '[TAG] prefix on ordinary text.' },
  { id: 'mono-everywhere', sev: 'medium', area: 'type',
    re: /<(?:html|body|main)\b[^>]*\bfont-mono\b|(?:^|[\s,}])(?:html|body)\s*\{[^}]*font-family\s*:[^;}]*(?:monospace|\bmono\b|Courier|Consolas|Menlo)/i,
    msg: 'Monospace on the whole page. Use sans for reading text, mono for data only.' },
  { id: 'blink-cursor', sev: 'medium', area: 'motion',
    re: /@keyframes\s+(?:blink|caret|cursor|typing)|animate-\[?blink|\bcaret-blink\b|animation[^;]*\b(?:blink|typing)\b/i,
    msg: 'Blinking cursor or typing effect. Remove, or one static glyph as the signature.' },
  { id: 'self-badge', sev: 'medium', area: 'copy',
    re: />\s*(?:VERIFIED|ACTIVE|AUTHENTICATED|LAB[_ ]VERIFIED|CLICK[_ ]TO[_ ][A-Z]+|STATUS:|ZERO [A-Z ]+)[^<]*</,
    msg: 'Self-assigned status badge. Show evidence instead, or keep one label for a real distinction.' },

  // a11y / quality (static part)
  { id: 'outline-none', sev: 'high', area: 'quality',
    re: /\boutline-none\b(?![^"'`]*\bfocus(?:-visible)?:)|outline\s*:\s*(?:none|0)\b(?![^}]*:focus)/,
    msg: 'Focus outline removed without a replacement focus style.' },
  { id: 'img-no-alt', sev: 'medium', area: 'quality',
    re: /<img\b(?![^>]*\balt=)[^>]*>/i, msg: 'Image without alt attribute.' },
  { id: 'img-no-size', sev: 'low', area: 'quality',
    re: /<img\b(?![^>]*\b(?:width|height)=)[^>]*>/i, msg: 'Image without width/height (layout shift).' },
  { id: 'div-button', sev: 'medium', area: 'quality',
    re: /<div\b[^>]*\bonClick\b|<span\b[^>]*\bonClick\b/, msg: 'Click handler on a non-interactive element. Use <button> or <a>.' },
  { id: 'small-text', sev: 'low', area: 'quality',
    re: /\btext-\[(?:[0-9]|10)px\]|font-size\s*:\s*(?:[0-9]|10)px/, msg: 'Text under 11px.' },
  { id: 'currency-format', sev: 'low', area: 'india',
    re: /toLocaleString\(\s*['"]en-US['"]|Intl\.NumberFormat\(\s*['"]en-US['"][^)]*INR|\$\{?\s*[\d,.]+\s*\}?\s*(?:\/mo|per month)/i,
    msg: 'Check number and currency format. Indian audience: en-IN grouping and the rupee sign.' },
];

const ANIM_HINT = /\b(?:gsap|ScrollTrigger|framer-motion|from\s+['"]motion|motion\.\w+|animate-\w+|@keyframes|transition(?:-\w+)?\s*:|\banimation\s*:)/;
const RM_HINT = /prefers-reduced-motion|useReducedMotion|reducedMotion|motion-reduce:|motion-safe:|matchMedia\([^)]*reduce/;

function walk(p, acc = []) {
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const f of readdirSync(p)) if (!SKIP.has(f)) walk(join(p, f), acc);
  } else if (EXT.has(extname(p))) acc.push(p);
  return acc;
}

const files = paths.flatMap((p) => walk(p));
const findings = [];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');

  lines.forEach((line, i) => {
    if (line.length > 2000) return; // minified
    for (const r of RULES) {
      if (!r.re) continue;
      const m = line.match(r.re);
      if (!m) continue;
      if (r.check && !r.check(m)) continue;
      findings.push({ file, line: i + 1, id: r.id, sev: r.sev2 || r.sev, area: r.area, msg: r.msg, text: line.trim().slice(0, 160) });
    }
  });

  if (ANIM_HINT.test(text) && !RM_HINT.test(text) && /\.(?:jsx?|tsx?|vue|svelte|astro|html|css|scss)$/.test(file)) {
    const r = RULES.find((x) => x.id === 'no-reduced-motion');
    // only flag when there is real animation, not a single colour transition
    const real = /\b(?:gsap|ScrollTrigger|framer-motion|from\s+['"]motion|@keyframes|animate-(?:pulse|ping|bounce|spin)|animation\s*:)/.test(text);
    if (real) findings.push({ file, line: 1, id: r.id, sev: r.sev, area: r.area, msg: r.msg, text: '(file-level)' });
  }
}

// Two animation libraries in the same file usually means two animators on the same elements.
// Mixing libraries across sections is fine; inside one component, check they never touch the same element.
for (const file of files) {
  if (!/\.(?:jsx?|tsx?|vue|svelte|astro|html)$/.test(file)) continue;
  const text = readFileSync(file, 'utf8');
  const libs = [];
  if (/from\s+['"]gsap|gsap\.(?:to|from|timeline|set)\b|cdnjs[^'"]*gsap/.test(text)) libs.push('GSAP');
  if (/from\s+['"](?:motion|motion\/react|framer-motion)['"]/.test(text)) libs.push('Motion');
  if (/from\s+['"]animejs?['"]|anime\(/.test(text)) libs.push('Anime.js');
  if (/from\s+['"]@react-spring/.test(text)) libs.push('React Spring');
  if (libs.length > 1) {
    findings.push({ file, line: 1, id: 'multi-animator', sev: 'medium', area: 'motion',
      msg: `Two animation libraries in one file (${libs.join(', ')}). Fine across sections; inside one component make sure they never animate the same element.`, text: '(file-level)' });
  }
}

const order = { high: 0, medium: 1, low: 2 };
findings.sort((a, b) => order[a.sev] - order[b.sev] || a.file.localeCompare(b.file) || a.line - b.line);

if (flag('json')) {
  console.log(JSON.stringify({ files: files.length, count: findings.length, findings }, null, 2));
} else {
  const cwd = process.cwd();
  for (const f of findings) {
    console.log(`${f.sev.toUpperCase().padEnd(6)} ${f.id.padEnd(22)} ${relative(cwd, f.file)}:${f.line}`);
    console.log(`       ${f.msg}`);
    if (f.text !== '(file-level)') console.log(`       > ${f.text}`);
  }
  const by = (s) => findings.filter((f) => f.sev === s).length;
  console.log(`\n${files.length} files scanned, ${findings.length} findings (high ${by('high')}, medium ${by('medium')}, low ${by('low')})`);
  console.log('Matches are candidates. A clean scan does not mean the design is good.');
}

const failOn = opt('fail-on', 'high');
const fail = failOn === 'none' ? false : findings.some((f) => order[f.sev] <= order[failOn]);
process.exit(fail ? 1 : 0);
