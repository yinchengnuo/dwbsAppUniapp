import { formatTimestamp } from '@/common/util/utils'

export const getYear = value => {  //时间戳转年份过滤器
	return formatTimestamp(+value)[0]
}

export const getMonth = value => {  //时间戳转月份过滤器
	const month = formatTimestamp(+value)[1] + ''
	return month.length === 1 ? '0' + month : month  //月份只有一位数字时补零
}

export const getDay = value => {  //时间戳转周过滤器
	return formatTimestamp(+value)[2]
}

export const getDate = value => {  //时间戳转 日 过滤器
	const date = formatTimestamp(+value)[3] + ''
	return date.length === 1 ? '0' + date : date  //日期份只有一位数字时补零
}

export const getHousr = value => {  //时间戳转 时 过滤器
	const hour = formatTimestamp(+value)[4] + ''
	return hour.length === 1 ? '0' + hour : hour // 小时只有一位时补零
}

export const getMinute = value => {  //时间戳转 分 过滤器
	const minute = formatTimestamp(+value)[5] + ''
	return minute.length === 1 ? '0' + minute : minute // 分钟只有一位时补零
}

export const getSecond = value => {  //时间戳转 秒 过滤器
	return formatTimestamp(+value)[6]
}

export const formatTime = value => {  //格式化时间
	return `${getYear(value)}-${getMonth(value)}-${getDate(value)} ${getHousr(value)}:${getMinute(value)}`
}

export const formatDate = value => {  //格式化日期
	return `${getYear(value)}-${getMonth(value)}-${getDate(value)}`
}

export const formatHourMin = value => {  //格式化时分
	return `${getHousr(value)}:${getMinute(value)}`
}

export const numDot = num => { // 数字打点
  return (num + '').replace(/(?=(?:\d{3})+(?!\d))/g, ',').replace(/^,/, '') || ''
}

export const getOrderStatus = val => {
	if (+val === 0) {
		return '待付款'
	} else if (+val === 1) {
		return '待发货'
	} else if (+val === 2) {
		return '配送中'
	} else if (+val === 3) {
		return '已完成'
	} else if (+val === 4) {
		return '已取消'
	} else {
		return ''
	}
}

export const getAddressString = val => { // 格式化地址
	return val ? `${val.provice}-${val.city}-${val.area}-${val.address}` : ''
}

export const DistanceNow = t => {  // 计算动态距离现在的发布时间
	t = (t + '').length === 10 ? `${t}000` : t
	const d = Date.now() - Number(t)
	if (d >= 0 && d < 10800000) {
		return '刚刚发表' 
	} else if (d >= 10800000 && d < 86400000) {
		return `${Math.floor(d / 3600000)}小时前`
	} else if (d >= 86400000) {
		return Math.floor(d / 86400000) > 9 ? formatDate(t) : `${Math.floor(d / 86400000)}天前`
	}
}