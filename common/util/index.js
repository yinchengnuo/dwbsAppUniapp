import Vue from 'vue'

export const deepClone = obj => { // 深克隆方法
	const targetObj = obj.constructor === Array ? [] : {}
	Object.keys(obj).forEach(keys => {
		if (obj[keys] && typeof obj[keys] === 'object') {
			targetObj[keys] = deepClone(obj[keys])
		} else {
			targetObj[keys] = obj[keys]
		}
	})
	return targetObj
}

// 清除某件商品 typeList 中 typeListItem 的 size 和 choosed 中 value 为 0 的 key,并在 size 长度为 0 时,清除 typeListItem
export const clearTypeListZeros = typeList => { 
	typeList.forEach(e => {
		Object.keys(e.size).forEach(ee => {
			if(e.size[ee] === 0) {
				delete e.size[ee]
				delete e.choosed[ee]
			}
		})
	})
	for(let i = typeList.length - 1; i > -1; i --) {
		if(!Object.keys(typeList[i].size).length) {
			typeList.splice(i, 1)
		}
	}
}

export const clearGoodTypeListZero = shopcarList => { // 当某件商品的 typeList 为 0 时,从购物车清除这件商品
	for(let i = shopcarList.length - 1; i > -1; i --) {
		if(!shopcarList[i].typeList.length) {
			shopcarList.splice(i, 1)
		}
		shopcarList[i] ? shopcarList[i].choosed = shopcarList[i].typeList.some(e => Object.keys(e.choosed).some(ee => e.choosed[ee] === true)) : ''
	}
}

export const mergeGoodToShopcar = (origin, target) => { // 当新添加的商品购车已经存在时合并
	origin.typeList.forEach(typeItem => {
		for(let targetTypeListIndex = target.typeList.length - 1; targetTypeListIndex > -1; targetTypeListIndex --) {
			if (typeItem.type_id === target.typeList[targetTypeListIndex].type_id) {
				Object.keys(target.typeList[targetTypeListIndex].size).forEach(size => {
					if(typeItem.size[size]) {
						typeItem.size[size] += target.typeList[targetTypeListIndex].size[size]
					} else {
						Vue.set(typeItem.size, size, target.typeList[targetTypeListIndex].size[size])
					}
					Vue.set(typeItem.choosed, size, true)
				})
				target.typeList.splice(targetTypeListIndex, 1)
			}
		}
	})
	origin.typeList.splice(origin.typeList.length - 1, 0, ...target.typeList)
	origin.typeList.sort((a, b) => +a.type_id - +b.type_id)
}

export const confirmOrder = goodList => { // 点击确认订单结算将数据转换为后端需要的数据格式
	const list = []
	goodList.forEach(goodItem => {
		clearTypeListZeros(goodItem.typeList)
		goodItem.typeList.forEach(typeItem => {
			Object.keys(typeItem.size).forEach(size => {
				const item = {}
				item.id = goodItem.id // 商品id
				item.type_id = typeItem.type_id // type_id
				item.num = typeItem.size[size] // 数量
				item.size_id = typeItem.size_id[size] // size_id
				list.push(item)
			})
		})
	})
	return list
}

export const clearShoplistConfirmed = (goodList, payload) => { // 提交订单后清除购物车中已经提交的类型或者商品
	payload.forEach((e, i) => {
		e.typeList.forEach((ee, ei) => {
			Object.keys(ee.size).forEach(eee => {
				goodList[i].typeList[ei].size[eee] = 0
			})
		})
		clearTypeListZeros(goodList[i].typeList) // 清除这件商品的 typeList
	})
	clearGoodTypeListZero(goodList) // 清除购物车中 typeList 长度为 0 的商品
}

export const divideOrder = goodList => { // 点击确认订单结算将数据转换为后端需要的数据格式
	const list = []
	goodList.forEach(goodItem => {
		goodItem.typeList.forEach(typeItem => {
			Object.keys(typeItem.size).forEach((sizeItem, sizeIndex) => {
				const item = {}
				item.id = goodItem.id
				item.type_id = typeItem.type_id
				item.num = typeItem.num[sizeIndex]
				item.size_id = typeItem.size_id[sizeIndex]
				if (+item.num) {
					list.push(item) // 清除 num 为 0 的 size
				}
			})
		})
	})
	return list
}