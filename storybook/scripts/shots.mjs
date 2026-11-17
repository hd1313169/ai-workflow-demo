#!/usr/bin/env node
/**
 * shots.mjs — Storybook 截圖驗證（spec: visual-verification）
 *
 *   npm run shots                       建置後截下全部 story 與 Docs 頁
 *   npm run shots -- pages-             只截 id 含「pages-」的 story
 *   npm run shots -- --no-build         沿用既有 storybook-static，不重新建置
 *   npm run shots -- --wait=2500        每個畫面載入後的等待毫秒數（預設 1200）
 *
 * 輸出：storybook/shots/<story-id>.png 與 storybook/shots/report.txt
 * 任一畫面有主控台錯誤、未捕捉例外、或資源載入失敗（HTTP >= 400 / 網路失敗）時以非零狀態結束。
 *
 * 不引入相依：以 Chrome DevTools Protocol 驅動本機 Edge／Chrome（Node 內建 WebSocket／fetch）。
 * 瀏覽器路徑自動偵測，可用環境變數 CHROME_PATH 覆寫。
 */
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync, statSync, mkdtempSync } from 'node:fs';
import { join, extname, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STATIC = join(ROOT, 'storybook-static');
const OUT = join(ROOT, 'shots');
const BASE = '/ai-workflow-demo'; // 模擬 GitHub Pages 子路徑
const VIEWPORT = { width: 1280, height: 800 };
const MAX_HEIGHT = 4000;

/* ---------- 參數 ---------- */
const args = process.argv.slice(2);
const noBuild = args.includes('--no-build');
const waitMs = Number((args.find((a) => a.startsWith('--wait=')) || '').split('=')[1]) || 1200;
const filter = args.find((a) => !a.startsWith('--')) || '';

/* ---------- 清理（任何結束路徑都會執行） ---------- */
const cleanups = [];
let cleaned = false;
function cleanup() {
  if (cleaned) return;
  cleaned = true;
  for (const fn of cleanups.reverse()) {
    try { fn(); } catch { /* 盡力清理 */ }
  }
}
process.on('SIGINT', () => { cleanup(); process.exit(130); });
process.on('exit', cleanup);

/* ---------- 1. 建置 ---------- */
function build() {
  console.log('shots: 建置 Storybook…');
  const r = spawnSync('npx', ['storybook', 'build', '-o', 'storybook-static', '--quiet'], {
    cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'], shell: process.platform === 'win32',
  });
  if (r.status !== 0) throw new Error('Storybook 建置失敗');
}

/* ---------- 2. 靜態伺服器（子路徑） ---------- */
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};
function serve() {
  return new Promise((ok) => {
    const server = createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (!p.startsWith(BASE)) { res.writeHead(404); return res.end(); }
      p = p.slice(BASE.length) || '/';
      let f = join(STATIC, p);
      if (!f.startsWith(STATIC)) { res.writeHead(403); return res.end(); }
      if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
      if (!existsSync(f)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': TYPES[extname(f)] || 'application/octet-stream' });
      res.end(readFileSync(f));
    });
    server.listen(0, '127.0.0.1', () => {
      cleanups.push(() => server.close());
      ok(`http://127.0.0.1:${server.address().port}${BASE}`);
    });
  });
}

/* ---------- 3. 瀏覽器 ---------- */
function findBrowser() {
  const env = process.env.CHROME_PATH;
  const pf = process.env['PROGRAMFILES'] || 'C:\\Program Files';
  const pf86 = process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)';
  const local = process.env.LOCALAPPDATA || '';
  const candidates = [
    env,
    `${pf86}\\Microsoft\\Edge\\Application\\msedge.exe`,
    `${pf}\\Microsoft\\Edge\\Application\\msedge.exe`,
    `${pf}\\Google\\Chrome\\Application\\chrome.exe`,
    `${pf86}\\Google\\Chrome\\Application\\chrome.exe`,
    `${local}\\Google\\Chrome\\Application\\chrome.exe`,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge',
  ].filter(Boolean);
  const hit = candidates.find((p) => existsSync(p));
  if (!hit) throw new Error('找不到 Edge／Chrome，請以 CHROME_PATH 指定瀏覽器路徑');
  return hit;
}

async function launchBrowser() {
  const dataDir = mkdtempSync(join(tmpdir(), 'sb-shots-'));
  const proc = spawn(findBrowser(), [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', '--mute-audio', `--user-data-dir=${dataDir}`, '--remote-debugging-port=0', 'about:blank',
  ], { stdio: 'ignore' });
  // 瀏覽器結束後才會釋放檔案鎖，刪除需重試
  cleanups.push(() => rmSync(dataDir, { recursive: true, force: true, maxRetries: 20, retryDelay: 250 }));
  // 備援：強制結束所有使用這個 user-data-dir 的程序。
  // Edge 啟動後可能把工作交給另一個程序，只結束 proc 的程序樹會漏掉，所以依命令列比對。
  cleanups.push(() => {
    if (process.platform === 'win32') {
      const ps = `Get-CimInstance Win32_Process | Where-Object { $_.ProcessId -ne $PID -and $_.Name -match '^(msedge|chrome)' -and $_.CommandLine -like '*${dataDir}*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`;
      spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps], { stdio: 'ignore' });
    } else if (proc.exitCode === null) {
      proc.kill('SIGKILL');
    }
  });

  // 瀏覽器啟動後把實際埠號寫在 DevToolsActivePort
  const portFile = join(dataDir, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await sleep(100);
  if (!existsSync(portFile)) throw new Error('瀏覽器未回報除錯埠');
  const port = readFileSync(portFile, 'utf8').split('\n')[0].trim();
  const { webSocketDebuggerUrl } = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  return connect(webSocketDebuggerUrl);
}

/* ---------- CDP 用戶端（flatten session） ---------- */
function connect(url) {
  return new Promise((ok, fail) => {
    const ws = new WebSocket(url);
    let id = 0;
    const pending = new Map();
    const listeners = new Set();
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
      } else if (msg.method) {
        for (const fn of listeners) fn(msg);
      }
    };
    ws.onerror = () => fail(new Error('無法連線瀏覽器除錯介面'));
    ws.onopen = () => {
      cleanups.push(() => ws.close());
      ok({
        send(method, params = {}, sessionId) {
          return new Promise((res, rej) => {
            const n = ++id;
            pending.set(n, { res, rej });
            ws.send(JSON.stringify({ id: n, method, params, ...(sessionId ? { sessionId } : {}) }));
          });
        },
        on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
      });
    };
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- 4. 截一個 story ---------- */
async function shoot(cdp, base, story) {
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => cdp.send(m, p, sessionId);
  const errors = [];
  const urls = new Map(); // requestId -> url，讓載入失敗能回報網址
  let loaded = false;

  const off = cdp.on((msg) => {
    if (msg.sessionId !== sessionId) return;
    const p = msg.params;
    switch (msg.method) {
      case 'Page.loadEventFired': loaded = true; break;
      case 'Network.requestWillBeSent': urls.set(p.requestId, p.request.url); break;
      case 'Runtime.exceptionThrown':
        errors.push(`例外: ${p.exceptionDetails.exception?.description?.split('\n')[0] || p.exceptionDetails.text}`);
        break;
      case 'Runtime.consoleAPICalled':
        if (p.type === 'error') errors.push(`console.error: ${p.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 300)}`);
        break;
      case 'Log.entryAdded':
        if (p.entry.level === 'error' && !/favicon/.test(p.entry.url || '')) errors.push(`log: ${p.entry.text.slice(0, 300)}`);
        break;
      case 'Network.responseReceived':
        if (p.response.status >= 400 && !/favicon/.test(p.response.url)) errors.push(`HTTP ${p.response.status}: ${p.response.url}`);
        break;
      case 'Network.loadingFailed':
        if (!p.canceled) errors.push(`載入失敗 ${p.errorText}: ${urls.get(p.requestId) || p.requestId}`);
        break;
    }
  });

  try {
    await Promise.all(['Page.enable', 'Runtime.enable', 'Network.enable', 'Log.enable'].map((m) => s(m)));
    await s('Emulation.setDeviceMetricsOverride', { ...VIEWPORT, deviceScaleFactor: 1, mobile: false });
    await s('Page.navigate', { url: `${base}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=${story.type === 'docs' ? 'docs' : 'story'}` });
    for (let t = 0; t < 150 && !loaded; t++) await sleep(100);
    if (!loaded) errors.push('逾時：15 秒內未完成載入');
    await sleep(waitMs);

    const { cssContentSize } = await s('Page.getLayoutMetrics');
    const height = Math.min(Math.max(Math.ceil(cssContentSize.height), VIEWPORT.height), MAX_HEIGHT);
    const { data } = await s('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: VIEWPORT.width, height, scale: 1 },
    });
    writeFileSync(join(OUT, `${story.id}.png`), Buffer.from(data, 'base64'));
  } finally {
    off();
    await cdp.send('Target.closeTarget', { targetId }).catch(() => {});
  }
  return [...new Set(errors)];
}

/* ---------- 主流程 ---------- */
async function main() {
  if (!noBuild) build();
  const indexFile = join(STATIC, 'index.json');
  if (!existsSync(indexFile)) throw new Error('找不到 storybook-static/index.json，請先建置（不要加 --no-build）');

  const stories = Object.values(JSON.parse(readFileSync(indexFile, 'utf8')).entries)
    .filter((e) => (e.type === 'story' || e.type === 'docs') && e.id.includes(filter));
  if (!stories.length) throw new Error(`沒有符合「${filter}」的 story`);

  // 只清掉上次的截圖與報告，保留資料夾
  mkdirSync(OUT, { recursive: true });
  for (const f of readdirSync(OUT)) if (/\.(png|txt)$/.test(f)) rmSync(join(OUT, f));

  const base = await serve();
  const cdp = await launchBrowser();
  console.log(`shots: ${stories.length} 個畫面${filter ? `（篩選「${filter}」）` : ''}，等待 ${waitMs}ms`);

  const results = [];
  for (const [i, st] of stories.entries()) {
    const errs = await shoot(cdp, base, st);
    results.push({ st, errs });
    console.log(`  ${errs.length ? 'FAIL' : ' ok '} ${String(i + 1).padStart(3)}/${stories.length}  ${st.id}`);
    for (const e of errs) console.log(`         ${e}`);
  }

  // 正常關閉瀏覽器（釋放暫存資料夾的檔案鎖）；失敗時由 cleanup 強制結束
  await Promise.race([cdp.send('Browser.close').catch(() => {}), sleep(3000)]);
  await sleep(500);

  const failed = results.filter((r) => r.errs.length);
  const lines = [
    `Storybook 截圖驗證報告  ${new Date().toISOString()}`,
    `篩選：${filter || '（全部）'}　畫面：${results.length}　錯誤畫面：${failed.length}`,
    '',
    ...results.flatMap(({ st, errs }) => [
      `${errs.length ? 'FAIL' : 'OK  '}  ${st.id}  （${st.title} / ${st.name}）`,
      ...errs.map((e) => `      ${e}`),
    ]),
  ];
  writeFileSync(join(OUT, 'report.txt'), lines.join('\n') + '\n');
  console.log(`\nshots: 截圖與報告 -> ${OUT}`);
  console.log(failed.length ? `shots: FAIL — ${failed.length} 個畫面有錯誤` : 'shots: OK — 全部畫面無錯誤');
  return failed.length ? 1 : 0;
}

main()
  .then((code) => { cleanup(); process.exit(code); })
  .catch((e) => { console.error(`shots: ${e.message}`); cleanup(); process.exit(1); });
