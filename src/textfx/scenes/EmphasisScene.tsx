import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {TextFx} from '../TextFx';
import {effectById} from '../library';
import {SeqTiming, seqAt} from './sequence';
import {clamp01, DEFAULT_FONT_FAMILY, pickPhaseEffectId} from '../shared';

/**
 * 场景 · Emphasis 行内强调
 *  一句话里某个词/数字被"点出来"：周边文字先淡入，强调词用动效原子登场并高亮。
 *  适合：关键词高亮、数字强调、解说重点。
 */
export type EmphasisLine = {pre: string; token: string; post: string; effectId: number; inEffectId?: number; outEffectId?: number; accent?: string};

export const EmphasisScene: React.FC<{
  lines: EmphasisLine[];
  timing?: SeqTiming;
  background?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  letterSpacing?: number;
  align?: 'left' | 'center' | 'right';
  showLabel?: boolean;
}> = ({
  lines,
  timing = {inF: 16, holdF: 42, outF: 12},
  background = 'radial-gradient(circle at 50% 50%, #161a2e 0%, #0a0c16 70%)',
  color = '#e7ecff',
  fontSize = 88,
  fontWeight = 800,
  fontFamily = DEFAULT_FONT_FAMILY,
  letterSpacing = 0,
  align = 'center',
  showLabel = true,
}) => {
  const frame = useCurrentFrame();
  const {active, phase, t} = seqAt(frame, timing);
  const line = lines[Math.min(active, lines.length - 1)];
  if (!line) return <AbsoluteFill style={{background}} />;
  const fx = effectById(pickPhaseEffectId(line, phase));
  const accent = line.accent ?? '#ffd23f';
  const baseOpacity = phase === 'in' ? clamp01(t * 2) : 1 - clamp01(t * 2);

  return (
    <AbsoluteFill style={{background, color, fontFamily}}>
      {showLabel ? (
        <div style={{position: 'absolute', left: 60, top: 48, fontSize: 24, letterSpacing: 4, color: '#5b6688'}}>
          EMPHASIS · 行内强调
        </div>
      ) : null}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 160px'}}>
        <div style={{fontSize, fontWeight, letterSpacing, lineHeight: 1.4, textAlign: align}}>
          <span style={{opacity: baseOpacity}}>{line.pre}</span>
          <span style={{color: accent, margin: '0 6px', display: 'inline-block'}}>
            <TextFx
              key={active}
              effect={fx}
              text={line.token}
              phase={phase}
              t={t}
              frame={frame}
              seed={active + 1}
              baseStyle={{fontSize, fontWeight: Math.max(fontWeight, 900), letterSpacing, color: accent, whiteSpace: 'nowrap'}}
            />
          </span>
          <span style={{opacity: baseOpacity}}>{line.post}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
