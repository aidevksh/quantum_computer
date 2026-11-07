/* React integration checks: build the Vite app, start its preview, and stop owned processes. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const origin = 'http://127.0.0.1:4173';
const chapters = ['start','waves','qubit','interference','entanglement','algorithm','scale','temperature','landscape','next'];
const errors = [];
let browser;
const build = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run','build'], { cwd:root, encoding:'utf8' });
process.stdout.write(build.stdout || '');
if (build.status !== 0) { process.stderr.write(build.stderr || 'Vite build failed'); process.exit(build.status || 1); }
const server = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'),'preview','--host','127.0.0.1','--port','4173','--strictPort'], { cwd: root, stdio: ['ignore','pipe','pipe'] });
let serverLog = '';
server.stdout.on('data', b => serverLog += b);
server.stderr.on('data', b => serverLog += b);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function ready() {
  for (let i=0; i<60; i++) {
    try {
      const response = await fetch(origin);
      if (response.ok && (await response.text()).includes('<div id="root">')) return;
    } catch { /* Wait for the server to bind. */ }
    await delay(100);
  }
  throw new Error('Local server did not become ready. ' + serverLog);
}
function monitor(page, name) {
  page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
  page.on('requestfailed', req => {
    if (req.url().startsWith(origin)) errors.push(`${name}: failed ${req.url()} ${req.failure()?.errorText}`);
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
  await reactRange(page.locator('#'+id),value);
}
async function reactRange(locator,value) {
  await locator.evaluate((el,value)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,String(value));el.dispatchEvent(new Event('input',{bubbles:true}));},value);
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
  await page.screenshot({path:path.join(root,'.local/react-desktop.png'),fullPage:true});
  for (const id of chapters) { await chapter(page,id); await noOverflow(page,'desktop '+id); }
  console.log('PASS: all 10 chapters, desktop navigation, and horizontal layout');

  assert.equal(await page.locator('.concept-film').count(),8,'eight mathematical films');
  assert.equal(await page.locator('[data-equation]').count(),14,'fourteen symbol explainers');
  const films=page.locator('.concept-film');
  for(let i=0;i<await films.count();i++){
    const film=films.nth(i), chapterId=await film.evaluate(el=>el.closest('[data-chapter]').dataset.chapter);
    await chapter(page,chapterId);
    await film.scrollIntoViewIfNeeded();
    const scrubber=film.locator('.film-controls:not(.film-dialog-controls) .film-scrubber input');
    const play=film.locator('.film-controls:not(.film-dialog-controls) .film-play');
    assert.equal(await play.getAttribute('aria-pressed'),'false','reduced motion starts paused');
    const diagram=film.locator('.film-stage svg');
    await reactRange(scrubber,0);await settle(page);const start=await diagram.innerHTML();
    await reactRange(scrubber,500);await settle(page);const middle=await diagram.innerHTML();
    await reactRange(scrubber,1000);await settle(page);const end=await diagram.innerHTML();
    assert.notEqual(start,middle,'first half changes diagram');assert.notEqual(middle,end,'second half changes diagram');
    assert.equal(await film.locator('.film-cues button[aria-pressed]').count(),4,'four narrative cues');
    const cueButtons=film.locator('.film-cues button[aria-pressed]');
    await cueButtons.first().click();const firstCaption=await film.locator('.film-narration:not(.film-dialog-narration) h3').innerText();
    await film.locator('button[aria-label="다음 설명 단계"]').click();assert.notEqual(await film.locator('.film-narration:not(.film-dialog-narration) h3').innerText(),firstCaption);
    await film.locator('button[aria-label="이전 설명 단계"]').click();assert.equal(await film.locator('.film-narration:not(.film-dialog-narration) h3').innerText(),firstCaption);
    await play.click();await page.waitForTimeout(180);assert.ok(Number(await scrubber.inputValue())>0,'play advances film');
    await play.click();const paused=await scrubber.inputValue();await page.waitForTimeout(100);assert.equal(await scrubber.inputValue(),paused,'pause holds timeline');
    await film.locator('.film-controls:not(.film-dialog-controls) select').selectOption('1.5');
    await film.locator('button[aria-label="처음부터 다시 재생"]').click();await page.waitForTimeout(100);assert.equal(await play.getAttribute('aria-pressed'),'true');await play.click();
  }
  console.log('PASS: eight continuous films, four cues each, reduced motion, seek, play/pause, speed and replay');
  let symbolCount=0;const miniKinds=new Set();
  for(const id of chapters){
    await chapter(page,id);
    const equations=page.locator(`[data-chapter="${id}"] [data-equation]`);
    for(let i=0;i<await equations.count();i++){
      const equation=equations.nth(i);
      await equation.evaluate(el=>{let parent=el.parentElement;while(parent){if(parent instanceof HTMLDetailsElement)parent.open=true;parent=parent.parentElement;}});
      assert.ok((await equation.locator('.eq-reading p').innerText()).trim(),'formula has spoken reading');
      const chips=equation.locator('.eq-symbol-list button');
      for(let j=0;j<await chips.count();j++){
        await chips.nth(j).click();symbolCount++;
        assert.equal(await chips.nth(j).getAttribute('aria-pressed'),'true');
        assert.equal(await equation.locator('.eq-definition-heading strong').innerText(),await chips.nth(j).locator('span').innerText());
        assert.ok((await equation.locator('.eq-definition-heading b').innerText()).trim(),'symbol name populated');
        assert.ok((await equation.locator('.eq-definition>p').innerText()).trim(),'symbol meaning populated');
        assert.ok((await equation.locator('.eq-example span').innerText()).trim(),'concrete example populated');
        const mini=equation.locator('.eq-mini');
        if(await mini.count()){
          const kind=await mini.getAttribute('class');
          if(!miniKinds.has(kind)){miniKinds.add(kind);const slider=mini.locator('input[type=range]');if(await slider.count()){const before=await mini.innerHTML();const next=await slider.evaluate(el=>Number(el.value)===Number(el.max)?Number(el.min):Number(el.max));await reactRange(slider,next);assert.notEqual(await mini.innerHTML(),before,'symbol mini-visual responds to its slider');}}
        }
      }
    }
  }
  assert.equal(symbolCount,await page.locator('.eq-symbol-list button').count(),'every symbol definition checked');
  assert.ok(symbolCount>=50,'substantial symbol coverage');
  assert.ok(miniKinds.size>=5,'at least five kinds of symbol mini-visuals checked');
  console.log(`PASS: all 14 formula explainers and ${symbolCount} symbol names, definitions, examples, and mini-visuals`);

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
  await page.screenshot({path:path.join(root,'.local/react-film.png'),fullPage:true});
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
  assert.ok(await page.locator('#sources-list .source-item a').count()>=63,'at least 63 source references');
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
  await mobile.screenshot({path:path.join(root,'.local/react-mobile.png'),fullPage:true});
  for(const id of chapters){await chapter(mobile,id,true);await noOverflow(mobile,'mobile '+id);}
  console.log('PASS: all 10 chapters on mobile, menu closes on navigation, no horizontal page overflow');

  await chapter(mobile,'qubit',true);
  const expand=mobile.locator('.film-expand:visible').first();
  await expand.click();const modal=mobile.locator('dialog[open]');await modal.waitFor();
  assert.equal(await mobile.evaluate(()=>document.body.style.overflow),'hidden');
  const stage=modal.locator('.film-dialog-stage');
  const beforeWidth=await stage.evaluate(el=>el.scrollWidth);
  await reactRange(modal.locator('input[aria-label="확대된 그림 배율"]'),1.5);
  assert.ok(await stage.evaluate(el=>el.scrollWidth)>beforeWidth,'zoom makes diagram larger');
  await reactRange(modal.locator('input[aria-label="확대 애니메이션 재생 위치"]'),750);
  assert.ok((await modal.locator('.film-narration h3').innerText()).trim());
  await stage.evaluate(el=>{el.scrollLeft=140;});assert.ok(await stage.evaluate(el=>el.scrollLeft)>0,'large mobile diagram pans');
  await mobile.keyboard.press('Escape');assert.equal(await mobile.locator('dialog[open]').count(),0);
  assert.equal(await mobile.evaluate(()=>document.body.style.overflow),'');
  assert.ok(await expand.evaluate(el=>el===document.activeElement),'focus returns to expand button');
  await mobile.setViewportSize({width:320,height:720});
  for(const id of chapters){await chapter(mobile,id,true);await noOverflow(mobile,'320px '+id);}
  console.log('PASS: native expanded dialog, zoom/pan/timeline, Escape/focus restoration, and 320px layout');
  assert.deepEqual(errors,[],'no browser errors or failed local resources');
  console.log('PASS: browser integration suite complete; screenshots: .local/react-{desktop,mobile,film}.png');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{
  if(browser) await browser.close();
  if(server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(resolve=>server.once('exit',resolve)),delay(1000)]);}
});
