#!/usr/bin/env node
// ramp.mjs - generate an even-looking colour ramp in OKLCH and print it as CSS variables.
//
//   node ramp.mjs --name graphite --hue 260 --chroma 0.006
//   node ramp.mjs --name accent   --hue 45  --chroma 0.15 --format json
//
// Why OKLCH: equal lightness steps look equal to the eye, which hand-picked hex values rarely do.
// Chroma is reduced automatically if a step falls outside the sRGB gamut.

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]);
    return acc;
  }, [])
);

if (args.help || args.hue === undefined) {
  console.log(`usage: node ramp.mjs --hue <0-360> [--chroma 0.01] [--name neutral] [--format css|json]
  neutral ramps use a chroma of 0.004-0.02; an accent uses 0.10-0.20.`);
  process.exit(args.help ? 0 : 1);
}

const hue = Number(args.hue);
const chroma = Number(args.chroma ?? 0.01);
const name = String(args.name ?? 'neutral');
const format = String(args.format ?? 'css');

// step -> OKLCH lightness. 50 is near white, 950 near black.
const STEPS = {
  50: 0.985, 100: 0.965, 200: 0.925, 300: 0.87, 400: 0.71, 500: 0.56,
  600: 0.45, 700: 0.37, 800: 0.27, 900: 0.205, 950: 0.145,
};

function oklchToLinearSrgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);
const toSrgb = (v) => {
  const c = Math.min(1, Math.max(0, v));
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
};
const toHex = (rgb) =>
  '#' + rgb.map((v) => Math.round(toSrgb(v) * 255).toString(16).padStart(2, '0')).join('');

function fit(L, C, h) {
  let c = C;
  let rgb = oklchToLinearSrgb(L, c, h);
  while (!inGamut(rgb) && c > 0) {
    c = Math.max(0, c - 0.002);
    rgb = oklchToLinearSrgb(L, c, h);
  }
  return { hex: toHex(rgb), chroma: c };
}

// WCAG relative luminance, so the output can state contrast against white and near-black.
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const out = {};
for (const [step, L] of Object.entries(STEPS)) {
  const { hex } = fit(L, chroma, hue);
  out[step] = {
    hex,
    onWhite: Number(ratio(hex, '#ffffff').toFixed(2)),
    onBlack: Number(ratio(hex, '#000000').toFixed(2)),
  };
}

if (format === 'json') {
  console.log(JSON.stringify(out, null, 2));
} else {
  console.log(`:root {`);
  for (const [step, v] of Object.entries(out)) {
    console.log(`  --${name}-${step}: ${v.hex}; /* ${v.onWhite}:1 on white, ${v.onBlack}:1 on black */`);
  }
  console.log(`}`);
}
