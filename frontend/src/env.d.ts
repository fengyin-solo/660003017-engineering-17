/// <reference types="vite/client" />
declare module '*.vue' { import type { DefineComponent } from 'vue'; const component: DefineComponent<{}, {}, any>; export default component }

/**
 * 样例数据虚拟模块，由 vite.config.ts 中的内联插件提供，
 * 读取的文件名只在 build.config.ts（sampleDataFile）中声明一份。
 */
declare module 'virtual:sample-data' {
  /** src/data/sample-models.json 中单个样例的描述 */
  export interface SampleModelDef {
    key: string;
    label: string;
    /** 对应 fea-solver.ts 中 sampleBuilders 的键 */
    builder: string;
    /** 传给构建函数的数值入参 */
    params: number[];
  }

  export const presets: SampleModelDef[];
  export const defaultPreset: string;
}
