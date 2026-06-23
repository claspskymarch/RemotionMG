import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

/**
 * 主题配置器（P2）的 Vite 配置。
 * 以 configurator/ 为根，从 ../src 直接复用 Remotion 场景与主题数据层。
 * 启动：npm run dev:ui   构建：npm run build:ui（产物在 dist-ui/）。
 */
export default defineConfig({
  root: new URL('.', import.meta.url).pathname,
  plugins: [react()],
  server: {port: 5173, host: true},
  build: {outDir: new URL('../dist-ui/', import.meta.url).pathname, emptyOutDir: true},
});
