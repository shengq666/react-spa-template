## HTTP 使用说明

> 基于 axios 的轻量封装，兼容原生调用方式，并通过 `RequestOptions` 提供一组行为开关。

### 1. 单例 vs 多例

#### 1.1 默认单例实例（推荐）

绝大多数业务场景直接使用默认导出的 `http` 即可：

```ts
import http from '@/utils/http'

// GET
const res = await http.get('/api/user', { params: { id: 1 } })

// POST
const res2 = await http.post('/api/user', { name: 'Tom' })
```

特点：

- 单例、全局复用：内部使用 `API_CONFIG.baseURL`、统一拦截器和默认行为；
- 适合：大部分“同一后端域名 + 同一套行为开关”的业务接口。

#### 1.2 多实例（多域名 / 不同行为）

当你需要**不同 baseURL / 不同超时时间 / 不同行为默认值**时，使用 `createHttp` 创建多实例：

```ts
import { createHttp } from '@/utils/http'

// 示例：上传服务实例（不同域名 + 更长超时）
export const uploadHttp = createHttp({
	baseURL: 'https://upload.example.com',
	timeout: 30000,
})

// 示例：静默埋点实例（不弹 Toast + 跳过统一错误处理）
export const logHttp = createHttp({
	baseURL: '/api/logService',
	timeout: 3000,
	defaultRequestOptions: {
		isShowMessage: false,
		skipErrorHandler: true,
	},
})
```

推荐使用多例的典型场景：

- 不同业务线 / 后端域名：如主业务域名 + 文件上传域名 + 日志上报域名；
- 不同默认行为：例如某个实例永远静默、不弹 Toast、不按 code 拦截；
- 不同安全策略：比如某些实例不自动带 token（`withToken: false`）。

### 2. 基本使用方式

#### 2.1 显式使用 `request`

```ts
// 等价于 axios.request(config)
const res = await http.request({
	url: '/api/user',
	method: 'get',
	params: { id: 1 },
})
```

#### 2.2 config + RequestOptions（推荐）

```ts
const res = await http.request(
	{
		url: '/api/user',
		method: 'get',
		params: { id: 1 },
	},
	{
		// RequestOptions：只放行为开关
		skipErrorHandler: true,
		isShowSuccessMessage: true,
	},
)
```

### 3. RequestOptions 常用组合

> 第二个参数只负责“行为”，不放 axios 原生配置。

#### 3.1 默认行为（无需配置）

- **成功**：返回后端业务体（含 `code/data/message`），不弹成功提示
- **失败**（`code !== 200` 或 HTTP 错误）：
  - 抛出 `Error`，可在业务 `catch` 里处理
  - 默认会弹错误 Toast（`isShowMessage: true` + `isShowErrorMessage: true`）

#### 3.2 只对“操作类请求”展示成功提示

```ts
// 保存 / 提交 / 删除等用户行为
await http.post(
	'/api/user/save',
	data,
	{ timeout: 5000 },
	{
		isShowSuccessMessage: true,
		successMessageText: '保存成功',
	},
)
```

#### 3.3 页面初始化请求静默

```ts
// 进入页面时的列表 / 详情加载：不弹任何 Toast
await http.get('/api/list', { params: { page: 1 } }, { isShowMessage: false })
```

#### 3.4 业务自行处理 code（跳过统一错误处理）

适用于“非 200 也算业务正常”的场景，例如 `code = 10086` 表示“已领取”：

```ts
const res = await http.get(
	'/api/coupon',
	{ params: { id: 1 } },
	{ skipErrorHandler: true }, // 不在拦截器里按 code 抛异常
)

if (res.code === 10086) {
	// 展示“已领取”状态
} else if (res.code === 200) {
	// 正常逻辑
}
```

#### 3.5 只关掉错误提示，但保留错误抛出

```ts
await http.get(
	'/api/user',
	{ params: { id: 1 } },
	{
		isShowMessage: true,
		isShowErrorMessage: false, // 不弹错误 Toast
	},
)
```

### 4. 获取完整 Axios 响应（含 headers）

```ts
const response = await http.get('/api/file', { responseType: 'blob' }, { isReturnNativeResponse: true })

// 可以访问响应头
const filename = response.headers['content-disposition']
```

### 5. 其他行为开关速览

- **请求控制**
  - `ignoreCancelToken`：是否忽略重复请求取消
  - `withToken`：是否自动注入 token
- **参数处理**
  - `joinTime`：GET 是否自动附加时间戳防缓存
  - `formatDate`：是否格式化参数中的日期
  - `joinParamsToUrl`：是否把参数拼到 URL 上
- **URL 相关**
  - `apiUrl`：覆盖默认 `baseURL`
  - `urlPrefix`：URL 前缀
  - `joinPrefix`：是否自动拼接 `urlPrefix`

### 6. 最佳实践建议

- **页面初始化请求**
  - 建议关闭全局提示：`{ isShowMessage: false }`
  - 在页面组件中用骨架屏 / 空状态 / 错误区块来表达加载与失败

- **用户操作请求（保存 / 删除 / 提交表单等）**
  - 建议开启成功提示：`{ isShowSuccessMessage: true, successMessageText?: string }`
  - 失败提示使用默认配置即可（全局统一的错误文案 + Toast）

- **特殊业务 code（非 200 也算正常）**
  - 配置 `{ skipErrorHandler: true }`，在页面里自行判断 `res.code`
  - 典型如优惠券“已领取”这类状态码，避免被统一错误处理拦截

- **静默埋点 / 日志上报**
  - 使用实例级默认 RequestOptions（`createHttp({ ..., defaultRequestOptions })`）
  - 例如 `{ isShowMessage: false, skipErrorHandler: true }`，彻底静默、不干扰用户

  ```ts
  import { createHttp } from '@/utils/http'

  // 静默埋点实例：不弹 Toast，不按 code 抛业务错误
  export const logHttp = createHttp({
  	baseURL: '/api/logService',
  	timeout: 3000,
  	defaultRequestOptions: {
  		isShowMessage: false,
  		skipErrorHandler: true,
  	},
  })

  // 业务中使用：无需再传 RequestOptions，天然静默
  export function reportPv(data: any) {
  	return logHttp.post('/pv/report', data)
  }
  ```

- **扩展新的行为开关**
  1. 在 `types.ts` 的 `RequestOptions` 中新增字段；
  2. 在 `utils/options.ts` 的 `CUSTOM_OPTION_KEYS` 中补充键名；
  3. 在对应的拦截器 / 工具函数中实现逻辑。
