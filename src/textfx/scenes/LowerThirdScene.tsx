import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {TextFx} from '../TextFx';
import {effectById} from '../library';
import {SeqTiming, seqAt} from './sequence';
import {clamp01, easeOutCubic, lerp, DEFAULT_FONT_FAMILY, pickPhaseEffectId} from '../shared';

/**
 * 场景 · Lower-third 角标 / 署名
 *  带品牌底条，从左侧滑入 → 停留 → 滑出；主名用动效原子入场，副行说明淡入。
 *  适合：人物署名、地点角标、栏目标识。
 */
export type LowerThirdEntry = {name: string; role: string; effectId: number; inEffectId?: number; outEffectId?: number};

export const LowerThirdScene: React.FC<{
  entries: LowerThirdEntry[];
  timing?: SeqTiming;
  background?: string;
  accent?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  letterSpacing?: number;
  offsetX?: number;
  offsetY?: number;
  showLabel?: boolean;
}> = ({
  entries,
  timing = {inF: 16, holdF: 40, outF: 14},
  background = 'linear-gradient(120deg, #0b1530 0%, #0a0f1f 100%)',
  accent = '#ff7a3c',
  fontSize = 88,
  fontWeight = 900,
  fontFamily = DEFAULT_FONT_FAMILY,
  letterSpacing = 0,
  offsetX = 0,
  offsetY = 0,
  showLabel = true,
}) => {
  const frame = useCurrentFrame();
  const {active, phase, t} = seqAt(frame, timing);
  const entry = entries[Math.min(active, entries.length - 1)];
  if (!entry) return <AbsoluteFill style={{background}} />;
  const fx = effectById(pickPhaseEffectId(entry, phase));

  const slide = phase === 'in' ? easeOutCubic(clamp01(t)) : 1 - easeOutCubic(clamp01(t));
  const boxX = lerp(-120, 0, slide);
  const roleOpacity = phase === 'in' ? clamp01((t - 0.4) / 0.5) : slide;

  return (
    <AbsoluteFill style={{background, fontFamily}}>
      {showLabel ? (
        <div style={{position: 'absolute', left: 60, top: 48, fontSize: 24, letterSpacing: 4, color: '#5b6688'}}>
          LOWER-THIRD · 角标 / 署名
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 150 + offsetX,
          bottom: 170 - offsetY,
          transform: `translateX(${boxX}px)`,
          opacity: clamp01(slide * 1.3),
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        <div style={{width: 10, background: accent, borderRadius: 4, marginRight: 26, boxShadow: `0 0 22px ${accent}`}} />
        <div>
          <div style={{fontSize, fontWeight, color: '#ffffff', lineHeight: 1.05}}>
            <TextFx
              key={active}
              effect={fx}
              text={entry.name}
              phase={phase}
              t={t}
              frame={frame}
              seed={active + 1}
              baseStyle={{fontSize, fontWeight, letterSpacing, color: '#ffffff'}}
            />
          </div>
          <div style={{fontSize: Math.round(fontSize * 0.41), color: accent, marginTop: 10, letterSpacing: 2, opacity: roleOpacity}}>
            {entry.role}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
