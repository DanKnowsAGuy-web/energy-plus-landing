import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const url = process.argv[2] || 'http://localhost:4321/';
mkdirSync('.screens', { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }); // motion ON
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600); // let hero calibration + scan finish
await page.screenshot({ path: '.screens/mo-hero.png' });

const shoot = async (sel, name, wait = 1800) => {
  try {
    await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'start' }), sel);
    await page.waitForTimeout(wait);
    await page.screenshot({ path: `.screens/mo-${name}.png` }); // viewport
    console.log('shot', name);
  } catch (e) { console.log('FAIL', name, e.message.split('\n')[0]); }
};
await shoot('.dose', 'glp1');
await shoot('#array', 'array');
await shoot('.card', 'pricing');
await page.mouse.move(720, 200); await page.waitForTimeout(300);
console.log('CONSOLE ERRORS:', errors.length ? JSON.stringify(errors.slice(0,8)) : 'none');
await browser.close();
