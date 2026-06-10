import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const url = process.argv[2] || 'http://localhost:4321/';
const W = Number(process.argv[3]) || 1440;
const pre = process.argv[4] || 'sec';
mkdirSync('.screens', { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const targets = [
  ['hero', '.hero'],
  ['problem', 'section.problem'],
  ['guide', '#what'],
  ['glp1', '#glp1'],
  ['how', '#how'],
  ['array', '#array'],
  ['precision', 'section.prec'],
  ['genes', 'section.genes'],
  ['pricing', '#enroll'],
  ['faq', '#faq'],
  ['footer', 'footer'],
];
for (const [name, sel] of targets) {
  const el = page.locator(sel).first();
  try { await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(150); await el.screenshot({ path: `.screens/${pre}-${name}.png` }); console.log('saved', name); }
  catch (e) { console.log('FAIL', name, e.message.split('\n')[0]); }
}
await browser.close();
