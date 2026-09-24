/**
 * 构建与开发的共用参数唯一定义。
 *
 * 端口、代理、输出目录、样例数据路径全部收拢在本文件；
 * vite.config.ts 的 server（开发启动）与 build（构建）统一从这里取值，
 * 应用代码经 src/config.ts 读取同一份定义。
 *
 * 新增参数时只需补这一份：
 *   1. 在 BuildParams 接口中声明字段；
 *   2. 在 buildParams 中给出取值；
 *   3. 在 validateBuildParams 中补充允许范围与越界原因。
 */

export interface BuildParams {
  /** 开发服务器监听端口 */
  port: number
  /** 接口代理的路径前缀（按请求 URL 路径匹配） */
  proxyPrefix: string
  /** 接口代理转发到的后端地址 */
  proxyTarget: string
  /** 构建输出目录（相对 frontend/ 根目录） */
  outDir: string
  /** 样例数据目录（相对 frontend/ 根目录） */
  sampleDataPath: string
}

export const buildParams: BuildParams = {
  port: 5180,
  proxyPrefix: '/api',
  proxyTarget: 'http://localhost:8002',
  outDir: 'dist',
  sampleDataPath: 'public/sample-data',
}

/** 端口允许范围：1024 以下属特权端口，65535 是 TCP 端口上限 */
const PORT_RANGE = { min: 1024, max: 65535 } as const

function fail(param: string, value: unknown, reason: string): never {
  throw new Error(
    `[build.config] 参数 ${param} 取值越界（当前值：${JSON.stringify(value)}）：${reason}`
  )
}

function asHttpUrl(param: string, value: string): URL {
  let url: URL | null = null
  try {
    url = new URL(value)
  } catch {
    /* 下面统一报错 */
  }
  if (!url) {
    fail(param, value, '必须是完整 URL（含协议与主机），开发服务器才能据此转发请求')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    fail(param, value, '仅支持 http/https，vite 代理只能转发 HTTP 请求')
  }
  return url
}

/** 校验全部参数，任一取值超出允许范围即抛出带原因的错误 */
export function validateBuildParams(p: BuildParams): BuildParams {
  if (!Number.isInteger(p.port) || p.port < PORT_RANGE.min || p.port > PORT_RANGE.max) {
    fail(
      'port',
      p.port,
      `允许范围 ${PORT_RANGE.min}–${PORT_RANGE.max}；` +
        `1024 以下的端口需要 root 权限才能绑定，而 TCP 端口最大只到 65535`
    )
  }
  if (!p.proxyPrefix.startsWith('/')) {
    fail('proxyPrefix', p.proxyPrefix, '必须以 / 开头，代理是按请求 URL 路径前缀匹配的')
  }
  asHttpUrl('proxyTarget', p.proxyTarget)
  if (!p.outDir || p.outDir.startsWith('/') || p.outDir.includes('..')) {
    fail(
      'outDir',
      p.outDir,
      '必须是项目内的相对路径；vite build 前会清空该目录，指到项目外可能误删其它文件'
    )
  }
  if (!p.sampleDataPath || p.sampleDataPath.startsWith('/') || p.sampleDataPath.includes('..')) {
    fail(
      'sampleDataPath',
      p.sampleDataPath,
      '必须是项目内的相对路径，保证开发服务与构建产物引用的样例数据位置一致'
    )
  }
  return p
}
