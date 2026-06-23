import {z} from 'zod';

/**
 * 各场景的 props schema。其他 AI / 调用方可据此构造 `--props='{...}'` JSON，
 * 零改代码渲染任意文字 + 任意动效原子（effectId ∈ [1,100]）。
 */

export const effectIdSchema = z.number().int().min(1).max(100);

/**
 * 一段文字引用的动效原子。`effectId` 为基准；可选 `inEffectId`/`outEffectId`
 * 分别覆盖入场/出场（缺省时两端都用 `effectId`）。这让主题/配置能独立切换进出。
 */
export const effectRefShape = {
  effectId: effectIdSchema,
  inEffectId: effectIdSchema.optional(),
  outEffectId: effectIdSchema.optional(),
};

export const alignSchema = z.enum(['left', 'center', 'right']);
export const vAlignSchema = z.enum(['top', 'center', 'bottom']);

/**
 * 通用排版/位置参数（全部可选，缺省即用各场景的现有默认值）。
 * 让调用方零改代码即可定义字重 / 字体 / 字间距 / 对齐 / 位置偏移。
 */
export const styleSchema = z.object({
  fontWeight: z.number().int().positive().optional(),
  fontFamily: z.string().optional(),
  letterSpacing: z.number().optional(),
  align: alignSchema.optional(),
  offsetX: z.number().optional(),
  offsetY: z.number().optional(),
  showLabel: z.boolean().optional(),
});
export type StyleProps = z.infer<typeof styleSchema>;

export const timingSchema = z.object({
  inF: z.number().int().positive(),
  holdF: z.number().int().nonnegative(),
  outF: z.number().int().positive(),
});
export type Timing = z.infer<typeof timingSchema>;

export const heroSchema = z
  .object({
    entries: z.array(
      z.object({text: z.string(), sub: z.string().optional(), ...effectRefShape})
    ),
    timing: timingSchema,
    background: z.string(),
    color: z.string(),
    fontSize: z.number().positive(),
  })
  .merge(styleSchema)
  .extend({
    vAlign: vAlignSchema.optional(),
    subSize: z.number().positive().optional(),
    subColor: z.string().optional(),
  });
export type HeroProps = z.infer<typeof heroSchema>;

export const captionSchema = z.object({
  lines: z.array(z.object({text: z.string(), ...effectRefShape})),
  timing: timingSchema,
  background: z.string(),
  barColor: z.string(),
  color: z.string(),
  fontSize: z.number().positive(),
}).merge(styleSchema);
export type CaptionProps = z.infer<typeof captionSchema>;

export const listSchema = z.object({
  title: z.string(),
  items: z.array(z.object({text: z.string(), ...effectRefShape})),
  stepFrames: z.number().int().positive(),
  inFrames: z.number().int().positive(),
  background: z.string(),
  color: z.string(),
  fontSize: z.number().positive(),
}).merge(styleSchema);
export type ListProps = z.infer<typeof listSchema>;

export const lowerThirdSchema = z.object({
  entries: z.array(
    z.object({name: z.string(), role: z.string(), ...effectRefShape})
  ),
  timing: timingSchema,
  background: z.string(),
  accent: z.string(),
}).merge(styleSchema);
export type LowerThirdProps = z.infer<typeof lowerThirdSchema>;

export const emphasisSchema = z.object({
  lines: z.array(
    z.object({
      pre: z.string(),
      token: z.string(),
      post: z.string(),
      ...effectRefShape,
      accent: z.string().optional(),
    })
  ),
  timing: timingSchema,
  background: z.string(),
  color: z.string(),
  fontSize: z.number().positive(),
}).merge(styleSchema);
export type EmphasisProps = z.infer<typeof emphasisSchema>;

export const gallerySchema = z.object({
  effectIds: z.array(effectIdSchema),
  background: z.string(),
  color: z.string(),
  fontSize: z.number().positive(),
}).merge(styleSchema);
export type GalleryProps = z.infer<typeof gallerySchema>;

export const thumbSchema = z.object({
  effectId: effectIdSchema,
  background: z.string(),
  color: z.string(),
  fontSize: z.number().positive(),
});
export type ThumbProps = z.infer<typeof thumbSchema>;

export const wallSchema = z.object({
  effectIds: z.array(effectIdSchema),
  columns: z.number().int().positive(),
  loopFrames: z.number().int().positive(),
  background: z.string(),
  color: z.string(),
});
export type WallProps = z.infer<typeof wallSchema>;

/** 多场景串联成片：每个片段 = {type, props}。 */
export const segmentSchema = z.discriminatedUnion('type', [
  z.object({type: z.literal('hero'), props: heroSchema}),
  z.object({type: z.literal('caption'), props: captionSchema}),
  z.object({type: z.literal('list'), props: listSchema}),
  z.object({type: z.literal('lowerThird'), props: lowerThirdSchema}),
  z.object({type: z.literal('emphasis'), props: emphasisSchema}),
  z.object({type: z.literal('gallery'), props: gallerySchema}),
]);
export type ReelSegment = z.infer<typeof segmentSchema>;

export const reelSchema = z.object({segments: z.array(segmentSchema)});
export type ReelProps = z.infer<typeof reelSchema>;

/** 时长计算（帧）。供 Remotion calculateMetadata 使用。 */
const slot = (t: Timing): number => t.inF + t.holdF + t.outF;

export const heroFrames = (p: {entries: unknown[]; timing: Timing}): number =>
  Math.max(1, p.entries.length) * slot(p.timing);
export const captionFrames = (p: {lines: unknown[]; timing: Timing}): number =>
  Math.max(1, p.lines.length) * slot(p.timing);
export const lowerThirdFrames = (p: {entries: unknown[]; timing: Timing}): number =>
  Math.max(1, p.entries.length) * slot(p.timing);
export const emphasisFrames = (p: {lines: unknown[]; timing: Timing}): number =>
  Math.max(1, p.lines.length) * slot(p.timing);
export const listFrames = (p: {items: unknown[]; stepFrames: number; inFrames: number}): number =>
  Math.max(0, p.items.length - 1) * p.stepFrames + p.inFrames + 30;
export const galleryFrames = (p: {effectIds: number[]}): number => (p.effectIds.length + 3) * 40;
export const wallFrames = (p: {loopFrames: number}): number => p.loopFrames * 2;

export const segmentFrames = (s: ReelSegment): number => {
  switch (s.type) {
    case 'hero':
      return heroFrames(s.props);
    case 'caption':
      return captionFrames(s.props);
    case 'list':
      return listFrames(s.props);
    case 'lowerThird':
      return lowerThirdFrames(s.props);
    case 'emphasis':
      return emphasisFrames(s.props);
    case 'gallery':
      return galleryFrames(s.props);
  }
};

export const reelFrames = (p: {segments: ReelSegment[]}): number =>
  Math.max(1, p.segments.reduce((acc, s) => acc + segmentFrames(s), 0));
