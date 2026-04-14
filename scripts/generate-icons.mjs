import sharp from 'sharp';
import toIco from 'to-ico';
import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'public', 'icons', 'icon-512x512.png');

const iconSizes = [72, 96, 128, 144, 152, 192, 384];
const faviconSizes = [16, 32];

async function generate() {
  // Generate PWA icons
  for (const size of iconSizes) {
    const out = path.join(root, 'public', 'icons', `icon-${size}x${size}.png`);
    await sharp(src).resize(size, size).png().toFile(out);
    console.log(`Icon ${size}x${size}`);
  }

  // Generate favicon PNGs
  for (const size of faviconSizes) {
    const out = path.join(root, 'public', `favicon-${size}x${size}.png`);
    await sharp(src).resize(size, size).png().toFile(out);
    console.log(`Favicon PNG ${size}x${size}`);
  }

  // Generate favicon.ico (16 + 32)
  const buffers = await Promise.all(
    faviconSizes.map((size) => sharp(src).resize(size, size).png().toBuffer())
  );
  const ico = await toIco(buffers);
  await writeFile(path.join(root, 'public', 'favicon.ico'), ico);
  console.log('favicon.ico');
}

generate().catch(console.error);
