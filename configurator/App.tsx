import {useMemo, useState, CSSProperties} from 'react';
import {Player} from '@remotion/player';
import {ThemeScene} from '../src/textfx/scenes/ThemeScene';
import {
  ThemeConfig,
  ThemeRole,
  ThemeContent,
  themeIds,
  THEMES,
  getTheme,
  themeConfigFrames,
  THEME_CONFIG_DEFAULT,
} from '../src/textfx/themes';
import {EFFECT_MANIFEST, CATEGORIES} from '../src/textfx/manifest';
import {
  orderOf,
  effEffect,
  effStyle,
  effTiming,
  hasOverrides,
  switchTheme,
  resetOverrides,
  setEffect,
  toggleRole,
  moveRole,
  setStyle,
  setTiming,
  setContent,
  renderCommand,
} from './helpers';

const ROLE_LABEL: Record<ThemeRole, string> = {
  hero: '主标题 Hero',
  list: '列表 List',
  lowerThird: '角标 Lower-third',
  caption: '字幕 Caption',
  emphasis: '强调 Emphasis',
};
const ALL_ROLES: ThemeRole[] = ['hero', 'list', 'lowerThird', 'caption', 'emphasis'];

const FONT_OPTIONS: {label: string; value: string}[] = [
  {label: '无衬线 Sans', value: 'Arial, "PingFang SC", "Microsoft YaHei", sans-serif'},
  {label: '等宽 Mono', value: 'Menlo, Consolas, "Courier New", "PingFang SC", monospace'},
  {label: '衬线 Serif', value: 'Georgia, "Times New Roman", "Songti SC", SimSun, serif'},
];

/* ----------------------------- 样式 ----------------------------- */
const panel: CSSProperties = {background: '#121724', border: '1px solid #20283c', borderRadius: 10, padding: 14, marginBottom: 12};
const h3: CSSProperties = {margin: '0 0 10px', fontSize: 13, letterSpacing: 1, color: '#8fa1c4', textTransform: 'uppercase'};
const sel: CSSProperties = {width: '100%', background: '#0c1018', color: '#e6ebf5', border: '1px solid #2a3550', borderRadius: 6, padding: '6px 8px', fontSize: 13};
const inp: CSSProperties = {...sel};
const btn: CSSProperties = {background: '#1d2740', color: '#cfe0ff', border: '1px solid #33436b', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', fontSize: 12};
const btnPrimary: CSSProperties = {...btn, background: '#2b6cff', borderColor: '#2b6cff', color: '#fff'};
const row: CSSProperties = {display: 'flex', gap: 8, alignItems: 'center'};
const tag: CSSProperties = {fontSize: 11, color: '#7f8db0'};

/* ----------------------------- 原子选择器 ----------------------------- */
const EffectSelect: React.FC<{value: number; onChange: (v: number) => void}> = ({value, onChange}) => (
  <select style={sel} value={value} onChange={(e) => onChange(Number(e.target.value))}>
    {Object.keys(CATEGORIES).map((cat) => (
      <optgroup key={cat} label={`${cat} · ${CATEGORIES[cat]}`}>
        {EFFECT_MANIFEST.filter((e) => e.category === cat).map((e) => (
          <option key={e.id} value={e.id}>
            {e.id} · {e.name} / {e.enName}
          </option>
        ))}
      </optgroup>
    ))}
  </select>
);

/* ----------------------------- 文字内容编辑 ----------------------------- */
const ContentEditor: React.FC<{role: ThemeRole; content: ThemeContent; onChange: (c: ThemeContent) => void}> = ({role, content, onChange}) => {
  if (role === 'hero') {
    const entries = content.hero?.entries ?? [];
    const set = (i: number, k: 'text' | 'sub', v: string) => {
      const next = entries.map((e, idx) => (idx === i ? {...e, [k]: v} : e));
      onChange({...content, hero: {entries: next}});
    };
    return (
      <div>
        {entries.map((e, i) => (
          <div key={i} style={{marginBottom: 6}}>
            <input style={inp} value={e.text} placeholder="标题" onChange={(ev) => set(i, 'text', ev.target.value)} />
            <input style={{...inp, marginTop: 4}} value={e.sub ?? ''} placeholder="副标题（可选）" onChange={(ev) => set(i, 'sub', ev.target.value)} />
          </div>
        ))}
      </div>
    );
  }
  if (role === 'caption') {
    const lines = content.caption?.lines ?? [];
    const set = (i: number, v: string) => onChange({...content, caption: {lines: lines.map((l, idx) => (idx === i ? {text: v} : l))}});
    const add = () => onChange({...content, caption: {lines: [...lines, {text: '新字幕'}]}});
    const del = (i: number) => onChange({...content, caption: {lines: lines.filter((_, idx) => idx !== i)}});
    return (
      <div>
        {lines.map((l, i) => (
          <div key={i} style={{...row, marginBottom: 6}}>
            <input style={inp} value={l.text} onChange={(ev) => set(i, ev.target.value)} />
            <button style={btn} onClick={() => del(i)}>×</button>
          </div>
        ))}
        <button style={btn} onClick={add}>+ 添加一行</button>
      </div>
    );
  }
  if (role === 'list') {
    const title = content.list?.title ?? '';
    const items = content.list?.items ?? [];
    const setTitle = (v: string) => onChange({...content, list: {title: v, items}});
    const setItem = (i: number, v: string) => onChange({...content, list: {title, items: items.map((t, idx) => (idx === i ? {text: v} : t))}});
    const add = () => onChange({...content, list: {title, items: [...items, {text: '新条目'}]}});
    const del = (i: number) => onChange({...content, list: {title, items: items.filter((_, idx) => idx !== i)}});
    return (
      <div>
        <input style={{...inp, marginBottom: 6}} value={title} placeholder="列表标题（可选）" onChange={(ev) => setTitle(ev.target.value)} />
        {items.map((t, i) => (
          <div key={i} style={{...row, marginBottom: 6}}>
            <input style={inp} value={t.text} onChange={(ev) => setItem(i, ev.target.value)} />
            <button style={btn} onClick={() => del(i)}>×</button>
          </div>
        ))}
        <button style={btn} onClick={add}>+ 添加条目</button>
      </div>
    );
  }
  if (role === 'lowerThird') {
    const entries = content.lowerThird?.entries ?? [];
    const set = (i: number, k: 'name' | 'role', v: string) => onChange({...content, lowerThird: {entries: entries.map((e, idx) => (idx === i ? {...e, [k]: v} : e))}});
    return (
      <div>
        {entries.map((e, i) => (
          <div key={i} style={{marginBottom: 6}}>
            <input style={inp} value={e.name} placeholder="姓名" onChange={(ev) => set(i, 'name', ev.target.value)} />
            <input style={{...inp, marginTop: 4}} value={e.role} placeholder="头衔" onChange={(ev) => set(i, 'role', ev.target.value)} />
          </div>
        ))}
      </div>
    );
  }
  // emphasis
  const lines = content.emphasis?.lines ?? [];
  const set = (i: number, k: 'pre' | 'token' | 'post', v: string) =>
    onChange({...content, emphasis: {lines: lines.map((l, idx) => (idx === i ? {...l, [k]: v} : l))}});
  return (
    <div>
      {lines.map((l, i) => (
        <div key={i} style={{...row, marginBottom: 6}}>
          <input style={{...inp, flex: 2}} value={l.pre} placeholder="前缀" onChange={(ev) => set(i, 'pre', ev.target.value)} />
          <input style={{...inp, flex: 1, color: '#ffd479'}} value={l.token} placeholder="高亮词" onChange={(ev) => set(i, 'token', ev.target.value)} />
          <input style={{...inp, flex: 2}} value={l.post} placeholder="后缀" onChange={(ev) => set(i, 'post', ev.target.value)} />
        </div>
      ))}
    </div>
  );
};

/* ----------------------------- 单场景卡片 ----------------------------- */
const SceneCard: React.FC<{
  role: ThemeRole;
  config: ThemeConfig;
  pos: number;
  count: number;
  update: (fn: (c: ThemeConfig) => ThemeConfig) => void;
}> = ({role, config, pos, count, update}) => {
  const eff = effEffect(config, role);
  const overridden = Boolean(config.effects?.[role]);
  const named = (id: number) => EFFECT_MANIFEST.find((e) => e.id === id);
  return (
    <div style={panel}>
      <div style={{...row, justifyContent: 'space-between'}}>
        <strong style={{fontSize: 14}}>{ROLE_LABEL[role]}</strong>
        <div style={row}>
          <button style={btn} disabled={pos === 0} onClick={() => update((c) => moveRole(c, role, -1))}>↑</button>
          <button style={btn} disabled={pos === count - 1} onClick={() => update((c) => moveRole(c, role, 1))}>↓</button>
          <button style={btn} onClick={() => update((c) => toggleRole(c, role))}>移除</button>
        </div>
      </div>

      <div style={{marginTop: 10}}>
        <div style={tag}>入场原子 In{!overridden && ' （主题默认）'}</div>
        <EffectSelect value={eff.inEffectId} onChange={(v) => update((c) => setEffect(c, role, 'inEffectId', v))} />
        <div style={{...tag, marginTop: 8}}>出场原子 Out</div>
        <EffectSelect value={eff.outEffectId} onChange={(v) => update((c) => setEffect(c, role, 'outEffectId', v))} />
        <div style={{...tag, marginTop: 6}}>
          当前：入 {eff.inEffectId} {named(eff.inEffectId)?.name} · 出 {eff.outEffectId} {named(eff.outEffectId)?.name}
        </div>
      </div>

      <div style={{marginTop: 10}}>
        <div style={tag}>文字内容</div>
        <ContentEditor role={role} content={config.content} onChange={(content) => update((c) => setContent(c, content))} />
      </div>
    </div>
  );
};

/* ----------------------------- 主应用 ----------------------------- */
export const App: React.FC = () => {
  const [config, setConfig] = useState<ThemeConfig>(THEME_CONFIG_DEFAULT);
  const [copied, setCopied] = useState<string>('');
  const update = (fn: (c: ThemeConfig) => ThemeConfig) => setConfig(fn);

  const order = orderOf(config);
  const disabledRoles = ALL_ROLES.filter((r) => !order.includes(r));
  const theme = getTheme(config.theme);
  const style = effStyle(config);
  const timing = effTiming(config);
  const json = useMemo(() => JSON.stringify(config, null, 2), [config]);
  const durationInFrames = useMemo(() => Math.max(1, themeConfigFrames(config)), [config]);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 1500);
    });
  };
  const download = () => {
    const blob = new Blob([json], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `theme.${config.theme}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div style={{display: 'grid', gridTemplateColumns: '440px 1fr', height: '100vh'}}>
      {/* 左：控制面板 */}
      <div style={{overflowY: 'auto', padding: 16, borderRight: '1px solid #1c2434'}}>
        <h1 style={{fontSize: 18, margin: '0 0 4px'}}>主题配置器</h1>
        <div style={{...tag, marginBottom: 14}}>主题粗选 → 单场景细调 → 实时预览 → 导出配置</div>

        <div style={panel}>
          <h3 style={h3}>主题 Theme</h3>
          <select style={sel} value={config.theme} onChange={(e) => update((c) => switchTheme(c, e.target.value))}>
            {themeIds.map((id) => (
              <option key={id} value={id}>
                {THEMES[id].name} · {THEMES[id].enName}
              </option>
            ))}
          </select>
          <div style={{...tag, marginTop: 8}}>{theme.description}</div>
          {hasOverrides(config) && (
            <button style={{...btn, marginTop: 10}} onClick={() => update(resetOverrides)}>
              重置为主题默认（清空覆盖）
            </button>
          )}
        </div>

        <h3 style={h3}>启用的场景（按出现顺序）</h3>
        {order.map((role, i) => (
          <SceneCard key={role} role={role} config={config} pos={i} count={order.length} update={update} />
        ))}

        {disabledRoles.length > 0 && (
          <div style={panel}>
            <h3 style={h3}>可添加场景</h3>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
              {disabledRoles.map((r) => (
                <button key={r} style={btn} onClick={() => update((c) => toggleRole(c, r))}>
                  + {ROLE_LABEL[r]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={panel}>
          <h3 style={h3}>共享样式 Style</h3>
          <div style={{...row, marginBottom: 8}}>
            <label style={{...tag, width: 70}}>主色 Accent</label>
            <input type="color" value={toHex(style.accent)} onChange={(e) => update((c) => setStyle(c, 'accent', e.target.value))} />
            <label style={{...tag, width: 70}}>文字 Color</label>
            <input type="color" value={toHex(style.color)} onChange={(e) => update((c) => setStyle(c, 'color', e.target.value))} />
          </div>
          <div style={{marginBottom: 8}}>
            <div style={tag}>字体 Font</div>
            <select style={sel} value={style.fontFamily} onChange={(e) => update((c) => setStyle(c, 'fontFamily', e.target.value))}>
              {FONT_OPTIONS.map((f) => (
                <option key={f.label} value={f.value}>{f.label}</option>
              ))}
              {!FONT_OPTIONS.some((f) => f.value === style.fontFamily) && <option value={style.fontFamily}>（主题默认）</option>}
            </select>
          </div>
          <div style={row}>
            <div style={{flex: 1}}>
              <div style={tag}>字重 {style.fontWeight}</div>
              <input type="range" min={100} max={900} step={100} value={style.fontWeight} style={{width: '100%'}} onChange={(e) => update((c) => setStyle(c, 'fontWeight', Number(e.target.value)))} />
            </div>
            <div style={{flex: 1}}>
              <div style={tag}>字距 {style.letterSpacing}</div>
              <input type="range" min={-2} max={12} step={1} value={style.letterSpacing} style={{width: '100%'}} onChange={(e) => update((c) => setStyle(c, 'letterSpacing', Number(e.target.value)))} />
            </div>
          </div>
          <div style={{marginTop: 8}}>
            <div style={tag}>背景 Background（CSS）</div>
            <input style={inp} value={style.background} onChange={(e) => update((c) => setStyle(c, 'background', e.target.value))} />
          </div>
        </div>

        <div style={panel}>
          <h3 style={h3}>节奏 Timing（帧）</h3>
          <div style={row}>
            {(['inF', 'holdF', 'outF'] as const).map((k) => (
              <div key={k} style={{flex: 1}}>
                <div style={tag}>{k}</div>
                <input type="number" style={inp} value={timing[k]} min={0} onChange={(e) => update((c) => setTiming(c, k, Number(e.target.value)))} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右：预览 + 导出 */}
      <div style={{overflowY: 'auto', padding: 16}}>
        <div style={{background: '#000', borderRadius: 10, overflow: 'hidden', border: '1px solid #1c2434'}}>
          <Player
            component={ThemeScene}
            inputProps={config}
            durationInFrames={durationInFrames}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{width: '100%', aspectRatio: '16 / 9'}}
            controls
            loop
            autoPlay
          />
        </div>

        <div style={{...panel, marginTop: 14}}>
          <div style={{...row, justifyContent: 'space-between', marginBottom: 8}}>
            <h3 style={{...h3, margin: 0}}>主题配置 JSON（单一事实源）</h3>
            <div style={row}>
              <button style={btnPrimary} onClick={() => copy(json, 'json')}>{copied === 'json' ? '已复制 ✓' : '复制 JSON'}</button>
              <button style={btn} onClick={download}>下载 theme.json</button>
            </div>
          </div>
          <pre style={{margin: 0, maxHeight: 280, overflow: 'auto', background: '#0a0d14', border: '1px solid #1c2434', borderRadius: 8, padding: 12, fontSize: 12, lineHeight: 1.5}}>{json}</pre>
        </div>

        <div style={panel}>
          <div style={{...row, justifyContent: 'space-between', marginBottom: 8}}>
            <h3 style={{...h3, margin: 0}}>渲染命令</h3>
            <button style={btn} onClick={() => copy(renderCommand(config), 'cmd')}>{copied === 'cmd' ? '已复制 ✓' : '复制命令'}</button>
          </div>
          <pre style={{margin: 0, overflow: 'auto', background: '#0a0d14', border: '1px solid #1c2434', borderRadius: 8, padding: 12, fontSize: 12}}>{renderCommand(config)}</pre>
        </div>
      </div>
    </div>
  );
};

/** 把任意 CSS 颜色尽量转成 #rrggbb 供 <input type=color> 使用（失败则回退黑色）。 */
function toHex(color: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  if (typeof document === 'undefined') return '#000000';
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return '#000000';
  ctx.fillStyle = '#000000';
  ctx.fillStyle = color;
  const v = ctx.fillStyle;
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v : '#000000';
}
