/**
 * P3 导出器 —— 把一份「单一事实源」ThemeConfig 打包成最精简、AI 与人类都会用的主题包：
 *   theme.json   主题配置（即渲染入参）
 *   README.md    自动生成的中英说明（含唯一一条渲染命令 + 配置摘要）
 *   render.sh    拷贝即跑的渲染脚本
 *
 * 纯函数，无 DOM / Node 依赖：配置前端（浏览器）与 CLI 脚本共用同一套生成逻辑，
 * 保证「前端导出的包」与「脚本导出的包」完全一致。
 */
import {
  ThemeConfig,
  ThemeRole,
  themeRoles,
  getTheme,
  EffectChoice,
  themeConfigFrames,
} from './themes';
import {EFFECT_MANIFEST, CATEGORIES} from './manifest';

/** 主题包里使用的合成 id（多场景串联成片）。 */
export const THEME_COMPOSITION = 'SceneTheme';

/** 某场景当前生效的入/出原子：优先用覆盖，否则用主题默认。 */
export const effectiveEffect = (c: ThemeConfig, role: ThemeRole): EffectChoice =>
  c.effects?.[role] ?? getTheme(c.theme).effects[role];

/** 紧凑单行 JSON（用于 --props）。 */
export const themeJsonInline = (c: ThemeConfig): string => JSON.stringify(c);

/** 美化多行 JSON（用于 theme.json 文件 / 展示）。 */
export const themeJsonPretty = (c: ThemeConfig): string => JSON.stringify(c, null, 2);

/** 唯一一条渲染命令：读取同目录的 theme.json 即出片。 */
export const renderCommand = (c: ThemeConfig, propsRef: string = `'${themeJsonInline(c)}'`): string =>
  `npx remotion render src/index.ts ${THEME_COMPOSITION} out.mp4 --props=${propsRef}`;

const ROLE_LABEL: Record<ThemeRole, {zh: string; en: string}> = {
  hero: {zh: '主标题', en: 'Hero'},
  list: {zh: '列表', en: 'List'},
  lowerThird: {zh: '角标', en: 'Lower-third'},
  caption: {zh: '字幕', en: 'Caption'},
  emphasis: {zh: '强调', en: 'Emphasis'},
};

const atomName = (id: number): string => {
  const e = EFFECT_MANIFEST.find((x) => x.id === id);
  return e ? `${id} ${e.name} / ${e.enName}` : String(id);
};

export type SceneSummary = {role: ThemeRole; zh: string; en: string; inAtom: string; outAtom: string; overridden: boolean};

/** 把配置摘要成结构化数据（供 README 表格 / 其他展示）。 */
export const summarizeConfig = (c: ThemeConfig): {
  theme: ReturnType<typeof getTheme>;
  order: ThemeRole[];
  scenes: SceneSummary[];
  families: string;
  totalFrames: number;
} => {
  const theme = getTheme(c.theme);
  const order = c.order ?? [...themeRoles];
  const scenes: SceneSummary[] = order
    .filter((role) => c.content[role])
    .map((role) => {
      const eff = effectiveEffect(c, role);
      return {
        role,
        zh: ROLE_LABEL[role].zh,
        en: ROLE_LABEL[role].en,
        inAtom: atomName(eff.inEffectId),
        outAtom: atomName(eff.outEffectId),
        overridden: Boolean(c.effects?.[role]),
      };
    });
  const families = theme.families.map((f) => `${f}（${CATEGORIES[f] ?? ''}）`).join('、');
  return {theme, order, scenes, families, totalFrames: themeConfigFrames(c)};
};

/** 自动生成中英双语 README。 */
export const buildReadme = (c: ThemeConfig): string => {
  const {theme, scenes, families, totalFrames} = summarizeConfig(c);
  const seconds = (totalFrames / 30).toFixed(1);
  const cmd = renderCommand(c, "\"$(cat theme.json)\"");
  const sceneRows = scenes
    .map((s) => `| ${s.zh} ${s.en} | ${s.inAtom} | ${s.outAtom} |${s.overridden ? ' ✎' : ''}`)
    .join('\n');

  return `# 主题包 · ${theme.name} / Theme Pack · ${theme.enName}

> ${theme.description}

本包由配置器导出，是「单一事实源」——\`theme.json\` 同时是 AI 的 \`--props\` 入参、人类的配置、渲染脚本的输入。
This pack is the single source of truth — \`theme.json\` is the render \`--props\`, the human-editable config, and the script input, all at once.

## 一键渲染 / Render in one line

需要 [RemotionMG](https://github.com/claspskymarch/RemotionMG) 仓库（包含 100 个动效原子与场景模板）。把本包内文件放到仓库根目录，然后：
Requires the [RemotionMG](https://github.com/claspskymarch/RemotionMG) repo (the 100 motion atoms + scene templates). Drop these files into the repo root, then run:

\`\`\`bash
${cmd}
\`\`\`

或直接执行随包的脚本 / or just run the bundled script:

\`\`\`bash
bash render.sh
\`\`\`

## 配置摘要 / Config summary

- 主题 / Theme：**${theme.name} · ${theme.enName}** (\`${theme.id}\`)
- 取材家族 / Atom families：${families}
- 节奏 / Timing：inF=${(c.timing ?? theme.timing).inF} · holdF=${(c.timing ?? theme.timing).holdF} · outF=${(c.timing ?? theme.timing).outF}（帧 / frames）
- 预计时长 / Duration：~${seconds}s @30fps（${totalFrames} 帧 / frames）

| 场景 / Scene | 入场原子 / In | 出场原子 / Out | |
|---|---|---|---|
${sceneRows}

> ✎ = 已对主题默认做单场景覆盖 / overrides the theme default.

## 确定性 / Determinism

随机类原子（乱码、噪声等）使用确定性种子，**同一份 \`theme.json\` 每次渲染结果一致**。
Random atoms (scramble, noise, …) use deterministic seeds, so the **same \`theme.json\` renders identically every time**.

## 自定义 / Customize

直接编辑 \`theme.json\` 的 \`content\`（文字）、\`effects\`（逐场景入/出原子）、\`style\`、\`timing\`、\`order\`；
或在配置器（\`npm run dev:ui\`）里可视化调整后重新导出。
Edit \`theme.json\` directly, or re-export from the configurator (\`npm run dev:ui\`).
`;
};

/** 随包的渲染脚本（读取同目录 theme.json）。 */
export const buildRenderScript = (): string =>
  `#!/usr/bin/env bash
# 拷贝到 RemotionMG 仓库根目录后执行：读取同目录 theme.json 渲染成片。
# Run from the RemotionMG repo root: renders using the adjacent theme.json.
set -euo pipefail
DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
npx remotion render src/index.ts ${THEME_COMPOSITION} out.mp4 --props="$(cat "$DIR/theme.json")"
`;

export type PackFile = {name: string; content: string};

/** 生成主题包的全部文件（配置 + README + 渲染脚本）。 */
export const buildPack = (c: ThemeConfig): PackFile[] => [
  {name: 'theme.json', content: themeJsonPretty(c) + '\n'},
  {name: 'README.md', content: buildReadme(c)},
  {name: 'render.sh', content: buildRenderScript()},
];

/** 包文件名建议（含主题 id）。 */
export const packBaseName = (c: ThemeConfig): string => `theme-${c.theme}-pack`;
