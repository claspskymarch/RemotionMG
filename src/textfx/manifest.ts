import {EFFECTS} from './library';

/** effectId → 缩略图相对路径（相对 docs/）。 */
export const thumbPath = (e: {category: string; id: number}): string =>
  `thumbnails/${e.category}${String(e.id).padStart(2, '0')}.png`;

/** 机读的效果清单条目（不含渲染函数）。 */
export type EffectManifestEntry = {
  id: number;
  category: string;
  name: string;
  enName: string;
  formula: string;
  thumbnail: string;
};

/** 全部 100 个动效原子的机读清单，供其他 AI 查询「有哪些效果可用」+ 选效果缩略图。 */
export const EFFECT_MANIFEST: EffectManifestEntry[] = EFFECTS.map((e) => ({
  id: e.id,
  category: e.category,
  name: e.name,
  enName: e.enName,
  formula: e.formula,
  thumbnail: thumbPath(e),
}));

/** 各场景的机读说明（id 即 Remotion 合成 id）。 */
export type SceneManifestEntry = {
  id: string;
  name: string;
  role: string;
  stacks: boolean;
  propsKey: string;
};

export const SCENE_MANIFEST: SceneManifestEntry[] = [
  {id: 'SceneHero', name: '主标题', role: '单段超大居中、戏剧化进出', stacks: false, propsKey: 'entries[]'},
  {id: 'SceneCaption', name: '字幕', role: '下三分之一、快速进出/原地替换', stacks: false, propsKey: 'lines[]'},
  {id: 'SceneList', name: '逐条列表', role: '条目依次入场并持续累积', stacks: true, propsKey: 'items[]'},
  {id: 'SceneLowerThird', name: '角标/署名', role: '左下品牌条、滑入停留滑出', stacks: false, propsKey: 'entries[]'},
  {id: 'SceneEmphasis', name: '行内强调', role: '句中某词高亮登场', stacks: false, propsKey: 'lines[]'},
  {id: 'SceneGallery', name: '目录陈列', role: '顺序陈列效果库 + 历史栈', stacks: true, propsKey: 'effectIds[]'},
  {id: 'SceneReel', name: '串联成片', role: '多场景按顺序拼成完整成片', stacks: false, propsKey: 'segments[]'},
  {id: 'SceneTheme', name: '主题成片', role: '选一个主题即一键生成整套协调的多场景成片', stacks: false, propsKey: 'theme + content'},
  {id: 'SceneThumb', name: '缩略图', role: '单原子静态预览（生成选效果缩略图）', stacks: false, propsKey: 'effectId'},
  {id: 'SceneWall', name: '动态预览墙', role: '全部效果网格同步循环（人类一眼选效果）', stacks: false, propsKey: 'effectIds[]'},
];

export const CATEGORIES: Record<string, string> = {
  A: '透明度 · 多项式与指数曲线',
  B: '缓动与方向位移',
  C: '缩放 · 形变 · 3D',
  D: '模糊 · 滤镜',
  E: '三角函数 · 波动',
  F: '逐字符 · 交错编排',
  G: '裁剪 · 遮罩',
  H: '噪声 · 随机',
  I: '粒子 · 重组',
  J: '颜色 · 光影',
  K: '故障 · 数字信号',
  L: '分形 · 混沌 · 高阶',
};
