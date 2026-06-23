import {writeFileSync} from 'fs';
import {join} from 'path';
import {EFFECT_MANIFEST, SCENE_MANIFEST, CATEGORIES} from '../src/textfx/manifest';
import {THEME_MANIFEST} from '../src/textfx/themes';

const out = {
  $comment:
    'Auto-generated. 100 个文字动效原子 + 场景模板 + 主题预设的机读清单。渲染：npx remotion render <scene.id> out.mp4 --props=<json>。主题用法：渲染 SceneTheme，props={"theme":"<id>","content":{...}}，逐场景可加 effects.<role>={inEffectId,outEffectId} 覆盖。',
  categories: CATEGORIES,
  themes: THEME_MANIFEST,
  effects: EFFECT_MANIFEST,
  scenes: SCENE_MANIFEST,
};

const path = join(process.cwd(), 'docs', 'effects.json');
writeFileSync(path, JSON.stringify(out, null, 2) + '\n');
console.log(`wrote ${EFFECT_MANIFEST.length} effects + ${SCENE_MANIFEST.length} scenes -> ${path}`);
