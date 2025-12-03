import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

type QueryValue = string | number | boolean | null | undefined

/**
 * 通用路由 & 查询参数 Hook，基于 react-router 封装，避免到处直接用 useNavigate / useSearchParams
 *
 * 使用示例：
 * const { push, replace, back, query } = useRouter()
 * query.get('id')
 * query.update({ page: 2 })
 */
export function useRouter() {
	const navigate = useNavigate()
	const location = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()

	// ======== query 相关 ========
	const getAll = (): Record<string, string> => {
		const result: Record<string, string> = {}
		searchParams.forEach((value, key) => {
			result[key] = value
		})
		return result
	}

	const get = (key: string): string | null => {
		return searchParams.get(key)
	}

	// 覆盖式设置查询参数（会丢弃当前所有 search，再写入新的）
	const set = (params: Record<string, QueryValue>, options?: { replace?: boolean }) => {
		const next = new URLSearchParams()
		Object.entries(params).forEach(([key, value]) => {
			if (value !== null && value !== undefined) next.set(key, String(value))
		})
		setSearchParams(next, { replace: options?.replace ?? false })
	}

	// 在当前基础上增量更新查询参数（未指定的 key 保留原值）
	const update = (partial: Record<string, QueryValue>, options?: { replace?: boolean }) => {
		const next = new URLSearchParams(searchParams)
		Object.entries(partial).forEach(([key, value]) => {
			if (value === null || value === undefined) next.delete(key)
			else next.set(key, String(value))
		})
		setSearchParams(next, { replace: options?.replace ?? false })
	}

	const query = {
		location,
		searchParams,
		getAll,
		get,
		set,
		update,
	}

	// ======== 路由跳转相关 ========
	const push = (to: string, options?: { replace?: boolean }) => {
		navigate(to, { replace: options?.replace ?? false })
	}

	const replace = (to: string) => {
		navigate(to, { replace: true })
	}

	const back = (delta = -1) => {
		navigate(delta)
	}

	// 基于 path + params 构造带 query 的跳转
	const pushWithQuery = (path: string, params: Record<string, QueryValue>, options?: { replace?: boolean }) => {
		const url = new URL(path, window.location.origin)
		const current = new URLSearchParams(url.search)
		Object.entries(params).forEach(([key, value]) => {
			if (value === null || value === undefined) current.delete(key)
			else current.set(key, String(value))
		})
		const search = current.toString()
		navigate(
			{
				pathname: url.pathname,
				search: search ? `?${search}` : '',
				hash: url.hash || location.hash,
			},
			{ replace: options?.replace ?? false },
		)
	}

	return {
		location,
		push,
		replace,
		back,
		pushWithQuery,
		query,
	}
}
