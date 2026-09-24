import type { FEAModel } from '../types';
import { sampleBuilders } from './fea-solver';
// 虚拟模块，由 vite.config.ts 中的插件提供；
// 插件读取的文件名只在 build.config.ts（sampleDataFile）中声明一份，
// dev 与 build 走同一数据源。
import { presets, defaultPreset } from 'virtual:sample-data';

/** src/data/sample-models.json 中单个样例的描述 */
export interface SampleModelDef {
  key: string;
  label: string;
  /** 对应 fea-solver.ts 中 sampleBuilders 的键 */
  builder: string;
  /** 传给构建函数的数值入参 */
  params: number[];
}

export interface SampleData {
  defaultPreset: string;
  presets: SampleModelDef[];
}

const sampleData: SampleData = { defaultPreset, presets };

if (!Array.isArray(sampleData.presets) || sampleData.presets.length === 0) {
  throw new Error('样例数据缺少 presets 定义');
}

export { sampleData };

/** 按 key 构造样例模型；未声明或构建器未知时抛错说明原因 */
export function buildSampleModel(key: string): FEAModel {
  const def = sampleData.presets.find((p) => p.key === key);
  if (!def) {
    throw new Error(
      `未找到样例模型 "${key}"，可用项：${sampleData.presets.map((p) => p.key).join(', ')}`
    );
  }
  const builder = sampleBuilders[def.builder];
  if (!builder) {
    throw new Error(
      `样例模型 "${key}" 使用的构建器 "${def.builder}" 未注册，` +
        `可用构建器：${Object.keys(sampleBuilders).join(', ')}`
    );
  }
  return builder(...def.params);
}
