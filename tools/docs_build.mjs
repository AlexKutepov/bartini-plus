/**
 * 1) \(...\) / \[...\] → $...$ / $$...$$  (GitHub + превью)
 * 2) site/index.html — книга с KaTeX, без ломаной вёрстки таблиц.
 *
 * node tools/docs_build.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const MD_FILES = [
  "README.md",
  "AUTHORS.md",
  ...listDocs(),
];

function listDocs() {
  const out = [];
  for (const lang of ["ru", "en", "zh"]) {
    const dir = join(root, "docs", lang);
    for (const name of readdirSync(dir).sort()) {
      if (name.endsWith(".md")) out.push(`docs/${lang}/${name}`);
    }
  }
  return out;
}

function splitFences(src) {
  const parts = [];
  const re = /(```[\s\S]*?```)/g;
  let last = 0;
  let m;
  while ((m = re.exec(src))) {
    parts.push({ code: false, text: src.slice(last, m.index) });
    parts.push({ code: true, text: m[0] });
    last = m.index + m[0].length;
  }
  parts.push({ code: false, text: src.slice(last) });
  return parts;
}

function convertDelimiters(src) {
  return splitFences(src)
    .map((p) => {
      if (p.code) return p.text;
      let t = p.text.replace(/\\\[([\s\S]*?)\\\]/g, (_, body) => `\n\n$$\n${body.trim()}\n$$\n\n`);
      t = t.replace(/\\\(([\s\S]*?)\\\)/g, (_, body) => `$${body}$`);
      t = t.replace(/\n{3,}/g, "\n\n");
      return t;
    })
    .join("");
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function protectMath(src) {
  const slots = [];
  const hold = (html) => {
    const k = `\uE000${slots.length}\uE001`;
    slots.push(html);
    return k;
  };
  let t = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, b) => hold(`<div class="eq">$$${b.trim()}$$</div>`));
  t = t.replace(/\$([^$\n]+?)\$/g, (_, b) => hold(`<span class="eq-i">$${b}$</span>`));
  return { t, slots };
}

function restore(s, slots) {
  return s.replace(/\uE000(\d+)\uE001/g, (_, i) => slots[+i]);
}

function splitTableRow(line) {
  const raw = line.replace(/^\|/, "").replace(/\|$/, "");
  const cells = [];
  let cur = "";
  let dollars = 0;
  for (const ch of raw) {
    if (ch === "$") dollars++;
    if (ch === "|" && dollars % 2 === 0) {
      cells.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

function isSepRow(cells) {
  return cells.every((c) => /^:?-+:?$/.test(c.replace(/\s/g, "")) || c === "");
}

function inline(s) {
  let t = escapeHtml(s);
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,]|$)/g, "$1<em>$2</em>");
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return t;
}

function mdToHtml(src) {
  const { t, slots } = protectMath(src.replace(/\r\n/g, "\n"));
  const lines = t.split("\n");
  const out = [];
  let i = 0;
  let para = [];

  const flushP = () => {
    if (!para.length) return;
    const text = para.join(" ").trim();
    if (text) out.push(`<p>${inline(text)}</p>`);
    para = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      flushP();
      const lang = line.slice(3).trim();
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push(`<pre><code class="lang-${escapeHtml(lang)}">${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }
    if (/^\|.+\|$/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1])) {
      flushP();
      const header = splitTableRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        const cells = splitTableRow(lines[i]);
        if (!isSepRow(cells)) rows.push(cells);
        i++;
      }
      const th = header.map((c) => `<th>${inline(c)}</th>`).join("");
      const tr = rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("");
      out.push(`<div class="table-wrap"><table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></div>`);
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      flushP();
      out.push("<hr>");
      i++;
      continue;
    }
    const hm = /^(#{1,4})\s+(.*)$/.exec(line);
    if (hm) {
      flushP();
      const n = hm[1].length;
      out.push(`<h${n}>${inline(hm[2])}</h${n}>`);
      i++;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushP();
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^[-*]\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      flushP();
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\d+\.\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }
    if (!line.trim()) {
      flushP();
      i++;
      continue;
    }
    para.push(line.trim());
    i++;
  }
  flushP();
  return restore(out.join("\n"), slots);
}

function titleOf(md, fallback) {
  const m = /^#\s+(.+)$/m.exec(md);
  return m ? m[1].replace(/\\\(|\\\)|\$/g, "") : fallback;
}

const PAGES = [
  { id: "readme", file: "README.md", group: "root" },
  { id: "authors", file: "AUTHORS.md", group: "root" },
  { id: "ru-researchers", file: "docs/ru/FOR_RESEARCHERS.md", group: "ru" },
  { id: "ru-proof", file: "docs/ru/PROOF.md", group: "ru" },
  { id: "ru-p5", file: "docs/ru/P5_STRESS.md", group: "ru" },
  { id: "ru-steps", file: "docs/ru/FOUR_STEPS.md", group: "ru" },
  { id: "ru-gaps", file: "docs/ru/CLOSE_GAPS.md", group: "ru" },
  { id: "ru-tighten", file: "docs/ru/MATH_TIGHTEN.md", group: "ru" },
  { id: "en-researchers", file: "docs/en/FOR_RESEARCHERS.md", group: "en" },
  { id: "en-proof", file: "docs/en/PROOF.md", group: "en" },
  { id: "en-steps", file: "docs/en/FOUR_STEPS.md", group: "en" },
  { id: "en-gaps", file: "docs/en/CLOSE_GAPS.md", group: "en" },
  { id: "en-tighten", file: "docs/en/MATH_TIGHTEN.md", group: "en" },
  { id: "zh-researchers", file: "docs/zh/FOR_RESEARCHERS.md", group: "zh" },
  { id: "zh-proof", file: "docs/zh/PROOF.md", group: "zh" },
  { id: "zh-steps", file: "docs/zh/FOUR_STEPS.md", group: "zh" },
  { id: "zh-gaps", file: "docs/zh/CLOSE_GAPS.md", group: "zh" },
  { id: "zh-tighten", file: "docs/zh/MATH_TIGHTEN.md", group: "zh" },
];

const CSS = `
:root { --bg:#f6f1e7; --paper:#fffdf8; --ink:#1c1916; --muted:#5c564e; --line:#d8cfc0; --acc:#6b2d12; }
* { box-sizing: border-box; }
html, body { margin:0; height:100%; background:var(--bg); color:var(--ink);
  font: 16px/1.6 "Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif; }
.app { display:grid; grid-template-columns: 260px 1fr; min-height:100%; }
nav { background:#2a241f; color:#f3ebe1; padding:20px 16px 40px; overflow:auto; }
nav h1 { font-size:14px; letter-spacing:.04em; text-transform:uppercase; margin:0 0 12px; font-weight:600; }
nav a { color:#f3ebe1; text-decoration:none; display:block; padding:5px 8px; border-radius:4px; font-size:13px; }
nav a:hover, nav a.active { background:#3d342c; }
nav .g { margin-top:16px; font-size:11px; color:#b5a898; text-transform:uppercase; letter-spacing:.08em; }
main { padding:32px 40px 80px; overflow:auto; }
article { max-width: 46rem; background:var(--paper); padding:40px 48px; border:1px solid var(--line);
  box-shadow: 0 1px 0 #fff inset, 0 12px 40px rgba(40,30,20,.06); }
h1,h2,h3,h4 { font-weight:650; line-height:1.25; }
h1 { font-size:1.7rem; margin:0 0 1rem; }
h2 { font-size:1.25rem; margin:2rem 0 .7rem; border-bottom:1px solid var(--line); padding-bottom:.3rem; }
h3 { font-size:1.05rem; margin:1.4rem 0 .4rem; }
p { margin:.7rem 0; }
code, pre { font-family: ui-monospace, "Cascadia Mono", Consolas, monospace; font-size:.86em; }
code { background:#efe7da; padding:.1em .35em; }
pre { background:#2a241f; color:#f3ebe1; padding:12px 14px; overflow:auto; }
pre code { background:none; color:inherit; padding:0; }
.table-wrap { overflow-x:auto; margin:1rem 0; }
table { border-collapse:collapse; width:100%; font-size:.92rem; }
th, td { border:1px solid var(--line); padding:.4rem .55rem; vertical-align:top; }
th { background:#efe7da; text-align:left; }
hr { border:0; border-top:1px solid var(--line); margin:1.6rem 0; }
.eq { margin:1.1rem 0; overflow-x:auto; }
a { color:var(--acc); }
@media (max-width: 860px) {
  .app { grid-template-columns: 1fr; }
  nav { position:sticky; top:0; z-index:2; max-height:40vh; }
  main { padding:16px; }
  article { padding:20px 16px; }
}
`;

function buildSite(pages) {
  const items = pages.map((p) => {
    const raw = readFileSync(join(root, p.file), "utf8");
    return {
      ...p,
      title: titleOf(raw, p.id),
      html: mdToHtml(raw),
    };
  });
  const nav = ["root", "ru", "en", "zh"]
    .map((g) => {
      const label = { root: "Repo", ru: "Русский", en: "English", zh: "中文" }[g];
      const links = items
        .filter((x) => x.group === g)
        .map((x) => `<a href="#${x.id}" data-id="${x.id}">${escapeHtml(x.title)}</a>`)
        .join("");
      return `<div class="g">${label}</div>${links}`;
    })
    .join("");
  const articles = items
    .map((x, i) => `<article id="${x.id}" class="page"${i ? ' hidden' : ""}>${x.html}</article>`)
    .join("\n");
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Бартини+</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css">
<style>${CSS}</style>
</head>
<body>
<div class="app">
<nav>
<h1>Бартини+</h1>
${nav}
</nav>
<main>${articles}</main>
</div>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/contrib/auto-render.min.js"></script>
<script>
function show(id) {
  document.querySelectorAll("article.page").forEach((el) => { el.hidden = el.id !== id; });
  document.querySelectorAll("nav a").forEach((a) => a.classList.toggle("active", a.dataset.id === id));
  if (window.renderMathInElement) {
    renderMathInElement(document.getElementById(id), {
      delimiters: [
        {left: "$$", right: "$$", display: true},
        {left: "$", right: "$", display: false}
      ],
      throwOnError: false
    });
  }
  history.replaceState(null, "", "#" + id);
}
document.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", (e) => {
  e.preventDefault();
  show(a.dataset.id);
  document.querySelector("main").scrollTop = 0;
}));
function boot() {
  const id = location.hash.slice(1) || "readme";
  show(document.getElementById(id) ? id : "readme");
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(boot, 0));
else setTimeout(boot, 0);
window.addEventListener("load", boot);
</script>
</body>
</html>
`;
}

function run() {
  let changed = 0;
  for (const rel of MD_FILES) {
    const path = join(root, rel);
    const before = readFileSync(path, "utf8");
    const after = convertDelimiters(before);
    if (after !== before) {
      writeFileSync(path, after);
      changed++;
      console.log("math delimiters", rel);
    }
  }
  const siteDir = join(root, "site");
  mkdirSync(siteDir, { recursive: true });
  writeFileSync(join(siteDir, "index.html"), buildSite(PAGES));
  console.log("converted", changed, "md files");
  console.log("wrote", relative(root, join(siteDir, "index.html")));
}

run();
