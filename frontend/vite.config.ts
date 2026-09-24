import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { buildConfig } from './build.config'

/**
 * 把样例数据文件以虚拟模块 virtual:sample-data 的形式暴露给应用代码。
 * 文件位置只在 build.config.ts 中声明（sampleDataFile），
 * dev 与 build 均由此处读取，保证两处同源。
 */
function sampleDataPlugin(): Plugin {
  const virtualId = 'virtual:sample-data'
  const resolvedVirtualId = '\0' + virtualId
  return {
    name: 'sample-data',
    resolveId(id) {
      return id === virtualId ? resolvedVirtualId : null
    },
    load(id) {
      if (id !== resolvedVirtualId) return null
      const filePath = fileURLToPath(new URL(`./src/data/${buildConfig.sampleDataFile}`, import.meta.url))
      const data = JSON.parse(readFileSync(filePath, 'utf-8'))
      return `export const presets = ${JSON.stringify(data.presets)}; export const defaultPreset = ${JSON.stringify(data.defaultPreset)};`
    },
  }
}

export default defineConfig({
  plugins: [vue(), sampleDataPlugin()],
  // 端口、代理、输出目录全部取自 build.config.ts 这一份共用定义
  server: {
    port: buildConfig.port,
    open: buildConfig.open,
    proxy: {
      [buildConfig.proxy.prefix]: buildConfig.proxy.target,
    },
  },
  build: {
    outDir: buildConfig.outDir,
  },
})
