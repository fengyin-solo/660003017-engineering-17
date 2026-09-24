/**
 * 应用代码读取构建参数的入口。
 * 取值唯一定义在 ../build.config.ts，由 vite.config.ts 通过 define 注入；
 * 这里只做转发，不要在此另写取值。
 */
export const sampleDataPath = __SAMPLE_DATA_PATH__
