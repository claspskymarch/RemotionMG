<p align="right"><strong>简体中文</strong> · <a href="./ai-usage.en.md">English</a></p>

# AI 调用指南（零改代码出片）

本项目把文字动效拆成两层，**其他 AI / 程序只需传 JSON props 即可渲染**，无需改动源码。

- **动效原子**：100 个纯入场/出场效果，`id ∈ [1, 100]`（见下文清单）
- **场景模板**：6 个布局/角色模板 + Reel 串联成片 + Thumb 缩略图 + Wall 动态预览墙，每个对应一个 Remotion 合成（Composition），props 化 + 自动算时长

## 1. 先查"有哪些可用"

机读清单：[`docs/effects.json`](./effects.json)

```jsonc
{
  "categories": { "A": "透明度 · 多项式与指数曲线", ... },
  "effects": [ { "id": 1, "category": "A", "name": "线性淡入", "enName": "Linear Fade", "formula": "opacity = t" }, ... ],  // 共 100 条
  "scenes":  [ { "id": "SceneHero", "name": "主标题", "role": "...", "stacks": false, "propsKey": "entries[]" }, ... ]      // 共 9 条（含 Reel/Thumb/Wall）
}
```

`effects[].thumbnail` 指向该效果的预览缩略图（`docs/thumbnails/<类别><编号>.png`，如 `thumbnails/K95.png`），
AI / 人类都可据此"看图选效果"。

**人类快速预览（选效果）有四条路：**
- 静态总览墙：[`docs/thumbnails-contact-sheet.png`](./thumbnails-contact-sheet.png)，一图看全 100 个中段状态。
- 可点击预览页：[`docs/preview.html`](./preview.html)，浏览器直接打开，按 A–L 分类网格 + 编号/名称/公式，顶部搜索框可按编号/名称/公式过滤，点缩略图看大图。
- 动态预览墙：渲染合成 `SceneWall`（100 效果网格同步循环），看"动起来"的样子。
- 交互式实时：`npm run dev` → 打开 `SceneThumb`，右侧 schema 面板改 `effectId`(1–100) 实时预览。

重新生成：`npm run gen:manifest`（清单）、`npm run gen:thumbnails`（100 张缩略图）、`npm run gen:preview`（HTML 预览页）。后两者需先 `npm i`。

## 2. 渲染：传 `--props` 即可

通用命令（`<SceneId>` 取自 `scenes[].id`）：

```bash
npx remotion render src/index.ts <SceneId> out.mp4 --props='<JSON>'
# 出单帧预览：
npx remotion still  src/index.ts <SceneId> out.png --frame=40 --props='<JSON>'
```

**时长无需指定**：每个场景用 `calculateMetadata` 按 props 自动计算 `durationInFrames`。

### 通用可选排版/位置参数（全部可选，向后兼容）

除文字与 `effectId` 外，文字场景还接受以下可选 props 定义排版与位置；不传即用默认值：

| 参数 | 类型 | 含义 | 适用场景 |
|---|---|---|---|
| `fontSize` | number | 字号(px) | 全部文字场景 |
| `fontWeight` | number | 字重(100–900) | Hero/Caption/List/Emphasis/LowerThird |
| `fontFamily` | string | 字体族 | 同上 |
| `letterSpacing` | number | 字间距(px) | 同上 |
| `align` | `left\|center\|right` | 水平对齐 | Hero/Caption/Emphasis |
| `vAlign` | `top\|center\|bottom` | 垂直对齐 | Hero |
| `offsetX`/`offsetY` | number | 位置偏移(px) | Hero/Caption/LowerThird |
| `subSize`/`subColor` | number/string | 副标题字号/颜色 | Hero |
| `showLabel` | boolean | 是否显示左上角场景标签 | 全部 |

示例（左对齐置顶、细体、字间距、自定位置、隐藏标签）：
```bash
npx remotion render src/index.ts SceneHero out.mp4 --props='{
  "entries":[{"text":"左上角标题","sub":"custom","effectId":21}],
  "timing":{"inF":22,"holdF":40,"outF":18},
  "background":"#0c0e1c","color":"#7fe3ff",
  "fontSize":120,"fontWeight":400,"letterSpacing":8,
  "align":"left","vAlign":"top","offsetX":40,"offsetY":20,"showLabel":false
}'
```

### 分别指定入场 / 出场原子（可选）

每段文字除 `effectId` 外，可加 `inEffectId` / `outEffectId` 分别覆盖入场与出场所用原子；
缺省时两端都用 `effectId`（向后兼容）。例：乱码解码登场、RGB 撕裂离场：
```json
{"text":"标题","effectId":72,"inEffectId":72,"outEffectId":95}
```

### 主题（一键成套，最省事）

不想逐场景挑效果？用 **SceneTheme**：选一个主题（`theme`）+ 填文字（`content`），
即生成整套"配色 / 字体 / 节奏 / 入出场"都协调的多场景成片。主题清单见 `effects.json` 的 `themes`。

预设主题：`glitch` 故障赛博 · `soft` 柔和优雅 · `bouncy` 活力弹跳 · `minimal` 极简打字 · `elegant` 优雅衬线。

```bash
npx remotion render src/index.ts SceneTheme out.mp4 --props='{
  "theme":"glitch",
  "content":{
    "hero":{"entries":[{"text":"年度发布会","sub":"2025"}]},
    "list":{"title":"今天的内容","items":[{"text":"新品"},{"text":"路线图"},{"text":"答疑"}]},
    "caption":{"lines":[{"text":"欢迎来到现场。"}]}
  }
}'
```

可选字段（在项目范围内细调，仍保持成套）：
- `order`：场景出现顺序，取自 `["hero","list","lowerThird","caption","emphasis"]`，只列出要用的。
- `effects.<role>`：逐场景覆盖入/出原子，如 `{"hero":{"inEffectId":47,"outEffectId":34}}`。
- `style`：覆盖主题的 `background/color/accent/barColor/fontFamily/fontWeight/letterSpacing`。
- `timing`：覆盖 `{inF,holdF,outF}`。

只填 `theme` 不填 `content` 也能跑（用内置演示文字）。`content` 里缺省的场景角色不会出现在成片中。

### 各场景 props 示例

**SceneHero · 主标题**（单段超大居中、戏剧化进出、不堆叠）
```bash
npx remotion render src/index.ts SceneHero hero.mp4 --props='{
  "entries":[{"text":"年度发布会","effectId":21},{"text":"2025","effectId":95}],
  "timing":{"inF":22,"holdF":40,"outF":18},
  "background":"#0c0e1c","color":"#ffffff","fontSize":200
}'
```

**SceneCaption · 字幕**（下三分之一、快速进出/原地替换）
```bash
--props='{
  "lines":[{"text":"第一句解说","effectId":51},{"text":"第二句解说","effectId":31}],
  "timing":{"inF":10,"holdF":44,"outF":8},
  "background":"#0a1020","barColor":"rgba(10,14,26,0.72)","color":"#f2f6ff","fontSize":64
}'
```

**SceneList · 逐条列表**（依次入场并持续累积）
```bash
--props='{
  "title":"核心要点","items":[{"text":"要点一","effectId":11},{"text":"要点二","effectId":52}],
  "stepFrames":22,"inFrames":18,
  "background":"#0a1020","color":"#eaf0ff","fontSize":70
}'
```

**SceneLowerThird · 角标/署名**（左下品牌条、滑入停留滑出）
```bash
--props='{
  "entries":[{"name":"张三","role":"主讲人","effectId":12}],
  "timing":{"inF":16,"holdF":40,"outF":14},
  "background":"#0b1530","accent":"#ff7a3c"
}'
```

**SceneEmphasis · 行内强调**（句中某词高亮登场）
```bash
--props='{
  "lines":[{"pre":"增长了 ","token":"300%","post":"。","effectId":21,"accent":"#ffd23f"}],
  "timing":{"inF":16,"holdF":42,"outF":12},
  "background":"#0a0c16","color":"#e7ecff","fontSize":88
}'
```

**SceneGallery · 目录陈列**（顺序陈列效果库 + 历史栈；`effectIds` 留空数组=全部 100 法）
```bash
--props='{"effectIds":[21,23,34,47,81,72,95,99],"background":"#0a0e1c","color":"#ffffff","fontSize":150}'
```

**SceneReel · 串联成片**（把多个场景片段顺序拼成完整成片；时长自动求和）
```bash
npx remotion render src/index.ts SceneReel reel.mp4 --props='{
  "segments":[
    {"type":"hero","props":{"entries":[{"text":"片头","effectId":21}],"timing":{"inF":20,"holdF":34,"outF":16},"background":"#0c0e1c","color":"#fff","fontSize":150}},
    {"type":"caption","props":{"lines":[{"text":"一句解说","effectId":51}],"timing":{"inF":10,"holdF":44,"outF":8},"background":"#0a1020","barColor":"rgba(10,14,26,0.72)","color":"#f2f6ff","fontSize":60}},
    {"type":"hero","props":{"entries":[{"text":"谢谢观看","effectId":34}],"timing":{"inF":20,"holdF":36,"outF":18},"background":"#0c0e1c","color":"#fff","fontSize":170}}
  ]
}'
```
`segments[].type` ∈ `hero|caption|list|lowerThird|emphasis|gallery`，`props` 即对应场景的 props。

**SceneThumb · 缩略图**（单原子静态预览，用于批量生成选效果缩略图）
```bash
npx remotion still src/index.ts SceneThumb thumb.png --frame=0 --props='{"effectId":72,"background":"#0a0e1c","color":"#fff","fontSize":56}'
```

**SceneWall · 动态预览墙**（全部效果网格同步循环，给人类一眼选效果；`effectIds` 留空=全部 100 法）
```bash
npx remotion render src/index.ts SceneWall wall.mp4 --props='{"effectIds":[],"columns":10,"loopFrames":90,"background":"#0a0e1c","color":"#fff"}'
```
> 注：`SceneWall` 同屏 100 格动画，渲染请用默认并发（`--concurrency 1`），过高并发可能 OOM。

> 提示：Windows / 部分 shell 对单引号支持差，可把 JSON 写到文件再用 `--props=./props.json`。

## 3. 编程式调用（在 React/Remotion 里组合）

所有公共 API 从单一出口导入：

```ts
import {
  EFFECTS, effectById, TextFx,                       // 效果库 + 渲染器
  HeroScene, CaptionScene, ListScene,                // 场景模板
  LowerThirdScene, EmphasisScene, GalleryScene,
  heroSchema, HERO_DEFAULT,                           // schema + 默认 props
  EFFECT_MANIFEST, SCENE_MANIFEST, CATEGORIES,        // 机读清单
} from './src/textfx';

// 把任意原子作用到一段文字（场景只给 baseStyle，效果给 transform/filter/content）
<TextFx effect={effectById(72)} text="解码" phase="in" t={0.5} frame={frame} />
```

把一个原子插进自定义场景：调用 `effectById(id).visual({text, phase, t, frame, seed})`，
返回 `{wrapper?: CSSProperties, content?: ReactNode}`，自行渲染即可。

## 4. 约定

- `effectId` 必须在 `[1, 100]`，否则回退到 1。
- `phase`：`'in'` 入场（0→1 出现），`'out'` 出场（0→1 消失）。
- 画布固定 `1920×1080 @ 30fps`（见 `src/Root.tsx` 的 `COMMON`）。
- Hero/Caption/LowerThird/Emphasis：同一时刻只有一条在台上；List/Gallery 才累积/堆叠。
