import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {TextFx} from '../TextFx';
import {effectById} from '../library';
import {SeqTiming, seqAt} from './sequence';
import {DEFAULT_FONT_FAMILY, alignToFlex, pickPhaseEffectId} from '../shared';

/**
 * 场景 · Caption 字幕
 *  下三分之一、可读性优先：快速进出、原地替换，停留时长占多数。
 *  适合：对白字幕、解说词、轻量说明。同一时刻只有一条，不堆叠。
 */
export type CaptionLine = {text: string; effectId: number; inEffectId?: number; outEffectId?: number};

export const CaptionScene: React.FC<{
  lines: CaptionLine[];
  timing?: SeqTiming;
  background?: string;
  barColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  letterSpacing?: number;
  align?: 'left' | 'center' | 'right';
  offsetX?: number;
  offsetY?: number;
  showLabel?: boolean;
}> = ({
  lines,
  timing = {inF: 10, holdF: 44, outF: 8},
  background = 'linear-gradient(180deg, #0a1020 0%, #0d1426 100%)',
  barColor = 'rgba(10,14,26,0.72)',
  color = '#f2f6ff',
  fontSize = 64,
  fontWeight = 700,
  fontFamily = DEFAULT_FONT_FAMILY,
  letterSpacing = 0,
  align = 'center',
  offsetX = 0,
  offsetY = 0,
  showLabel = true,
}) => {
  const frame = useCurrentFrame();
  const {active, phase, t} = seqAt(frame, timing);
  const line = lines[Math.min(active, lines.length - 1)];
  const fx = line ? effectById(pickPhaseEffectId(line, phase)) : null;

  return (
    <AbsoluteFill style={{background, fontFamily}}>
      {showLabel ? (
        <div style={{position: 'absolute', left: 60, top: 48, fontSize: 24, letterSpacing: 4, color: '#5b6688'}}>
          CAPTION · 下三分之一字幕
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 110 + offsetY * -1,
          display: 'flex',
          justifyContent: alignToFlex(align),
          padding: '0 80px',
          transform: `translateX(${offsetX}px)`,
        }}
      >
        <div
          style={{
            background: barColor,
            padding: '20px 48px',
            borderRadius: 14,
            maxWidth: 1500,
            textAlign: align,
            boxShadow: '0 18px 60px rgba(0,0,0,0.4)',
          }}
        >
          {fx && line ? (
            <TextFx
              key={active}
              effect={fx}
              text={line.text}
              phase={phase}
              t={t}
              frame={frame}
              seed={active + 1}
              baseStyle={{fontSize, fontWeight, letterSpacing, color, lineHeight: 1.2, whiteSpace: 'normal'}}
            />
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
