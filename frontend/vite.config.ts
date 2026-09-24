import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { buildParams, validateBuildParams } from './build.config'

// 开发启动（server）与构建（build）统一从 build.config.ts 取值，越界取值会在启动前报错并说明原因
const params = validateBuildParams(buildParams)

export default defineConfig({
  plugins: [vue()],
  server: {
    port: params.port,
    open: false,
    proxy: { [params.proxyPrefix]: params.proxyTarget },
  },
  build: { outDir: params.outDir },
  // 应用代码经 src/config.ts 读取，不直接 import 本文件（composite 项目引用限制）
  define: { __SAMPLE_DATA_PATH__: JSON.stringify(params.sampleDataPath) },
})
