import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcImage = path.join(root, 'public', 'titre-ronds.png');
const outDir = path.join(root, 'public', 'splash');

const splashSizes = [
  [640, 1136],
  [750, 1334],
  [828, 1792],
  [1125, 2436],
  [1170, 2532],
  [1179, 2556],
  [1284, 2778],
  [1290, 2796],
];

const BG_COLOR = { r: 242, g: 237, b: 227, alpha: 1 }; // #f2ede3

async function generate() {
  const srcMeta = await sharp(srcImage).metadata();
  const srcAspect = srcMeta.width / srcMeta.height;

  for (const [w, h] of splashSizes) {
    const targetW = Math.round(w * 0.8);
    const targetH = Math.round(targetW / srcAspect);
    const x = Math.round(w * 0.1);
    const y = Math.round(h * 0.4 - targetH * 0.5);

    const resized = await sharp(srcImage)
      .resize(targetW, targetH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    const outPath = path.join(outDir, `apple-splash-${w}-${h}.png`);

    await sharp({
      create: {
        width: w,
        height: h,
        channels: 4,
        background: BG_COLOR,
      },
    })
      .composite([{ input: resized, left: x, top: y }])
      .png()
      .toFile(outPath);

    console.log(`Generated ${w}x${h} (image: ${targetW}x${targetH}, pos: ${x},${y})`);
  }
}

generate().catch(console.error);
