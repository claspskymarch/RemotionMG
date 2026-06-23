import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {TextFx} from '../TextFx';
import {effectById} from '../library';
import {clamp01, DEFAULT_FONT_FAMILY, pickPhaseEffectId} from '../shared';

/**
 * 场景 · List 逐条列表（Build）
 *  条目依次入场并**持续累积**（不出场），强调"逐条建立"。
 *  适合：要点列表、排行榜、清单、功能罗列。
 */
export type ListItem = {text: string; effectId: number; inEffectId?: number; outEffectId?: number};

export const ListScene: React.FC<{
  title?: string;
  items: ListItem[];
  stepFrames?: number;
  inFrames?: number;
  background?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  letterSpacing?: number;
  showLabel?: boolean;
}> = ({
  title = '逐条列表',
  items,
  stepFrames = 22,
  inFrames = 18,
  background = 'linear-gradient(135deg, #101a33 0%, #0a1020 100%)',
  color = '#eaf0ff',
  fontSize = 70,
  fontWeight = 700,
  fontFamily = DEFAULT_FONT_FAMILY,
  letterSpacing = 0,
  showLabel = true,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background, color, fontFamily}}>
      {showLabel ? (
        <div style={{position: 'absolute', left: 140, top: 110, fontSize: 40, fontWeight: 800, letterSpacing: 4, color: '#6fa0ff'}}>
          {title}
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 140, top: 230, right: 140, display: 'flex', flexDirection: 'column', gap: 28}}>
        {items.map((it, i) => {
          const start = i * stepFrames;
          if (frame < start) return null;
          const t = clamp01((frame - start) / inFrames);
          const fx = effectById(pickPhaseEffectId(it, 'in'));
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28}}>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  background: '#4aa3ff',
                  opacity: t,
                  flex: '0 0 auto',
                  boxShadow: '0 0 18px rgba(74,163,255,0.7)',
                }}
              />
              <TextFx
                effect={fx}
                text={it.text}
                phase="in"
                t={t}
                frame={frame}
                seed={i + 1}
                baseStyle={{fontSize, fontWeight, letterSpacing, whiteSpace: 'normal'}}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const listTotalFrames = (count: number, stepFrames = 22, inFrames = 18, tail = 30): number =>
  (count - 1) * stepFrames + inFrames + tail;
