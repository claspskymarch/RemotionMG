import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {TextFx} from '../TextFx';
import {effectById} from '../library';
import {SeqTiming, seqAt} from './sequence';
import {clamp01, DEFAULT_FONT_FAMILY, alignToFlex, vAlignToFlex, pickPhaseEffectId} from '../shared';

/**
 * 场景 · Hero 主标题
 *  单段超大文字居中，戏剧化入场 → 停留 → 戏剧化出场，**不堆叠**。
 *  适合：片头、章节大字报、kinetic typography 高光时刻。
 *
 *  排版/位置全部可由 props 定义（字号/字重/字体/对齐/垂直对齐/位置偏移/副标题样式）。
 */
export type HeroEntry = {text: string; sub?: string; effectId: number; inEffectId?: number; outEffectId?: number};

export const HeroScene: React.FC<{
  entries: HeroEntry[];
  timing?: SeqTiming;
  background?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  letterSpacing?: number;
  align?: 'left' | 'center' | 'right';
  vAlign?: 'top' | 'center' | 'bottom';
  offsetX?: number;
  offsetY?: number;
  subSize?: number;
  subColor?: string;
  showLabel?: boolean;
}> = ({
  entries,
  timing = {inF: 22, holdF: 40, outF: 18},
  background = 'radial-gradient(circle at 50% 42%, #1b1f3a 0%, #0c0e1c 60%, #05060d 100%)',
  color = '#ffffff',
  fontSize = 200,
  fontWeight = 900,
  fontFamily = DEFAULT_FONT_FAMILY,
  letterSpacing = 0,
  align = 'center',
  vAlign = 'center',
  offsetX = 0,
  offsetY = 0,
  subSize = 34,
  subColor = '#9fb2e6',
  showLabel = true,
}) => {
  const frame = useCurrentFrame();
  const {active, phase, t} = seqAt(frame, timing);
  const entry = entries[Math.min(active, entries.length - 1)];
  if (!entry) return <AbsoluteFill style={{background}} />;
  const fx = effectById(pickPhaseEffectId(entry, phase));
  const subOpacity = phase === 'in' ? clamp01((t - 0.4) / 0.5) : 1 - clamp01(t * 2);

  return (
    <AbsoluteFill style={{background, color, fontFamily}}>
      <AbsoluteFill
        style={{
          alignItems: alignToFlex(align),
          justifyContent: vAlignToFlex(vAlign),
          flexDirection: 'column',
          padding: '64px 80px',
          transform: `translate(${offsetX}px, ${offsetY}px)`,
        }}
      >
        <TextFx
          key={active}
          effect={fx}
          text={entry.text}
          phase={phase}
          t={t}
          frame={frame}
          seed={active + 1}
          baseStyle={{fontSize, fontWeight, letterSpacing, lineHeight: 1, textAlign: align}}
        />
        {entry.sub ? (
          <div style={{marginTop: 36, fontSize: subSize, letterSpacing: 6, color: subColor, opacity: subOpacity}}>
            {entry.sub}
          </div>
        ) : null}
      </AbsoluteFill>
      {showLabel ? (
        <div style={{position: 'absolute', left: 60, top: 48, fontSize: 24, letterSpacing: 4, color: '#5b6688'}}>
          HERO · {fx.category}{String(fx.id).padStart(2, '0')} · {fx.enName}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
