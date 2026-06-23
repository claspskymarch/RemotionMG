/**
 * 配置器的纯函数工具：所有改动都返回新的 ThemeConfig（单一事实源），
 * App 只持有一份 config 状态，预览与导出都从它派生。
 */
import {
  ThemeConfig,
  ThemeRole,
  EffectChoice,
  ThemeStyle,
  ThemeContent,
  themeRoles,
  getTheme,
  DEMO_CONTENT,
} from '../src/textfx/themes';
import {Timing} from '../src/textfx/schemas';
import {renderCommand} from '../src/textfx/exportPack';

export {renderCommand};

export const DEFAULT_ORDER: ThemeRole[] = [...themeRoles];

/** 成片中场景出现顺序（缺省即全部、按默认顺序）。 */
export const orderOf = (c: ThemeConfig): ThemeRole[] => c.order ?? [...DEFAULT_ORDER];

/** 某场景当前生效的入/出原子：优先用覆盖，否则用主题默认。 */
export const effEffect = (c: ThemeConfig, role: ThemeRole): EffectChoice =>
  c.effects?.[role] ?? getTheme(c.theme).effects[role];

/** 当前生效的共享样式（主题默认 ∪ 覆盖）。 */
export const effStyle = (c: ThemeConfig): ThemeStyle => ({...getTheme(c.theme).style, ...c.style});

/** 当前生效的时序。 */
export const effTiming = (c: ThemeConfig): Timing => c.timing ?? getTheme(c.theme).timing;

/** 是否存在任何覆盖（用于提示「已偏离主题默认」）。 */
export const hasOverrides = (c: ThemeConfig): boolean =>
  Boolean(c.effects || c.style || c.timing);

/** 切换主题：保留顺序与文字内容，清空所有覆盖 → 一键回到该主题的成套配置。 */
export const switchTheme = (c: ThemeConfig, id: string): ThemeConfig => ({
  theme: id,
  order: c.order,
  content: c.content,
});

/** 清空覆盖，回到当前主题默认（不动文字与顺序）。 */
export const resetOverrides = (c: ThemeConfig): ThemeConfig => ({
  theme: c.theme,
  order: c.order,
  content: c.content,
});

/** 覆盖某场景的入场或出场原子（保留另一端）。 */
export const setEffect = (
  c: ThemeConfig,
  role: ThemeRole,
  key: keyof EffectChoice,
  val: number
): ThemeConfig => {
  const next: EffectChoice = {...effEffect(c, role), [key]: val};
  return {...c, effects: {...c.effects, [role]: next}};
};

/** 启用/停用某场景；启用时若无文字则用演示内容补齐。 */
export const toggleRole = (c: ThemeConfig, role: ThemeRole): ThemeConfig => {
  const ord = orderOf(c);
  if (ord.includes(role)) return {...c, order: ord.filter((r) => r !== role)};
  const content: ThemeContent = c.content[role]
    ? c.content
    : {...c.content, [role]: DEMO_CONTENT[role]};
  return {...c, order: [...ord, role], content};
};

/** 在顺序里上移(-1)/下移(+1)某场景。 */
export const moveRole = (c: ThemeConfig, role: ThemeRole, dir: -1 | 1): ThemeConfig => {
  const ord = [...orderOf(c)];
  const i = ord.indexOf(role);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ord.length) return c;
  [ord[i], ord[j]] = [ord[j], ord[i]];
  return {...c, order: ord};
};

/** 覆盖某个共享样式字段。 */
export const setStyle = (
  c: ThemeConfig,
  key: keyof ThemeStyle,
  val: string | number
): ThemeConfig => ({...c, style: {...c.style, [key]: val}});

/** 覆盖某个时序字段。 */
export const setTiming = (c: ThemeConfig, key: keyof Timing, val: number): ThemeConfig => ({
  ...c,
  timing: {...effTiming(c), [key]: val},
});

/** 替换文字内容（编辑器用）。 */
export const setContent = (c: ThemeConfig, content: ThemeContent): ThemeConfig => ({...c, content});


