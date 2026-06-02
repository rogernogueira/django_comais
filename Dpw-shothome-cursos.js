const { chromium } = require('playwright-core');
const EXE = 'C:\Users\roger\AppData\Local\ms-playwright\chromium-1161\chrome-win\chrome.exe';
(async () => {
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();

  try {
    await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1000);

    // Scroll to Cursos section
    await p.evaluate(() => window.scrollBy(0, 3500));
    await p.waitForTimeout(500);
    await p.screenshot({ path: 'D:\pw-shot\home-cursos.png' });
    console.log('✅ Screenshot home cursos salvo');

  } finally {
    await b.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
