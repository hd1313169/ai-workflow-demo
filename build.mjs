#!/usr/bin/env node
/**
 * build.mjs — 專案建置腳本（純 Node 標準庫，無外部相依）
 *
 * 用法:
 *   node build.mjs tokens   從 design/tokens.json 產出 assets/css/tokens.css
 *   node build.mjs lint      掃描 tokens.css 以外的硬編色值，違規時以非零狀態結束
 *   node build.mjs lint-brand [dir]  依不進版控的禁用詞清單掃描識別資訊，命中時以非零狀態結束
 *   node build.mjs pages    將頁面的 <link>/<script src> 內嵌，輸出單一自足檔到 dist/
 *
 * 對應 openspec/specs/frontend-component-system/spec.md
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const p = (...s) => join(ROOT, ...s);

const TOKENS_JSON = p('design', 'tokens.json');
const TOKENS_CSS = p('assets', 'css', 'tokens.css');
const DIST = p('dist');

/* ----------------------------------------------------------------------------
 * tokens: design/tokens.json -> assets/css/tokens.css
 * tokens.json 為扁平結構，key = CSS 自訂屬性名（不含前綴 --），
 * value = { value, layer, figma? }。逐項輸出，確保每個 --… 可回溯。
 * ------------------------------------------------------------------------- */
function buildTokens() {
  const raw = JSON.parse(readFileSync(TOKENS_JSON, 'utf8'));
  const groups = { primitive: [], semantic: [], component: [] };
  for (const [name, def] of Object.entries(raw.tokens)) {
    const layer = def.layer || 'component';
    if (!groups[layer]) groups[layer] = [];
    groups[layer].push([name, def]);
  }
  const lines = [];
  lines.push('/* 由 build.mjs 從 design/tokens.json 產生 — 請勿手動編輯 */');
  lines.push('/* 重新產生： npm run build:tokens */');
  lines.push(':root {');
  for (const layer of ['primitive', 'semantic', 'component']) {
    const items = groups[layer] || [];
    if (!items.length) continue;
    lines.push(`\n  /* ===== ${layer} ===== */`);
    for (const [name, def] of items) {
      const tail = def.figma ? `  /* ${def.figma} */` : '';
      lines.push(`  --${name}: ${def.value};${tail}`);
    }
  }
  lines.push('}');
  writeFileSync(TOKENS_CSS, lines.join('\n') + '\n');
  console.log(`build:tokens  ->  ${rel(TOKENS_CSS)}  (${Object.keys(raw.tokens).length} tokens)`);
}

/* ----------------------------------------------------------------------------
 * lint: 掃描 tokens.css 以外的 .css/.html/.js 硬編色值
 * ------------------------------------------------------------------------- */
const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)/g;
const LINT_DIRS = ['assets', 'pages'];
const LINT_ROOT_FILES = ['index.html'];
const LINT_EXT = new Set(['.css', '.html', '.js', '.mjs']);
// 明確例外：唯一允許出現色值字面值的檔案（spec: design token 單一來源）
const LINT_ALLOW = new Set([
  'assets/css/tokens.css',
]);

function walk(dir, out = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === 'dist' || ent.name === '.git') continue;
      walk(full, out);
    } else if (LINT_EXT.has(ext(ent.name))) {
      out.push(full);
    }
  }
  return out;
}

function lint() {
  const files = [];
  for (const d of LINT_DIRS) if (existsSync(p(d))) walk(p(d), files);
  for (const f of LINT_ROOT_FILES) if (existsSync(p(f))) files.push(p(f));

  const hits = [];
  for (const file of files) {
    const relPath = rel(file).replace(/\\/g, '/');
    if (LINT_ALLOW.has(relPath)) continue;
    const src = readFileSync(file, 'utf8').split(/\r?\n/);
    src.forEach((line, i) => {
      // 略過整行註解，降低誤傷
      const trimmed = line.trim();
      if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('<!--')) return;
      const m = line.match(COLOR_RE);
      if (m) hits.push({ file: relPath, line: i + 1, matches: m });
    });
  }

  if (hits.length) {
    console.error(`lint:tokens  FAIL  — ${hits.length} 處硬編色值（僅 tokens.css 允許）:`);
    for (const h of hits) console.error(`  ${h.file}:${h.line}  ${h.matches.join(' ')}`);
    process.exit(1);
  }
  console.log(`lint:tokens  OK  — 掃描 ${files.length} 檔，無硬編色值`);
}

/* ----------------------------------------------------------------------------
 * lint-brand: 依禁用詞清單掃描識別資訊（spec: public-showcase-hygiene）
 *   node build.mjs lint-brand [目錄]   預設掃描專案根目錄
 *   清單來源：環境變數 BRAND_DENYLIST_FILE，否則 <專案根>/.brand-denylist.txt（不進版控）
 *   清單格式：一行一詞，# 開頭為註解；一般詞不分大小寫子字串比對；re: 開頭為正規式
 *   找不到清單或清單為空 -> 失敗（不得視為通過）
 * ------------------------------------------------------------------------- */
const BRAND_EXT = new Set(['.css', '.html', '.htm', '.js', '.mjs', '.cjs', '.json', '.md', '.mdx',
  '.yaml', '.yml', '.txt', '.svg', '.map', '.ts', '.tsx', '.jsx']);
const BRAND_SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.claude', 'storybook-static']);
const DENYLIST_NAME = '.brand-denylist.txt';

function loadDenylist() {
  const file = process.env.BRAND_DENYLIST_FILE || p(DENYLIST_NAME);
  if (!existsSync(file)) {
    console.error(`lint:brand  FAIL  — 找不到禁用詞清單（${DENYLIST_NAME} 或 BRAND_DENYLIST_FILE）`);
    process.exit(1);
  }
  const rules = [];
  for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const s = raw.trim();
    if (!s || s.startsWith('#')) continue;
    if (s.startsWith('re:')) rules.push({ re: new RegExp(s.slice(3), 'g') });
    else rules.push({ needle: s.toLowerCase() });
  }
  if (!rules.length) {
    console.error('lint:brand  FAIL  — 禁用詞清單為空');
    process.exit(1);
  }
  return { file: resolve(file), rules };
}

function walkBrand(dir, out = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (BRAND_SKIP_DIRS.has(ent.name)) continue;
      walkBrand(full, out);
    } else if (ent.name !== DENYLIST_NAME && BRAND_EXT.has(ext(ent.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

function lintBrand(target) {
  const { file: listFile, rules } = loadDenylist();
  const dir = resolve(target || ROOT);
  if (!existsSync(dir)) {
    console.error(`lint:brand  FAIL  — 掃描目錄不存在：${dir}`);
    process.exit(1);
  }
  const files = walkBrand(dir).filter((f) => resolve(f) !== listFile);
  let count = 0;
  for (const f of files) {
    const lines = readFileSync(f, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      const low = line.toLowerCase();
      for (const r of rules) {
        let hit = false;
        if (r.needle) hit = low.includes(r.needle);
        else { r.re.lastIndex = 0; hit = r.re.test(line); }
        if (hit) {
          count++;
          // 只列位置與規則序號，不回印命中內容，避免 CI log 洩漏禁用詞
          console.error(`  ${rel(f).replace(/\\/g, '/')}:${i + 1}  (rule #${rules.indexOf(r) + 1})`);
        }
      }
    });
  }
  if (count) {
    console.error(`lint:brand  FAIL  — ${count} 處命中（掃描 ${files.length} 檔）`);
    process.exit(1);
  }
  console.log(`lint:brand  OK  — 掃描 ${files.length} 檔，無識別資訊`);
}

/* ----------------------------------------------------------------------------
 * pages: 內嵌 <link rel=stylesheet> 與 <script src> -> dist/<page>.html
 * ------------------------------------------------------------------------- */
function inlineHtml(htmlPath) {
  const dir = dirname(htmlPath);
  let html = readFileSync(htmlPath, 'utf8');

  html = html.replace(
    /[ \t]*<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>\s*/gi,
    (whole, href) => {
      if (/^https?:/i.test(href)) return whole;
      const css = readFileSync(resolve(dir, href), 'utf8');
      // 內嵌時避免 CSS 內容出現 </style 提早關閉標籤
      return `<style>\n${css.replace(/<\/(style)/gi, '<\\/$1')}\n</style>\n`;
    }
  );

  html = html.replace(
    /[ \t]*<script\s+[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>\s*/gi,
    (whole, src) => {
      if (/^https?:/i.test(src)) return whole;
      const js = readFileSync(resolve(dir, src), 'utf8');
      // 內嵌時避免 JS 內容（字串或註解）出現 </script 提早關閉標籤
      return `<script>\n${js.replace(/<\/(script)/gi, '<\\/$1')}\n</script>\n`;
    }
  );

  return html;
}

function buildPages() {
  if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });
  const targets = [];
  if (existsSync(p('index.html'))) targets.push(p('index.html'));
  if (existsSync(p('pages'))) {
    for (const f of readdirSync(p('pages'))) {
      if (f.endsWith('.html') && !f.startsWith('_')) targets.push(p('pages', f));
    }
  }
  for (const t of targets) {
    const out = join(DIST, basename(t));
    writeFileSync(out, inlineHtml(t));
    console.log(`build  ->  ${rel(out)}`);
  }
  console.log(`build  完成 — ${targets.length} 頁（單一自足檔，可於 file:// 開啟）`);
}

/* ---- helpers ---- */
function ext(name) { const i = name.lastIndexOf('.'); return i < 0 ? '' : name.slice(i); }
function rel(abs) { return abs.startsWith(ROOT) ? abs.slice(ROOT.length + 1) : abs; }

/* ---- dispatch ---- */
const cmd = process.argv[2];
if (cmd === 'tokens') buildTokens();
else if (cmd === 'lint') lint();
else if (cmd === 'lint-brand') lintBrand(process.argv[3]);
else if (cmd === 'pages') buildPages();
else {
  console.error('用法: node build.mjs <tokens|lint|lint-brand [dir]|pages>');
  process.exit(2);
}
