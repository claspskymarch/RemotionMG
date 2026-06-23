<p align="right"><a href="./ai-usage.md">简体中文</a> · <strong>English</strong></p>

# AI Usage Guide (render with zero code changes)

This project splits text animation into two layers, so **other AIs / programs only pass JSON props to render** — no source changes required.

- **Effect atoms**: 100 pure entrance/exit effects, `id ∈ [1, 100]` (see manifest below)
- **Scene templates**: 6 layout/role templates + Reel (stitched film) + Thumb (thumbnail) + Wall (dynamic preview grid). Each maps to a Remotion Composition, props-driven + automatic duration.

## 1. First, discover "what's available"

Machine-readable manifest: [`docs/effects.json`](./effects.json)

```jsonc
{
  "categories": { "A": "Opacity · polynomial & exponential curves", ... },
  "effects": [ { "id": 1, "category": "A", "name": "线性淡入", "enName": "Linear Fade", "formula": "opacity = t" }, ... ],  // 100 total
  "scenes":  [ { "id": "SceneHero", "name": "Hero", "role": "...", "stacks": false, "propsKey": "entries[]" }, ... ]        // 9 total (incl. Reel/Thumb/Wall)
}
```

`effects[].thumbnail` points to a preview image (`docs/thumbnails/<category><id>.png`, e.g. `thumbnails/K95.png`), so both AIs and humans can "pick by looking".

**Four ways for humans to preview / pick effects:**
- Static overview: [`docs/thumbnails-contact-sheet.png`](./thumbnails-contact-sheet.png) — all 100 mid-states in one image.
- Clickable preview page: [`docs/preview.html`](./preview.html) — open in a browser; A–L category grid + id/name/formula, top search box filters by id/name/formula, click a thumbnail to enlarge.
- Dynamic preview wall: render the `SceneWall` composition (100 effects looping in sync) to see them "in motion".
- Interactive realtime: `npm run dev` → open `SceneThumb`, change `effectId` (1–100) in the schema panel for live preview.

Regenerate: `npm run gen:manifest` (manifest), `npm run gen:thumbnails` (100 thumbnails), `npm run gen:preview` (HTML page). The latter two require `npm i` first.

## 2. Render: just pass `--props`

Generic command (`<SceneId>` from `scenes[].id`):

```bash
npx remotion render src/index.ts <SceneId> out.mp4 --props='<JSON>'
# single-frame preview:
npx remotion still  src/index.ts <SceneId> out.png --frame=40 --props='<JSON>'
```

**No need to specify duration**: each scene computes `durationInFrames` from props via `calculateMetadata`.

### Common optional typography / position params (all optional, backward-compatible)

Besides text and `effectId`, text scenes also accept these optional props for typography and position; omit to keep defaults:

| Param | Type | Meaning | Scenes |
|---|---|---|---|
| `fontSize` | number | font size (px) | all text scenes |
| `fontWeight` | number | weight (100–900) | Hero/Caption/List/Emphasis/LowerThird |
| `fontFamily` | string | font family | same as above |
| `letterSpacing` | number | letter spacing (px) | same as above |
| `align` | `left\|center\|right` | horizontal align | Hero/Caption/Emphasis |
| `vAlign` | `top\|center\|bottom` | vertical align | Hero |
| `offsetX`/`offsetY` | number | position offset (px) | Hero/Caption/LowerThird |
| `subSize`/`subColor` | number/string | subtitle size/color | Hero |
| `showLabel` | boolean | show top-left scene label | all |

Example (left-aligned/top, thin weight, letter spacing, custom position, hidden label):
```bash
npx remotion render src/index.ts SceneHero out.mp4 --props='{
  "entries":[{"text":"Top-left Title","sub":"custom","effectId":21}],
  "timing":{"inF":22,"holdF":40,"outF":18},
  "background":"#0c0e1c","color":"#7fe3ff",
  "fontSize":120,"fontWeight":400,"letterSpacing":8,
  "align":"left","vAlign":"top","offsetX":40,"offsetY":20,"showLabel":false
}'
```

### Separate entrance / exit atoms (optional)

Besides `effectId`, each text entry may add `inEffectId` / `outEffectId` to override the
entrance and exit atoms independently; when omitted both ends use `effectId` (backward compatible). E.g. scramble-decode in, RGB-tear out:
```json
{"text":"Title","effectId":72,"inEffectId":72,"outEffectId":95}
```

### Themes (one switch, fully coordinated set)

Don't want to pick effects scene by scene? Use **SceneTheme**: choose a `theme` + fill in
`content`, and it produces a multi-scene reel whose palette / font / timing / in&out are all
coordinated. The theme list lives under `themes` in `effects.json`.

Presets: `glitch` · `soft` · `bouncy` · `minimal` · `elegant`.

```bash
npx remotion render src/index.ts SceneTheme out.mp4 --props='{
  "theme":"glitch",
  "content":{
    "hero":{"entries":[{"text":"Annual Launch","sub":"2025"}]},
    "list":{"title":"Agenda","items":[{"text":"Product"},{"text":"Roadmap"},{"text":"Q&A"}]},
    "caption":{"lines":[{"text":"Welcome."}]}
  }
}'
```

Optional fields (fine-tune within project scope, still coordinated):
- `order`: scene order, picked from `["hero","list","lowerThird","caption","emphasis"]` (list only those you want).
- `effects.<role>`: override in/out atoms per scene, e.g. `{"hero":{"inEffectId":47,"outEffectId":34}}`.
- `style`: override `background/color/accent/barColor/fontFamily/fontWeight/letterSpacing`.
- `timing`: override `{inF,holdF,outF}`.

`theme` alone (no `content`) also works (built-in demo text). Scene roles absent from `content` are omitted.

### Per-scene props examples

**SceneHero · Hero title** (single oversized centered line, dramatic in/out, no stacking)
```bash
npx remotion render src/index.ts SceneHero hero.mp4 --props='{
  "entries":[{"text":"Annual Launch","effectId":21},{"text":"2025","effectId":95}],
  "timing":{"inF":22,"holdF":40,"outF":18},
  "background":"#0c0e1c","color":"#ffffff","fontSize":200
}'
```

**SceneCaption · Caption** (lower third, quick in/out, in-place replace)
```bash
--props='{
  "lines":[{"text":"First narration line","effectId":51},{"text":"Second line","effectId":31}],
  "timing":{"inF":10,"holdF":44,"outF":8},
  "background":"#0a1020","barColor":"rgba(10,14,26,0.72)","color":"#f2f6ff","fontSize":64
}'
```

**SceneList · Build list** (items appear in sequence and accumulate)
```bash
--props='{
  "title":"Key points","items":[{"text":"Point one","effectId":11},{"text":"Point two","effectId":52}],
  "stepFrames":22,"inFrames":18,
  "background":"#0a1020","color":"#eaf0ff","fontSize":70
}'
```

**SceneLowerThird · Lower-third / credit** (branded bar, slide in-hold-out)
```bash
--props='{
  "entries":[{"name":"Jane Doe","role":"Speaker","effectId":12}],
  "timing":{"inF":16,"holdF":40,"outF":14},
  "background":"#0b1530","accent":"#ff7a3c"
}'
```

**SceneEmphasis · Inline emphasis** (a word in a sentence pops in)
```bash
--props='{
  "lines":[{"pre":"Grew by ","token":"300%","post":".","effectId":21,"accent":"#ffd23f"}],
  "timing":{"inF":16,"holdF":42,"outF":12},
  "background":"#0a0c16","color":"#e7ecff","fontSize":88
}'
```

**SceneGallery · Catalog** (sequentially showcases the library + history stack; empty `effectIds` array = all 100)
```bash
--props='{"effectIds":[21,23,34,47,81,72,95,99],"background":"#0a0e1c","color":"#ffffff","fontSize":150}'
```

**SceneReel · Stitched film** (concatenates multiple scene segments into one film; durations summed automatically)
```bash
npx remotion render src/index.ts SceneReel reel.mp4 --props='{
  "segments":[
    {"type":"hero","props":{"entries":[{"text":"Intro","effectId":21}],"timing":{"inF":20,"holdF":34,"outF":16},"background":"#0c0e1c","color":"#fff","fontSize":150}},
    {"type":"caption","props":{"lines":[{"text":"A line of narration","effectId":51}],"timing":{"inF":10,"holdF":44,"outF":8},"background":"#0a1020","barColor":"rgba(10,14,26,0.72)","color":"#f2f6ff","fontSize":60}},
    {"type":"hero","props":{"entries":[{"text":"Thanks","effectId":34}],"timing":{"inF":20,"holdF":36,"outF":18},"background":"#0c0e1c","color":"#fff","fontSize":170}}
  ]
}'
```
`segments[].type` ∈ `hero|caption|list|lowerThird|emphasis|gallery`; `props` is the corresponding scene's props.

**SceneThumb · Thumbnail** (static single-atom preview, used to batch-generate effect thumbnails)
```bash
npx remotion still src/index.ts SceneThumb thumb.png --frame=0 --props='{"effectId":72,"background":"#0a0e1c","color":"#fff","fontSize":56}'
```

**SceneWall · Dynamic preview wall** (all effects looping in sync on a grid, so humans can pick at a glance; empty `effectIds` = all 100)
```bash
npx remotion render src/index.ts SceneWall wall.mp4 --props='{"effectIds":[],"columns":10,"loopFrames":90,"background":"#0a0e1c","color":"#fff"}'
```
> Note: `SceneWall` animates 100 cells at once; render with default concurrency (`--concurrency 1`) — high concurrency may OOM.

> Tip: Windows / some shells handle single quotes poorly; write the JSON to a file and use `--props=./props.json`.

## 3. Programmatic use (compose inside React/Remotion)

Import all public APIs from a single entry:

```ts
import {
  EFFECTS, effectById, TextFx,                       // effect library + renderer
  HeroScene, CaptionScene, ListScene,                // scene templates
  LowerThirdScene, EmphasisScene, GalleryScene,
  heroSchema, HERO_DEFAULT,                           // schema + default props
  EFFECT_MANIFEST, SCENE_MANIFEST, CATEGORIES,        // machine-readable manifest
} from './src/textfx';

// apply any atom to a piece of text (scene gives baseStyle, effect gives transform/filter/content)
<TextFx effect={effectById(72)} text="decode" phase="in" t={0.5} frame={frame} />
```

To drop an atom into a custom scene: call `effectById(id).visual({text, phase, t, frame, seed})`,
which returns `{wrapper?: CSSProperties, content?: ReactNode}` for you to render.

## 4. Conventions

- `effectId` must be in `[1, 100]`, otherwise it falls back to 1.
- `phase`: `'in'` entrance (0→1 appears), `'out'` exit (0→1 disappears).
- Canvas is fixed at `1920×1080 @ 30fps` (see `COMMON` in `src/Root.tsx`).
- Hero/Caption/LowerThird/Emphasis: only one item on stage at a time; only List/Gallery accumulate/stack.
