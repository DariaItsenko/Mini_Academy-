/**
 * Build square PWA/favicon assets from the portrait MiniAcademy logo.
 * Crops tighter on the MA mark + wordmark so the icon reads larger on home screens.
 */
import sharp from 'sharp';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');
const iconsDir = join(publicDir, 'icons');

const SOURCE =
  process.argv[2] ||
  join(
    iconsDir,
    'miniacademy-source.png'
  );

async function buildSquareBuffer() {
  const meta = await sharp(SOURCE).metadata();
  const w = meta.width ?? 682;
  const h = meta.height ?? 1024;
  // Center crop: square spanning most of the logo block (not full portrait padding).
  const size = Math.min(w, Math.round(h * 0.78));
  const left = Math.max(0, Math.floor((w - size) / 2));
  const top = Math.max(0, Math.floor(h * 0.06));

  return sharp(SOURCE)
    .extract({ left, top, width: size, height: size })
    .resize(1024, 1024, { fit: 'fill' })
    .png()
    .toBuffer();
}

async function writeIcon(buffer, outPath, size) {
  await sharp(buffer).resize(size, size).png().toFile(outPath);
}

async function main() {
  copyFileSync(SOURCE, join(iconsDir, 'miniacademy-source.png'));
  copyFileSync(SOURCE, join(publicDir, 'logo.png'));

  const square = await buildSquareBuffer();

  const outputs = [
    [join(publicDir, 'icons/icon-512.png'), 512],
    [join(publicDir, 'icons/icon-192.png'), 192],
    [join(publicDir, 'icons/apple-touch-icon.png'), 180],
    [join(publicDir, 'favicon-32.png'), 32],
    [join(publicDir, 'favicon-16.png'), 16],
    [join(publicDir, 'favicon.png'), 32],
    [join(publicDir, 'logo-square.png'), 512],
  ];

  for (const [path, size] of outputs) {
    await writeIcon(square, path, size);
  }

  console.log('Icons generated from', SOURCE);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
