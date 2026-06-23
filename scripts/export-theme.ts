/**
 * CLI 导出主题包（与配置器导出完全一致的内容）。
 *
 * 用法 / Usage:
 *   npm run export:theme -- <themeId|path-to-theme.json> [outDir]
 * 例 / e.g.:
 *   npm run export:theme -- glitch
 *   npm run export:theme -- ./my-theme.json dist-themes/mine
 *
 * 缺省输出到 dist-themes/<theme>-pack/。
 */
import {writeFileSync, mkdirSync, readFileSync, existsSync, chmodSync} from 'fs';
import {join, resolve} from 'path';
import {buildPack, packBaseName} from '../src/textfx/exportPack';
import {themeConfigSchema, ThemeConfig, THEME_CONFIG_DEFAULT, DEMO_CONTENT, themeIds} from '../src/textfx/themes';

const arg = process.argv[2];
if (!arg) {
  console.error('用法: npm run export:theme -- <themeId|theme.json> [outDir]');
  console.error(`可用主题 / themes: ${themeIds.join(', ')}`);
  process.exit(1);
}

let config: ThemeConfig;
if (arg.endsWith('.json') || existsSync(arg)) {
  const raw = JSON.parse(readFileSync(resolve(arg), 'utf8'));
  config = themeConfigSchema.parse(raw);
} else if (themeIds.includes(arg)) {
  // 仅给主题名：用演示内容生成一份可直接渲染的成片配置。
  config = {theme: arg, content: DEMO_CONTENT};
} else {
  console.error(`未知主题 "${arg}"。可用 / available: ${themeIds.join(', ')}`);
  process.exit(1);
}

const outDir = resolve(process.argv[3] ?? join('dist-themes', packBaseName(config)));
mkdirSync(outDir, {recursive: true});

for (const f of buildPack(config)) {
  const p = join(outDir, f.name);
  writeFileSync(p, f.content);
  if (f.name.endsWith('.sh')) chmodSync(p, 0o755);
}

void THEME_CONFIG_DEFAULT;
console.log(`导出主题包 -> ${outDir}`);
console.log('  theme.json · README.md · render.sh');
