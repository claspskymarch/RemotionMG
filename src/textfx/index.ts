/**
 * textfx —— 统一出口（其他 AI / 调用方只需从这里导入）。
 *
 * 三层：
 *   1) 效果库：EFFECTS / effectById —— 100 个纯动效原子（id 1..100）
 *   2) 渲染器：TextFx —— 把一个原子作用到一段文字上
 *   3) 场景模板：HeroScene / CaptionScene / ... —— 负责布局/角色/堆叠
 *
 * 机读清单：EFFECT_MANIFEST / SCENE_MANIFEST / CATEGORIES
 * 每个场景的 Zod schema 与默认 props 也从此导出，可直接拼 `--props` JSON。
 */

// 类型与核心
export * from './types';
export {TextFx} from './TextFx';
export {EFFECTS, EFFECT_BY_ID, effectById} from './library';

// 共享构件（用于自定义新原子）
export {presence, PerChar, Scramble} from './shared';

// 场景模板
export {HeroScene} from './scenes/HeroScene';
export {CaptionScene} from './scenes/CaptionScene';
export {ListScene} from './scenes/ListScene';
export {LowerThirdScene} from './scenes/LowerThirdScene';
export {EmphasisScene} from './scenes/EmphasisScene';
export {GalleryScene} from './scenes/GalleryScene';
export {ReelScene} from './scenes/ReelScene';
export {ThumbScene} from './scenes/ThumbScene';
export {WallScene} from './scenes/WallScene';
export {seqAt, slotLen} from './scenes/sequence';

export {ThemeScene} from './scenes/ThemeScene';

// schema / 时长 / 默认 props
export * from './schemas';
export * from './presets';

// 主题系统（一键成套动效）
export * from './themes';

// 机读清单
export * from './manifest';
