import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {TextFx} from '../TextFx';
import {EFFECTS, effectById} from '../library';
import {clamp01, lerp, easeOutCubic, DEFAULT_FONT_FAMILY} from '../shared';

/**
 * 场景 · Gallery 目录陈列
 *  顺序把"效果库"里的原子逐个推上主角位（用各自的入场/出场），刚离场的沉淀为
 *  左上角的历史栈、按龄缩小淡出。用于一屏浏览整个库 / 做 demo reel。
 *  —— 这是一个"特定但合法"的场景：把库本身当成内容来陈列。
 */
export const GallerySEG = 40;

export const GalleryScene: React.FC<{
  effectIds?: number[];
  background?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  letterSpacing?: number;
  showLabel?: boolean;
}> = ({
  effectIds,
  background = 'radial-gradient(circle at 50% 42%, #16213f 0%, #0a0e1c 60%, #05060d 100%)',
  color = '#ffffff',
  fontSize = 150,
  fontWeight = 900,
  fontFamily = DEFAULT_FONT_FAMILY,
  letterSpacing = 0,
  showLabel = true,
}) => {
  const frame = useCurrentFrame();
  const effects = effectIds && effectIds.length > 0 ? effectIds.map(effectById) : EFFECTS;
  const active = Math.floor(frame / GallerySEG);

  return (
    <AbsoluteFill style={{background, color, fontFamily}}>
      {showLabel ? (
        <div style={{position: 'absolute', left: 60, top: 48, fontSize: 24, letterSpacing: 4, color: '#5b6688'}}>
          GALLERY · 目录陈列 · {Math.min(active + 1, effects.length)} / {effects.length}
        </div>
      ) : null}

      {effects.map((fx, i) => {
        const d = (frame - i * GallerySEG) / GallerySEG;
        if (d < 0) return null;
        const isFeatured = d >= 0 && d < 1;

        if (isFeatured) {
          // 主角：用效果自身的入场（前 60%）→ 停留 →（在切换瞬间由下一个接管）
          const t = clamp01(d / 0.6);
          return (
            <AbsoluteFill key={fx.id} style={{alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
              <TextFx
                effect={fx}
                text={fx.name}
                phase="in"
                t={t}
                frame={frame}
                seed={i + 1}
                baseStyle={{fontSize, fontWeight, letterSpacing, lineHeight: 1, textAlign: 'center'}}
              />
              <div style={{marginTop: 30, fontSize: 30, color: '#8ea0d6', opacity: clamp01((t - 0.5) / 0.4)}}>
                {fx.category}
                {String(fx.id).padStart(2, '0')} · {fx.enName}
              </div>
            </AbsoluteFill>
          );
        }

        // 历史：左上角竖列，按龄缩小淡出
        const age = d - 1; // 0 = 刚离场
        const rank = Math.min(age, 5);
        const moveIn = clamp01(age / 0.5);
        const x = lerp(960, 250, easeOutCubic(moveIn));
        const y = lerp(540, 250 + rank * 70, easeOutCubic(moveIn));
        const scale = lerp(1, 0.26 * Math.pow(0.85, rank), easeOutCubic(moveIn));
        const opacity = age > 4 ? clamp01(5 - age) : 1;
        if (opacity <= 0) return null;
        return (
          <div
            key={fx.id}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%,-50%) scale(${scale})`,
              opacity: opacity * 0.85,
              whiteSpace: 'nowrap',
              fontSize,
              fontWeight,
              letterSpacing,
              color: '#8ea0d6',
              zIndex: i,
            }}
          >
            <span style={{color: '#4aa3ff'}}>
              {fx.category}
              {String(fx.id).padStart(2, '0')}
            </span>{' '}
            {fx.name}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const galleryTotalFrames = (count: number, tail = 3): number => (count + tail) * GallerySEG;
