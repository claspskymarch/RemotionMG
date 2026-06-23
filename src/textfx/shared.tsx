import React from 'react';
import {Phase} from './types';

export {
  clamp01,
  clamp,
  lerp,
  smoothstep,
  rand,
  rand2,
  noise1,
  easeOutBack,
  easeInBack,
  easeOutCubic,
  easeOutElastic,
} from '../effects/showcaseKit';

import {clamp01, lerp, easeOutCubic, rand2} from '../effects/showcaseKit';

/** 场景默认字体族（中英文兼容）。 */
export const DEFAULT_FONT_FAMILY = 'Arial, "PingFang SC", "Microsoft YaHei", sans-serif';

/** 水平对齐 → flex 主轴/CSS textAlign。 */
export const alignToFlex = (a?: 'left' | 'center' | 'right'): 'flex-start' | 'center' | 'flex-end' =>
  a === 'left' ? 'flex-start' : a === 'right' ? 'flex-end' : 'center';

/** 垂直对齐 → flex 主轴。 */
export const vAlignToFlex = (a?: 'top' | 'center' | 'bottom'): 'flex-start' | 'center' | 'flex-end' =>
  a === 'top' ? 'flex-start' : a === 'bottom' ? 'flex-end' : 'center';

/**
 * 按当前阶段挑选该段文字应使用的原子编号：
 *  - phase='out'：outEffectId ?? effectId
 *  - 否则（in/hold）：inEffectId ?? effectId
 * 让入场与出场可以分别指定不同原子；缺省时两端共用 effectId（向后兼容）。
 */
export const pickPhaseEffectId = (
  e: {effectId: number; inEffectId?: number; outEffectId?: number},
  phase: Phase
): number => (phase === 'out' ? e.outEffectId ?? e.effectId : e.inEffectId ?? e.effectId);

/**
 * 在场度 presence ∈ [0,1]：1 = 完全到位（稳定态），0 = 完全缺席。
 *  - phase='in'：presence = ease(t)
 *  - phase='out'：presence = 1 - ease(t)
 * 大多数原子的视觉都可写成 presence 的函数，从而自动同时得到入场与出场。
 */
export const presence = (
  phase: Phase,
  t: number,
  ease: (x: number) => number = easeOutCubic
): number => (phase === 'in' ? ease(clamp01(t)) : 1 - ease(clamp01(t)));

/** 确定性正态近似（Box-Muller 简化），种子一致 */
export const randn = (seed: number): number => {
  const u1 = Math.max(1e-6, rand2(seed, 1.1));
  const u2 = rand2(seed, 2.2);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
};

/** 逐字渲染：charStyle 给每个字符返回样式（用于交错/波浪/多米诺/粒子散入等） */
export const PerChar: React.FC<{
  text: string;
  charStyle: (i: number, N: number) => React.CSSProperties;
  charWrap?: (i: number, N: number) => React.CSSProperties;
}> = ({text, charStyle, charWrap}) => {
  const chars = Array.from(text);
  const N = chars.length;
  return (
    <>
      {chars.map((ch, i) => (
        <span
          key={i}
          style={{display: 'inline-block', whiteSpace: 'pre', ...charWrap?.(i, N)}}
        >
          <span style={{display: 'inline-block', ...charStyle(i, N)}}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        </span>
      ))}
    </>
  );
};

const GLYPHS = 'アカサタナ01XΞΨ#%&@王金木水火土π∑∆◇▦';
export const randGlyph = (seed: number): string =>
  GLYPHS[Math.floor(rand2(Math.floor(seed), 7.3) * GLYPHS.length)] ?? '#';

/** 乱码解码渲染：随进度逐字锁定为真字 */
export const Scramble: React.FC<{
  text: string;
  a: number; // 0→1 解码进度
  frame: number;
  seed: number;
  scrambleColor?: string;
}> = ({text, a, frame, seed, scrambleColor = '#ff4d6d'}) => {
  const chars = Array.from(text);
  const N = chars.length;
  return (
    <>
      {chars.map((ch, i) => {
        const lock = (i / Math.max(N, 1)) * 0.85;
        const locked = a > lock + 0.12;
        return (
          <span key={i} style={{color: locked ? 'inherit' : scrambleColor}}>
            {locked ? ch : randGlyph(frame * 0.5 + i * 31 + seed)}
          </span>
        );
      })}
    </>
  );
};
