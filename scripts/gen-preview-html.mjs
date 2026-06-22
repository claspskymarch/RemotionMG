// 生成 docs/preview.html：按 A–L 分类网格陈列全部缩略图 + 编号/名称/公式，
// 人类用浏览器直接打开即可扫读全部效果、点开看大图。
// 支持中英文切换（右上角 EN/中 按钮）+ 响应式网格自适应宽度。
import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

const root = process.cwd();
const manifest = JSON.parse(readFileSync(join(root, 'docs', 'effects.json'), 'utf8'));
const {categories, effects, scenes} = manifest;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

/** 分类英文名（按字母键）。 */
const CAT_EN = {
  A: 'Opacity · polynomial & exponential curves',
  B: 'Easing & directional motion',
  C: 'Scale · transform · 3D',
  D: 'Blur · filters',
  E: 'Trigonometric · wave',
  F: 'Per-character stagger',
  G: 'Clip · mask',
  H: 'Noise · randomness',
  I: 'Particles · reassembly',
  J: 'Color · light',
  K: 'Glitch · datamosh',
  L: 'Fractal · chaos',
};

/** 场景英文名 / 角色（按合成 id）。 */
const SCENE_EN = {
  SceneHero: ['Hero', 'Single oversized centered title; dramatic in/out; no stack'],
  SceneCaption: ['Caption', 'Lower-third subtitle; quick in/out; readability-first'],
  SceneList: ['List', 'Items appear sequentially and accumulate'],
  SceneLowerThird: ['Lower-third', 'Credit bar; slide in → hold → out'],
  SceneEmphasis: ['Emphasis', 'Inline keyword / number highlight'],
  SceneGallery: ['Gallery', 'Catalog: showcase the library + history stack'],
  SceneReel: ['Reel', 'Stitched film from multiple scene segments'],
  SceneThumb: ['Thumb', 'Static single-atom thumbnail'],
  SceneWall: ['Wall', 'All effects looping in sync on a grid'],
};

const byCat = {};
for (const e of effects) (byCat[e.category] ??= []).push(e);

const sections = Object.keys(categories)
  .map((cat) => {
    const items = (byCat[cat] ?? [])
      .map(
        (e) => `
      <figure class="card" id="${e.category}${String(e.id).padStart(2, '0')}">
        <a href="${esc(e.thumbnail)}" target="_blank" rel="noopener">
          <img loading="lazy" src="${esc(e.thumbnail)}" alt="${esc(e.name)}" />
        </a>
        <figcaption>
          <span class="id">${e.category}${String(e.id).padStart(2, '0')}</span>
          <span class="name zh">${esc(e.name)}</span>
          <span class="name en">${esc(e.enName)}</span>
          <span class="sub zh">${esc(e.enName)}</span>
          <span class="sub en">${esc(e.name)}</span>
          <code>${esc(e.formula)}</code>
        </figcaption>
      </figure>`
      )
      .join('');
    const head = `<span class="zh">${cat} · ${esc(categories[cat])}</span><span class="en">${cat} · ${esc(CAT_EN[cat] ?? '')}</span>`;
    return `<section><h2>${head}</h2><div class="grid">${items}</div></section>`;
  })
  .join('\n');

const sceneRows = scenes
  .map((s) => {
    const [enName, enRole] = SCENE_EN[s.id] ?? [s.name, s.role];
    return `<tr>
      <td><code>${esc(s.id)}</code></td>
      <td><span class="zh">${esc(s.name)}</span><span class="en">${esc(enName)}</span></td>
      <td><span class="zh">${esc(s.role)}</span><span class="en">${esc(enRole)}</span></td>
      <td><span class="zh">${s.stacks ? '是' : '否'}</span><span class="en">${s.stacks ? 'yes' : 'no'}</span></td>
      <td><code>${esc(s.propsKey)}</code></td>
    </tr>`;
  })
  .join('');

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>文字动效预览 · 100 法 + 场景 / Text-effect preview</title>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; background: #05060d; color: #e7ecff; font-family: -apple-system, "PingFang SC", "Microsoft YaHei", Arial, sans-serif; }
  header { padding: 28px 28px 8px; position: relative; }
  header h1 { margin: 0 0 6px; font-size: 24px; }
  header p { margin: 4px 0; color: #8ea0d6; font-size: 14px; }
  .langbtn { position: absolute; top: 24px; right: 28px; display: flex; gap: 6px; }
  .langbtn button { cursor: pointer; padding: 6px 14px; border-radius: 8px; border: 1px solid #2a3454; background: #0c1022; color: #8ea0d6; font-size: 13px; font-weight: 700; }
  .langbtn button.active { background: #1d63ff; border-color: #1d63ff; color: #fff; }
  .filter { margin: 14px 0; }
  .filter input { width: 320px; max-width: 70vw; padding: 8px 12px; border-radius: 8px; border: 1px solid #2a3454; background: #0c1022; color: #e7ecff; font-size: 14px; }
  section { padding: 8px 28px 20px; }
  section h2 { font-size: 17px; color: #4aa3ff; border-bottom: 1px solid #1c2540; padding-bottom: 8px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
  .card { margin: 0; background: #0b0f1e; border: 1px solid #1c2540; border-radius: 10px; overflow: hidden; }
  .card img { width: 100%; display: block; aspect-ratio: 16/9; object-fit: cover; background: #0a0e1c; }
  figcaption { padding: 8px 10px 10px; display: flex; flex-direction: column; gap: 2px; }
  figcaption .id { color: #4aa3ff; font-weight: 800; font-size: 12px; }
  figcaption .name { font-weight: 700; font-size: 15px; }
  figcaption .sub { color: #8ea0d6; font-size: 12px; }
  figcaption code { color: #b6c2ea; font-size: 11px; background: #0e1430; padding: 2px 6px; border-radius: 5px; margin-top: 4px; word-break: break-all; }
  table { border-collapse: collapse; width: 100%; font-size: 13px; }
  th, td { text-align: left; padding: 6px 10px; border-bottom: 1px solid #1c2540; }
  th { color: #8ea0d6; }
  a { color: inherit; text-decoration: none; }
  .hidden { display: none !important; }
  /* 语言切换：默认中文 */
  body[data-lang="zh"] .en { display: none; }
  body[data-lang="en"] .zh { display: none; }
</style>
</head>
<body data-lang="zh">
<header>
  <div class="langbtn">
    <button id="lang-zh" class="active" onclick="setLang('zh')">中</button>
    <button id="lang-en" onclick="setLang('en')">EN</button>
  </div>
  <h1><span class="zh">文字动效预览 · 100 法 + 场景模板</span><span class="en">Text-effect preview · 100 atoms + scene templates</span></h1>
  <p>
    <span class="zh">点击缩略图查看大图。动态总览见 <code>docs/thumbnails-contact-sheet.png</code>；动起来的预览墙渲染合成 <code>SceneWall</code>。</span>
    <span class="en">Click a thumbnail to enlarge. For a static overview see <code>docs/thumbnails-contact-sheet.png</code>; for a moving preview wall render the <code>SceneWall</code> composition.</span>
  </p>
  <p>
    <span class="zh">交互式实时预览：<code>npm run dev</code> → 打开 <code>SceneThumb</code>，在右侧 schema 面板改 <code>effectId</code>(1–100)。</span>
    <span class="en">Interactive realtime: <code>npm run dev</code> → open <code>SceneThumb</code>, change <code>effectId</code>(1–100) in the schema panel.</span>
  </p>
  <div class="filter"><input id="q" type="search" placeholder="按编号 / 名称 / 公式过滤 · filter by id / name / formula (K95, 螺旋, spring)" /></div>
</header>
${sections}
<section>
  <h2><span class="zh">场景模板（${scenes.length}）</span><span class="en">Scene templates (${scenes.length})</span></h2>
  <table><thead><tr>
    <th><span class="zh">合成 ID</span><span class="en">Composition ID</span></th>
    <th><span class="zh">名称</span><span class="en">Name</span></th>
    <th><span class="zh">角色</span><span class="en">Role</span></th>
    <th><span class="zh">堆叠</span><span class="en">Stacks</span></th>
    <th>props</th>
  </tr></thead><tbody>${sceneRows}</tbody></table>
</section>
<script>
  function setLang(l) {
    document.body.dataset.lang = l;
    document.getElementById('lang-zh').classList.toggle('active', l === 'zh');
    document.getElementById('lang-en').classList.toggle('active', l === 'en');
    try { localStorage.setItem('mg-lang', l); } catch (e) {}
  }
  try { const saved = localStorage.getItem('mg-lang'); if (saved) setLang(saved); } catch (e) {}

  const q = document.getElementById('q');
  const cards = [...document.querySelectorAll('.card')];
  q.addEventListener('input', () => {
    const v = q.value.trim().toLowerCase();
    for (const c of cards) {
      const hit = !v || c.textContent.toLowerCase().includes(v);
      c.classList.toggle('hidden', !hit);
    }
    for (const s of document.querySelectorAll('section')) {
      const grid = s.querySelector('.grid');
      if (!grid) continue;
      const any = [...grid.querySelectorAll('.card')].some((c) => !c.classList.contains('hidden'));
      s.classList.toggle('hidden', !any);
    }
  });
</script>
</body>
</html>
`;

const out = join(root, 'docs', 'preview.html');
writeFileSync(out, html);
console.log(`wrote ${effects.length} effects + ${scenes.length} scenes -> ${out}`);
