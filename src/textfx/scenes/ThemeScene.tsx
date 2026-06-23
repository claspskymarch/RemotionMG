import React from 'react';
import {ReelScene} from './ReelScene';
import {ThemeConfig, resolveThemeConfig} from '../themes';

/**
 * 场景 · Theme 主题成片
 *  输入一份"主题配置"（主题名 + 文字内容 + 可选逐场景覆盖），解析成多场景串联成片。
 *  这就是"选一个主题即出整套协调动效"的合成；其 props（ThemeConfig）即单一事实源。
 */
export const ThemeScene: React.FC<ThemeConfig> = (config) => {
  const {segments} = resolveThemeConfig(config);
  return <ReelScene segments={segments} />;
};
