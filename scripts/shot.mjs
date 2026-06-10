// Headless screenshot helper. Works around the wedged in-app preview renderer.
// Usage: node scripts/shot.mjs [url] [tag]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] || 'http://localhost:4321/';
const tag = process.argv[3] || 'shot';
const outDir = '.screens';
mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce', // ensures reveal/stagger content is fully visible
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600); // let fonts settle
  const file = `${outDir}/${tag}-${vp.name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(`saved ${file}`);
  await ctx.close();
}
await browser.close();
