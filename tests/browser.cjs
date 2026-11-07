/* Browser integration checks. Starts and stops its own local static server. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const origin = 'http://127.0.0.1:4173';
const chapters = ['start','waves','qubit','interference','entanglement','algorithm','scale','temperature','landscape','next'];
const errors = [];
let browser;
const server = spawn(process.execPath, [path.join(root, 'scripts/serve.cjs')], { cwd: root, stdio: ['ignore','pipe','pipe'] });
let serverLog = '';
server.stdout.on('data', b => serverLog += b);
server.stderr.on('data', b => serverLog += b);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function ready() {
  for (let i=0; i<60; i++) {
    try {
      const response = await fetch(origin);
      if (response.ok && (await response.text()).includes('title-start')) return;
    } catch { /* Wait for the server to bind. */ }
    await delay(100);
  }
  throw new Error('Local server did not become ready. ' + serverLog);
}
function monitor(page, name) {
  page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
  page.on('requestfailed', req => {
    if (req.url().startsWith(origin) || req.url().startsWith('file:')) errors.push(`${name}: failed ${req.url()} ${req.failure()?.errorText}`);
  });
  page.on('response', res => {
    if (res.url().startsWith(origin) && res.status() >= 400) errors.push(`${name}: HTTP ${res.status()} ${res.url()}`);
  });
}
async function settle(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function chapter(page, id, mobile=false) {
  if (mobile) await page.locator('#menu-toggle').click();
  await page.locator(`#chapter-nav a[data-page="${id}"]`).click();
  await page.locator(`[data-chapter="${id}"]`).waitFor({ state:'visible' });
  await settle(page);
  assert.equal(await page.locator('.chapter:visible').count(), 1, `${id}: exactly one chapter is visible`);
  assert.equal(await page.locator(`#chapter-nav a[data-page="${id}"]`).getAttribute('aria-current'), 'page');
  if (mobile) assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'), 'false');
}
async function noOverflow(page, label) {
  const measure = await page.evaluate(() => ({ width:innerWidth, scroll:document.documentElement.scrollWidth }));
  assert.ok(measure.scroll <= measure.width + 1, `${label}: horizontal overflow ${JSON.stringify(measure)}`);
}
async function range(page, id, value) {
  await page.locator('#'+id).evaluate((el, value) => { el.value=String(value); el.dispatchEvent(new Event('input',{bubbles:true})); }, value);
}
async function text(page, selector, pattern) {
  assert.match(await page.locator(selector).innerText(), pattern, selector);
}
async function probability(page, id, expected) {
  const values = await page.locator(`#${id} .prob-row b`).allTextContents();
  assert.deepEqual(values, expected.map(n=>`${n.toFixed(1)}%`), id);
}

(async () => {
  await ready();
  const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const executablePath = process.env.CHROME_PATH || (fs.existsSync(macChrome) ? macChrome : undefined);
  browser = await chromium.launch({ headless:true, ...(executablePath ? { executablePath } : {}) });
  const context = await browser.newContext({ viewport:{width:1440,height:1000}, reducedMotion:'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  monitor(page, 'desktop');
  await page.goto(origin, {waitUntil:'networkidle'});
  await settle(page);
  fs.mkdirSync(path.join(root,'.local'), {recursive:true});
  await page.screenshot({path:path.join(root,'.local/desktop.png'),fullPage:true});
  for (const id of chapters) { await chapter(page,id); await noOverflow(page,'desktop '+id); }
  console.log('PASS: all 10 chapters, desktop navigation, and horizontal layout');

  await chapter(page,'qubit');
  await page.locator('[data-qubit="0,0"]').click();
  await probability(page,'qubit-bars',[100,0]);
  await page.locator('#qubit-measure').click();
  await text(page,'#qubit-result',/총 1,000회.*0: 1,000회.*1: 0회/);
  await page.locator('[data-qubit="180,0"]').click();
  await probability(page,'qubit-bars',[0,100]);
  await page.locator('#qubit-measure').click();
  await text(page,'#qubit-result',/총 1,000회.*0: 0회.*1: 1,000회/);
  await page.locator('[data-qubit="90,0"]').click();
  await probability(page,'qubit-bars',[50,50]);
  await page.screenshot({path:path.join(root,'.local/qubit.png'),fullPage:true});
  await chapter(page,'interference');
  await page.locator('[data-phase="180"]').click();
  await probability(page,'interference-bars',[0,100]);
  await page.locator('#last-h').uncheck();
  await probability(page,'interference-bars',[50,50]);
  await page.locator('#last-h').check();
  await probability(page,'interference-bars',[0,100]);
  await chapter(page,'algorithm');
  await page.locator('#grover-reset').click();
  await page.locator('#grover-step').click();
  await text(page,'#grover-success',/^100%$/);
  await page.locator('#grover-measure').click();
  await text(page,'#grover-result',/11.*정답입니다/);
  await page.locator('#grover-step').click();
  await text(page,'#grover-success',/^25%$/);
  console.log('PASS: qubit preparations and 1,000 measurements, phase interference, Grover success and overshoot');

  await chapter(page,'entanglement');
  await page.locator('#bell-basis').selectOption('x');
  await page.locator('#bell-state').selectOption('classical');
  assert.deepEqual(await page.locator('#bell-bars .four-bar>span').allTextContents(),['25%','25%','25%','25%']);
  await page.locator('#bell-state').selectOption('bell');
  assert.deepEqual(await page.locator('#bell-bars .four-bar>span').allTextContents(),['50%','0%','0%','50%']);
  await page.locator('#bell-measure').click();
  await text(page,'#bell-result',/총 200쌍/);
  await chapter(page,'waves');
  await page.locator('#wave-fire').click();
  await text(page,'#wave-count',/200개/);
  await page.locator('#wave-reset').click();
  await text(page,'#wave-count',/0개/);
  await page.locator('#wave-mode').selectOption('whichpath');
  assert.ok(await page.locator('#wave-phase').isDisabled());
  await page.locator('#wave-mode').selectOption('interference');
  assert.ok(await page.locator('#wave-phase').isEnabled());
  await chapter(page,'scale');
  await range(page,'qubit-count',30);
  await text(page,'#state-count',/^1,073,741,824$/);
  await text(page,'#readout-bits',/^30비트$/);
  assert.equal(await page.locator('#state-grid>i').count(),256);
  await range(page,'noise-time',0);
  await probability(page,'noise-bars',[100,0]);
  await range(page,'noise-time',200);
  await probability(page,'noise-bars',[50.3,49.7]);
  await chapter(page,'temperature');
  await page.locator('[data-temp="0.015"]').click();
  await text(page,'#temperature-out',/^0\.015 K$/);
  await text(page,'#temperature-celsius',/−273\.135°C/);
  await page.locator('[data-temp="293.15"]').click();
  const roomK = parseFloat(await page.locator('#temperature-out').innerText());
  assert.ok(Math.abs(roomK-293.15)<2, 'room temperature preset survives slider quantization');
  console.log('PASS: Bell/classical X statistics, wave sampling, scale, dephasing, temperature controls');

  await chapter(page,'landscape');
  assert.ok(await page.locator('#landscape-list .institution').count()>=10);
  await page.locator('[data-filter="이온"]').click();
  assert.equal(await page.locator('[data-filter="이온"]').getAttribute('aria-pressed'),'true');
  const categories = await page.locator('.institution-category').allTextContents();
  assert.ok(categories.length>=2 && categories.every(s=>s.includes('이온')));
  await page.locator('[data-filter="all"]').click();
  await page.locator('#landscape-search').fill('IBM');
  assert.ok(await page.locator('#landscape-list .institution').count()>=1);
  await page.locator('#landscape-search').fill('결과가절대없어야하는검색어xyz');
  assert.equal(await page.locator('#landscape-list .institution').count(),0);
  await text(page,'.no-results',/일치하는 기관이 없습니다/);
  await page.locator('#landscape-search').fill('');
  await chapter(page,'next');
  assert.ok(await page.locator('#sources-list .source-item a').count()>=50,'at least 50 source references');
  assert.equal(await page.locator('.source-line').evaluateAll(els=>els.filter(el=>!el.querySelector('a')).length),0,'all chapter source lines populated');
  const answers=[false,true,false,true,false,true];
  for(let i=0;i<answers.length;i++) await page.locator('.quiz-question').nth(i).locator('.quiz-options button').nth(answers[i]?0:1).click();
  await text(page,'#quiz-score',/6 \/ 6문항 응답 · 6문항 정답/);
  assert.equal(await page.locator('.quiz-explanation').count(),6);
  await page.locator('#quiz-reset').click();
  assert.equal(await page.locator('.quiz-explanation').count(),0);
  await text(page,'#quiz-score',/각 문장이 맞는지/);
  await page.emulateMedia({media:'print'});
  await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
  await settle(page);
  assert.equal(await page.locator('.chapter:visible').count(),10,'all chapters appear for print');
  await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
  await page.emulateMedia({media:'screen'});
  assert.equal(await page.locator('.chapter:visible').count(),1);
  console.log('PASS: research filters/search, sources, six-question quiz/reset, complete print layout');

  const mobileContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const mobile=await mobileContext.newPage(); monitor(mobile,'mobile');
  await mobile.goto(origin,{waitUntil:'networkidle'});
  await settle(mobile);
  await mobile.screenshot({path:path.join(root,'.local/mobile.png'),fullPage:true});
  for(const id of chapters){await chapter(mobile,id,true);await noOverflow(mobile,'mobile '+id);}
  console.log('PASS: all 10 chapters on mobile, menu closes on navigation, no horizontal page overflow');

  const fileContext=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
  const filePage=await fileContext.newPage();monitor(filePage,'file');
  await filePage.goto(pathToFileURL(path.join(root,'index.html')).href+'#qubit',{waitUntil:'load'});
  await filePage.locator('[data-chapter="qubit"]').waitFor({state:'visible'});
  await settle(filePage);
  await filePage.locator('[data-qubit="0,0"]').click();
  await probability(filePage,'qubit-bars',[100,0]);
  assert.ok(await filePage.evaluate(()=>window.SOURCES.length>=29&&window.LANDSCAPE.length>=10));
  await chapter(filePage,'next');
  assert.ok(await filePage.locator('#sources-list .source-item').count()>=50);
  console.log('PASS: direct file:// opening, hash routing, local scripts, simulations, and source data');
  assert.deepEqual(errors,[],'no browser errors or failed local resources');
  console.log('PASS: browser integration suite complete; screenshots: .local/{desktop,mobile,qubit}.png');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{
  if(browser) await browser.close();
  if(server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(resolve=>server.once('exit',resolve)),delay(1000)]);}
});
