/*
 * Generates web-sized WebP versions of the portrait photos.
 *
 *   node tools/optimize-images.js
 *
 * Reads originals from src/assets/images/ and writes optimized copies to
 * src/assets/images/optimized/, which is the directory Home.jsx actually
 * globs. Originals are never modified or deleted — drop a new photo in the
 * source folder, re-run this, and it appears in the rotation.
 *
 * Straight-from-the-phone JPEGs were ~1.8 MB each and rendered into a circle
 * at most 400 CSS px wide. MAX_WIDTH covers that at 2x pixel density.
 */
import { readdir, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = path.join(ROOT, 'src/assets/images')
const OUT_DIR = path.join(SRC_DIR, 'optimized')

const MAX_WIDTH = 900
const QUALITY = 80
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png'])

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const entries = await readdir(SRC_DIR, { withFileTypes: true })
  const images = entries
    .filter((e) => e.isFile() && SOURCE_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort()

  if (images.length === 0) {
    console.log('No source images found in src/assets/images/')
    return
  }

  let totalBefore = 0
  let totalAfter = 0

  for (const name of images) {
    const inputPath = path.join(SRC_DIR, name)
    // Normalise the filename: phone exports contain spaces and parentheses,
    // which make for ugly and occasionally fragile asset URLs.
    const slug = path
      .basename(name, path.extname(name))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const outputPath = path.join(OUT_DIR, `${slug}.webp`)

    const before = (await stat(inputPath)).size

    await sharp(inputPath)
      .rotate() // honour EXIF orientation before we strip the metadata
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath)

    const after = (await stat(outputPath)).size
    totalBefore += before
    totalAfter += after

    const saved = (100 * (1 - after / before)).toFixed(0)
    console.log(`${name}\n  → optimized/${slug}.webp  ${kb(before)} → ${kb(after)}  (-${saved}%)`)
  }

  console.log(
    `\n${images.length} image(s): ${kb(totalBefore)} → ${kb(totalAfter)} ` +
      `(-${(100 * (1 - totalAfter / totalBefore)).toFixed(0)}%)`
  )
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
