import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '../public/icons/miniacademy-source.png');
const publicDir = join(__dirname, '../public');
const iconsDir = join(publicDir, 'icons');

const sizes = [
  { file: join(iconsDir, 'icon-192.png'), size: 192 },
  { file: join(iconsDir, 'icon-512.png'), size: 512 },
  { file: join(iconsDir, 'apple-touch-icon.png'), size: 180 },
  { file: join(publicDir, 'favicon-32.png'), size: 32 },
  { file: join(publicDir, 'favicon-16.png'), size: 16 },
];

for (const { file, size } of sizes) {
  await sharp(src)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png()
    .toFile(file);
  console.log('Created', file);
}

// Multi-size favicon.ico substitute: use 32px as primary favicon png
await sharp(src).resize(48, 48, { fit: 'cover', position: 'centre' }).png().toFile(join(publicDir, 'favicon.png'));
