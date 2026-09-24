/**
 * 构建/开发共用参数 —— 全项目唯一的一份定义。
 *
 * 开发启动（vite dev）、构建（vite build）以及前端运行时（样例数据加载）
 * 都从这里取值；新增参数时只需在本文件补充，禁止再在其它文件里硬编码。
 *
 * 该文件不引用任何 Node 专属 API（如 node:path / node:url），
 * 因此既能被 vite.config.ts（Node 侧）导入，也能被 src 下的应用代码打包。
 */

// ─── 参数定义 ────────────────────────────────────────────────────────────────

/** dev 服务监听端口；允许范围 1024–65535（0–1023 为系统保留端口） */
const DEV_PORT = 5180;

/** dev 启动时是否自动打开浏览器（保持原行为：不打开） */
const DEV_OPEN = false;

/** 需要被代理到后端的请求前缀，必须以 "/" 开头 */
const API_PREFIX = '/api';

/** 后端发布地址（改发布地址只改这里，dev 代理与前端取值同源） */
const API_TARGET = 'http://localhost:8002';

/** 构建产物输出目录；必须为项目内的相对路径，禁止 ".." 逃逸到项目外 */
const OUT_DIR = 'dist';

/** 样例数据文件名；通过 buildConfig.sampleDataUrl 经 Vite alias 加载 */
const SAMPLE_DATA_FILE = 'sample-models.json';

// ─── 取值校验：超出允许范围时直接说明原因 ─────────────────────────────────────

function fail(reason: string): never {
  throw new Error(`[build.config] 参数不合法：${reason}`);
}

if (!Number.isInteger(DEV_PORT)) {
  fail(`端口必须是整数，实际为 ${String(DEV_PORT)}`);
}
if (DEV_PORT < 1024 || DEV_PORT > 65535) {
  fail(
    `端口 ${DEV_PORT} 超出允许范围 1024–65535` +
      (DEV_PORT >= 0 && DEV_PORT < 1024 ? '（0–1023 为系统保留端口，需要特权才能监听）' : '（端口最大为 65535）')
  );
}

if (typeof API_TARGET !== 'string' || !/^https?:\/\/.+/.test(API_TARGET)) {
  fail(`后端地址必须是 http:// 或 https:// 开头的完整 URL，实际为 "${API_TARGET}"`);
}

if (!API_PREFIX.startsWith('/')) {
  fail(`代理前缀必须以 "/" 开头，实际为 "${API_PREFIX}"`);
}

if (OUT_DIR.trim() === '') {
  fail('输出目录不能为空字符串');
}
if (OUT_DIR.split(/[/\\]+/).includes('..')) {
  fail(`输出目录必须位于项目内，不能包含 ".."，实际为 "${OUT_DIR}"`);
}
if (/^([a-zA-Z]:)?[\\/]/.test(OUT_DIR)) {
  fail(`输出目录必须是项目内相对路径，不能是绝对路径，实际为 "${OUT_DIR}"`);
}

if (!/\.json$/i.test(SAMPLE_DATA_FILE)) {
  fail(`样例数据文件必须是 .json 文件，实际为 "${SAMPLE_DATA_FILE}"`);
}

// ─── 导出：开发与构建统一从这里取值 ───────────────────────────────────────────

export const buildConfig = {
  /** dev 服务端口 */
  port: DEV_PORT,
  /** dev 启动是否打开浏览器 */
  open: DEV_OPEN,
  /** 代理前缀 -> 后端地址 */
  proxy: { prefix: API_PREFIX, target: API_TARGET } as const,
  /** 构建产物目录 */
  outDir: OUT_DIR,
  /**
   * 样例数据的模块 URL（供应用代码 `import` / Vite `?url` 加载）。
   * 该虚拟路径由 vite.config.ts 中的 alias 解析到 src/data 下的真实文件，
   * 保证 dev 与 build 看到的是同一份路径声明。
   */
  sampleDataUrl: `@sample-data/${SAMPLE_DATA_FILE}`,
  /** 样例数据在仓库中的真实位置（供 vite alias 解析与排错查看） */
  sampleDataFile: SAMPLE_DATA_FILE,
} as const;

export type BuildConfig = typeof buildConfig;
