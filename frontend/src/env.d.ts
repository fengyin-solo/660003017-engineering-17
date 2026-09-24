/// <reference types="vite/client" />
declare module '*.vue' { import type { DefineComponent } from 'vue'; const component: DefineComponent<{}, {}, any>; export default component }
/** 由 vite.config.ts 的 define 注入，取值来自 build.config.ts */
declare const __SAMPLE_DATA_PATH__: string
