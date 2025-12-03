import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 格式化工具函数
export const format = {
	// 日期格式化
	date: (date: string | number | Date | dayjs.Dayjs, format = 'YYYY-MM-DD'): string => {
		return dayjs(date).format(format)
	},

	// 时间格式化
	datetime: (date: string | number | Date | dayjs.Dayjs, format = 'YYYY-MM-DD HH:mm:ss'): string => {
		return dayjs(date).format(format)
	},

	// 相对时间
	fromNow: (date: string | number | Date | dayjs.Dayjs): string => {
		return dayjs(date).fromNow()
	},

	// 数字格式化（千分位）
	number: (num: number | string): string => {
		const n = Number(num)
		if (Number.isNaN(n)) return '0'
		return n.toLocaleString('zh-CN')
	},

	// 金额格式化
	money: (amount: number | string, decimals = 2): string => {
		const num = Number(amount)
		if (Number.isNaN(num)) return '0.00'
		return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	},

	// 文件大小格式化
	fileSize: (bytes: number): string => {
		if (bytes === 0) return '0 B'
		const k = 1024
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return `${Number((bytes / k ** i).toFixed(2))} ${sizes[i]}`
	},
}
