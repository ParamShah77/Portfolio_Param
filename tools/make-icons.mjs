/**
 * Renders public/favicon.svg into the raster icons browsers actually ask for:
 * an apple-touch-icon for iOS home screens, plus the two PWA manifest sizes.
 *
 *   node tools/make-icons.mjs
 *
 * Re-run whenever favicon.svg changes.
 */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url));

const targets = [
  ['../public/apple-touch-icon.png', 180],
  ['../public/icon-192.png', 192],
  ['../public/icon-512.png', 512],
];

for (const [rel, size] of targets) {
  const out = new URL(rel, import.meta.url);
  // density high enough that the 64-unit viewBox rasterises cleanly at 512
  await sharp(svg, { density: 512 }).resize(size, size).png().toFile(out.pathname.replace(/^\//, ''));
  console.log(`wrote ${rel.replace('../', '')} (${size}x${size})`);
}
