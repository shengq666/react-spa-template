## HTTP 使用说明

> 基于 axios 的轻量封装，兼容原生调用方式，并通过 `RequestOptions` 提供一组行为开关。

### 1. 基本使用方式

#### 1.1 默认实例（推荐）

```ts
import http from '@/utils/http'

// GET
const res = await http.get('/api/user', { params: { id: 1 } })

// POST
const res2 = await http.post('/api/user', { name: 'Tom' })
```

#### 1.2 显式使用 `request`

```ts
// 等价于 axios.request(config)
const res = await http.request({
	url: '/api/user',
	method: 'get',
	params: { id: 1 },
})
```

#### 1.3 config + RequestOptions（推荐）

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

### 2. RequestOptions 常用组合

> 第二个参数只负责“行为”，不放 axios 原生配置。

#### 2.1 默认行为（无需配置）

- **成功**：返回后端业务体（含 `code/data/message`），不弹成功提示
- **失败**（`code !== 200` 或 HTTP 错误）：
  - 抛出 `Error`，可在业务 `catch` 里处理
  - 默认会弹错误 Toast（`isShowMessage: true` + `isShowErrorMessage: true`）

#### 2.2 只对“操作类请求”展示成功提示

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

#### 2.3 页面初始化请求静默

```ts
// 进入页面时的列表 / 详情加载：不弹任何 Toast
await http.get('/api/list', { params: { page: 1 } }, { isShowMessage: false })
```

#### 2.4 业务自行处理 code（跳过统一错误处理）

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

#### 2.5 只关掉错误提示，但保留错误抛出

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

### 3. 获取完整 Axios 响应（含 headers）

```ts
const response = await http.get('/api/file', { responseType: 'blob' }, { isReturnNativeResponse: true })

// 可以访问响应头
const filename = response.headers['content-disposition']
```

### 4. 多实例场景

```ts
import { createHttp } from '@/utils/http'

// 默认实例：走 API_CONFIG.baseURL
import http from '@/utils/http'

// 自定义上传实例
export const uploadHttp = createHttp({
	baseURL: 'https://upload.example.com',
	timeout: 30000,
})

// 使用方式与默认实例一致
await uploadHttp.post('/file/upload', formData)
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

如需扩展新的行为开关：

1. 在 `types.ts` 的 `RequestOptions` 中新增字段；
2. 在 `utils/options.ts` 的 `CUSTOM_OPTION_KEYS` 中补充键名；
3. 在对应的拦截器 / 工具函数中实现逻辑。
