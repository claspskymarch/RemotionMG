import {z} from 'zod';
import {effectIdSchema, timingSchema, Timing, ReelProps, ReelSegment, reelFrames} from './schemas';

/**
 * 主题（Theme）= 一套"协调的动效语言"。
 *
 * 痛点：标题选了某个原子后，其他场景该配什么才"成套"？逐场景手挑很慢、还容易割裂。
 * 方案：主题把「每个场景角色用哪个入场/出场原子 + 共享配色/字体/节奏」一次性定义好。
 * 选一个主题名（如 `glitch`）即可一键生成整套协调的多场景成片（Reel）。
 *
 * 主题负责"快速选出最接近想要的那套"；之后可在 themeConfig 里逐场景覆盖来微调
 * （配置前端 P2 即基于此层）。
 *
 * 注意：原子的随机性（乱码/噪声）使用确定性种子，同样的配置每次渲染结果一致。
 */

/** 主题覆盖到的场景角色（Gallery 是"陈列整库"的特定场景，不参与主题）。 */
export const themeRoles = ['hero', 'list', 'lowerThird', 'caption', 'emphasis'] as const;
export type ThemeRole = (typeof themeRoles)[number];

/** 一个场景角色的入场/出场原子选择。 */
export type EffectChoice = {inEffectId: number; outEffectId: number};

/** 主题的共享视觉语言（配色 / 字体 / 字重 / 字间距）。 */
export type ThemeStyle = {
  background: string;
  color: string;
  accent: string;
  barColor: string;
  fontFamily: string;
  fontWeight: number;
  letterSpacing: number;
};

export type Theme = {
  id: string;
  name: string;
  enName: string;
  description: string;
  /** 该主题主要取材的原子家族（A–L），便于人/AI 理解风格来源。 */
  families: string[];
  style: ThemeStyle;
  timing: Timing;
  /** 每个场景角色默认的入场/出场原子。 */
  effects: Record<ThemeRole, EffectChoice>;
};

const FONT_DEFAULT = 'Arial, "PingFang SC", "Microsoft YaHei", sans-serif';
const FONT_MONO = 'Menlo, Consolas, "Courier New", "PingFang SC", "Microsoft YaHei", monospace';
const FONT_SERIF = 'Georgia, "Times New Roman", "Songti SC", SimSun, serif';

const c = (inEffectId: number, outEffectId: number): EffectChoice => ({inEffectId, outEffectId});

/** 五套预设主题。每套都从一两个原子家族里取材，保证整片视觉同源。 */
export const THEMES: Record<string, Theme> = {
  glitch: {
    id: 'glitch',
    name: '故障赛博',
    enName: 'Glitch / Cyber',
    description: '数字故障风：乱码解码登场、RGB 撕裂离场；等宽字体、青色高亮、深色背景。',
    families: ['H', 'K'],
    style: {
      background: 'radial-gradient(circle at 50% 42%, #0a1320 0%, #060a12 60%, #03050a 100%)',
      color: '#eafcff',
      accent: '#38e0ff',
      barColor: 'rgba(6,14,20,0.78)',
      fontFamily: FONT_MONO,
      fontWeight: 800,
      letterSpacing: 1,
    },
    timing: {inF: 20, holdF: 40, outF: 16},
    effects: {
      hero: c(72, 95),
      list: c(74, 74),
      lowerThird: c(72, 95),
      caption: c(78, 79),
      emphasis: c(95, 72),
    },
  },

  soft: {
    id: 'soft',
    name: '柔和优雅',
    enName: 'Soft / Focus',
    description: '柔和聚焦风：从模糊对焦浮现、墨水晕染淡出；轻字重、蓝白配色，适合解说/科普。',
    families: ['D', 'B'],
    style: {
      background: 'linear-gradient(180deg, #0c1426 0%, #0e1830 100%)',
      color: '#f2f6ff',
      accent: '#7aa2ff',
      barColor: 'rgba(10,16,30,0.7)',
      fontFamily: FONT_DEFAULT,
      fontWeight: 600,
      letterSpacing: 0,
    },
    timing: {inF: 22, holdF: 44, outF: 18},
    effects: {
      hero: c(31, 33),
      list: c(11, 11),
      lowerThird: c(31, 33),
      caption: c(31, 31),
      emphasis: c(34, 31),
    },
  },

  bouncy: {
    id: 'bouncy',
    name: '活力弹跳',
    enName: 'Bouncy / Spring',
    description: '弹性活泼风：弹簧弹出、旋转缩放螺入/出；橙色高亮、重字重，适合宣传/活动片。',
    families: ['C', 'B'],
    style: {
      background: 'radial-gradient(circle at 50% 40%, #1c2350 0%, #0d1130 60%, #070920 100%)',
      color: '#ffffff',
      accent: '#ff7a3c',
      barColor: 'rgba(12,16,40,0.72)',
      fontFamily: FONT_DEFAULT,
      fontWeight: 900,
      letterSpacing: 0,
    },
    timing: {inF: 20, holdF: 38, outF: 16},
    effects: {
      hero: c(21, 23),
      list: c(13, 13),
      lowerThird: c(12, 12),
      caption: c(11, 11),
      emphasis: c(21, 21),
    },
  },

  minimal: {
    id: 'minimal',
    name: '极简打字',
    enName: 'Minimal / Type',
    description: '极简打字风：打字机逐字登场、字距收拢离场；近黑背景、细字重，适合代码/技术向。',
    families: ['F'],
    style: {
      background: 'linear-gradient(180deg, #0a0c12 0%, #0c0f16 100%)',
      color: '#f5f7fb',
      accent: '#9aa7bd',
      barColor: 'rgba(8,10,16,0.8)',
      fontFamily: FONT_MONO,
      fontWeight: 500,
      letterSpacing: 1,
    },
    timing: {inF: 24, holdF: 42, outF: 14},
    effects: {
      hero: c(51, 58),
      list: c(52, 52),
      lowerThird: c(11, 11),
      caption: c(51, 51),
      emphasis: c(51, 58),
    },
  },

  elegant: {
    id: 'elegant',
    name: '优雅衬线',
    enName: 'Elegant / Serif',
    description: '优雅衬线风：螺旋极坐标归位、辉光绽放强调；衬线字体、金色高亮，适合品牌/片头。',
    families: ['E', 'G', 'D'],
    style: {
      background: 'radial-gradient(circle at 50% 40%, #20182a 0%, #120c18 60%, #0a060e 100%)',
      color: '#f6efe2',
      accent: '#d9b46a',
      barColor: 'rgba(18,12,18,0.74)',
      fontFamily: FONT_SERIF,
      fontWeight: 600,
      letterSpacing: 2,
    },
    timing: {inF: 24, holdF: 46, outF: 18},
    effects: {
      hero: c(47, 40),
      list: c(11, 11),
      lowerThird: c(69, 63),
      caption: c(11, 11),
      emphasis: c(34, 31),
    },
  },
};

export const themeIds = Object.keys(THEMES);

export const getTheme = (id: string): Theme => {
  const t = THEMES[id];
  if (!t) throw new Error(`Unknown theme "${id}". Available: ${themeIds.join(', ')}`);
  return t;
};

/** 各场景角色的默认主字号（可被 style 不影响；后续可扩展为主题级覆盖）。 */
const SCENE_SIZE: Record<ThemeRole, number> = {
  hero: 180,
  list: 70,
  lowerThird: 88,
  caption: 64,
  emphasis: 88,
};

/* ----------------------------- 内容（文字） ----------------------------- */

const effectChoiceSchema = z.object({inEffectId: effectIdSchema, outEffectId: effectIdSchema});

/** 主题内容：只填文字，动效/配色/字体由主题决定。某个角色缺省即不出现在成片里。 */
export const themeContentSchema = z.object({
  hero: z
    .object({entries: z.array(z.object({text: z.string(), sub: z.string().optional()}))})
    .optional(),
  list: z
    .object({title: z.string().optional(), items: z.array(z.object({text: z.string()}))})
    .optional(),
  lowerThird: z
    .object({entries: z.array(z.object({name: z.string(), role: z.string()}))})
    .optional(),
  caption: z.object({lines: z.array(z.object({text: z.string()}))}).optional(),
  emphasis: z
    .object({
      lines: z.array(
        z.object({pre: z.string(), token: z.string(), post: z.string(), accent: z.string().optional()})
      ),
    })
    .optional(),
});
export type ThemeContent = z.infer<typeof themeContentSchema>;

const themeStyleOverrideSchema = z
  .object({
    background: z.string(),
    color: z.string(),
    accent: z.string(),
    barColor: z.string(),
    fontFamily: z.string(),
    fontWeight: z.number().int().positive(),
    letterSpacing: z.number(),
  })
  .partial();

/**
 * 主题配置 —— 这就是"单一事实源"：配置前端读写它、AI 拼它、`applyTheme` 解析它。
 * 解析结果是一份标准的 Reel props，可直接 `npx remotion render SceneReel --props`。
 */
export const themeConfigSchema = z.object({
  theme: z.string(),
  /** 成片里场景出现的顺序（缺省 hero→list→lowerThird→caption→emphasis）。 */
  order: z.array(z.enum(themeRoles)).optional(),
  /** 覆盖主题的共享配色/字体（微调用）。 */
  style: themeStyleOverrideSchema.optional(),
  /** 覆盖时序。 */
  timing: timingSchema.optional(),
  /** 逐场景覆盖入场/出场原子（在项目范围内细调）。 */
  effects: z
    .object({
      hero: effectChoiceSchema.optional(),
      list: effectChoiceSchema.optional(),
      lowerThird: effectChoiceSchema.optional(),
      caption: effectChoiceSchema.optional(),
      emphasis: effectChoiceSchema.optional(),
    })
    .optional(),
  content: themeContentSchema,
});
export type ThemeConfig = z.infer<typeof themeConfigSchema>;

/* ----------------------------- 解析为 Reel ----------------------------- */

const buildSegment = (
  role: ThemeRole,
  content: ThemeContent,
  style: ThemeStyle,
  timing: Timing,
  eff: EffectChoice
): ReelSegment | null => {
  const ref = {effectId: eff.inEffectId, inEffectId: eff.inEffectId, outEffectId: eff.outEffectId};
  const base = {
    background: style.background,
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight,
    letterSpacing: style.letterSpacing,
  };
  switch (role) {
    case 'hero': {
      if (!content.hero) return null;
      return {
        type: 'hero',
        props: {
          entries: content.hero.entries.map((e) => ({text: e.text, sub: e.sub, ...ref})),
          timing,
          color: style.color,
          fontSize: SCENE_SIZE.hero,
          ...base,
        },
      };
    }
    case 'list': {
      if (!content.list) return null;
      return {
        type: 'list',
        props: {
          title: content.list.title ?? '',
          items: content.list.items.map((it) => ({text: it.text, ...ref})),
          stepFrames: 22,
          inFrames: 18,
          color: style.color,
          fontSize: SCENE_SIZE.list,
          ...base,
        },
      };
    }
    case 'lowerThird': {
      if (!content.lowerThird) return null;
      return {
        type: 'lowerThird',
        props: {
          entries: content.lowerThird.entries.map((e) => ({name: e.name, role: e.role, ...ref})),
          timing,
          accent: style.accent,
          ...base,
        },
      };
    }
    case 'caption': {
      if (!content.caption) return null;
      return {
        type: 'caption',
        props: {
          lines: content.caption.lines.map((l) => ({text: l.text, ...ref})),
          timing,
          barColor: style.barColor,
          color: style.color,
          fontSize: SCENE_SIZE.caption,
          ...base,
        },
      };
    }
    case 'emphasis': {
      if (!content.emphasis) return null;
      return {
        type: 'emphasis',
        props: {
          lines: content.emphasis.lines.map((l) => ({
            pre: l.pre,
            token: l.token,
            post: l.post,
            accent: l.accent ?? style.accent,
            ...ref,
          })),
          timing,
          color: style.color,
          fontSize: SCENE_SIZE.emphasis,
          ...base,
        },
      };
    }
  }
};

const DEFAULT_ORDER: ThemeRole[] = ['hero', 'list', 'lowerThird', 'caption', 'emphasis'];

/** 把一份主题配置解析成标准 Reel props（多场景串联成片）。 */
export const resolveThemeConfig = (config: ThemeConfig): ReelProps => {
  const theme = getTheme(config.theme);
  const style: ThemeStyle = {...theme.style, ...config.style};
  const timing = config.timing ?? theme.timing;
  const order = config.order ?? DEFAULT_ORDER;
  const segments: ReelSegment[] = [];
  for (const role of order) {
    const eff = config.effects?.[role] ?? theme.effects[role];
    const seg = buildSegment(role, config.content, style, timing, eff);
    if (seg) segments.push(seg);
  }
  return {segments};
};

/** 便捷封装：给定主题名 + 内容，直接得到 Reel props。 */
export const applyTheme = (
  themeId: string,
  content: ThemeContent,
  overrides?: Omit<ThemeConfig, 'theme' | 'content'>
): ReelProps => resolveThemeConfig({theme: themeId, content, ...overrides});

/** 主题配置的总时长（帧），供 Remotion calculateMetadata 使用。 */
export const themeConfigFrames = (config: ThemeConfig): number =>
  reelFrames(resolveThemeConfig(config));

/** 演示内容：未提供内容时用它生成一段可直接预览的成片。 */
export const DEMO_CONTENT: ThemeContent = {
  hero: {entries: [{text: '主题成套动效', sub: 'One theme · consistent motion'}]},
  list: {
    title: '一个主题搞定整片',
    items: [
      {text: '标题、列表、字幕…自动协调'},
      {text: '入场/出场可分别切换'},
      {text: '配色/字体/节奏全主题统一'},
      {text: '导出即一份配置 JSON'},
    ],
  },
  lowerThird: {entries: [{name: '林述白', role: '动态设计师 / Motion Designer'}]},
  caption: {lines: [{text: '选一个主题，整片风格一键成套。'}, {text: '再逐场景微调入场与出场。'}]},
  emphasis: {lines: [{pre: '只需 ', token: '一个主题', post: ' 即可统一全片。'}]},
};

/** SceneTheme 合成的默认配置（Studio 初始值 / AI 调用范例）。 */
export const THEME_CONFIG_DEFAULT: ThemeConfig = {theme: 'glitch', content: DEMO_CONTENT};

/** 主题清单（供机读 / 配置前端列出可选项）。 */
export const THEME_MANIFEST = themeIds.map((id) => {
  const t = THEMES[id];
  return {
    id: t.id,
    name: t.name,
    enName: t.enName,
    description: t.description,
    families: t.families,
    effects: t.effects,
  };
});
