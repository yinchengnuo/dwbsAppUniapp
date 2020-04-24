<template>
	<view class="choose-size">
		<custom-nav ref="ltm" :title="title" @rTap="choose" color>
			<text style="margin-right: 16px;">确定</text>
		</custom-nav>
		<view class="sideBar">
			<view class="item">
				<text>共 {{ choosed.length }} 款</text>
				<text v-if="totalChoosed" class="round-dot">{{ totalChoosed }}</text>
			</view>
			<view class="item" v-for="(item, index) in choosed" :key="index" :class="{ active: active === index }" @tap="switchType(index)">
				<text>{{ item.name }}</text>
				<text v-if="isTypeChoosedDotShow(item.size)" class="round-dot">{{ item.size | typeChoosed }}</text>
			</view>
		</view>
		<view class="content">
			<view v-for="(item, index) in choosed" :key="index">
				<view v-if="active === index" class="choose">
					<view class="item">
						<text>尺码</text>
						<text>数量</text>
					</view>
					<view class="item" v-for="(sizeNum, size) in item.size" :key="size">
						<text>{{ size }}</text>
						<custom-counter v-model="choosed[index].size[size]" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { deepClone } from '@/common/util/index.js'
	import customCounter from '../../components/public/custom-counter.vue'
	export default {
		components: { customCounter },
		data() {
			return {
				title: '选择尺寸',
				type: 'male',
				active: 0,
				choosed: []
			}
		},
		computed: {
			isTypeChoosedDotShow(val) { return val => this.$options.filters.typeChoosed(val) }, // 根据单个类型已选择数量决定数量小圆点是否显示
			choosedNum() { return this.$store.getters['choosed/total'] }, // 页面初始化获取 vuex 中当前商品已选择总数量，作为判断是否使用 vuex 数据的依据
			totalChoosed() { return this.choosed.reduce((t, e) => Object.keys(e.size).reduce((tt, ee) => tt + e.size[ee], t), 0) }, // 计算已选择总数量
		},
		filters: {
			typeChoosed(val) { return Object.keys(val).reduce((t, e) => t + val[e], 0) } // 计算单个类型已选择数量
		},
		onLoad(opt) { // 进入页面以后
			if(this.choosedNum) { // 如果 vuex 中所有已选择数量不为空，表示 vuex 中有 choosed
				this.choosed = deepClone(this.$store.state.choosed.list) // 将 vuex 中的 choosed 赋给 choosed
			} else {
				const typeList = JSON.parse(opt.typeList) // 解析传过来的类型列表
				typeList.forEach((typeListItem, typeListIndex) => { // 遍历类型列表初始化已选择列表
					const choosedItem = { size: {}, choosed: {}, size_id: {} } // 生成当前商品每个类型选择数量的映射对象
					choosedItem.type_id = typeListItem.type_id // 传入type_id
					choosedItem.name = typeListItem.name // 传入 typename
					typeListItem.size.forEach((sizeItem, sizeIndex) => {
						choosedItem.size[sizeItem] = 0 // 将当前类型所有尺寸已选数量设置为 0
						choosedItem.choosed[sizeItem] = true // 将当前类型所有尺寸在购物车的选中状态设置为 true
						choosedItem.size_id[sizeItem] = typeListItem.size_id[sizeIndex] // 将当前类型所有尺寸给定自己的 size_id
					})
					this.choosed.push(choosedItem) // 将处理的 typeListItem 放入 choosed 中渲染到页面
				})	
			}
		},
		methods: {
			switchType(index) { // 切换类型
				this.active = index
			},
			choose() { // 点击确定
				this.$store.commit('choosed/CHOOSE', this.choosed) // 将 choosed 放入 vuex 中
				uni.navigateBack()
			}
		},
		onBackPress(opt) {
			if (this.total && opt.from === 'backbutton') {
				this.$refs.ltm.modal('提示', ['离开此页面将不会保存您刚刚选择的尺寸']).then(() => {
					uni.navigateBack()
				})	
				return true
			} else {
				return false
			}
		}
	}
</script>

<style lang="scss">
	.choose-size {
		@include page();
		.sideBar {
			left: 0;
			bottom: 0;
			z-index: 1;
			width: 160rpx;
			position: absolute;
			background: #FFFFFF;
			top: $app-nav-height;
			box-shadow: 0rpx 3rpx 7rpx 0rpx rgba(0, 0, 0, 0.35);
			.item {
				@include flex();
				height: 90rpx;
				font-size: 26rpx;
				position: relative;
				color: $app-sec-text-color;
				border-bottom: 1rpx solid $app-base-bg;
				&.active {
					color: $app-base-color;
				}
				.round-dot {
					@include flex();
					top: 8rpx;
					right: 8rpx;
					height: 28rpx;
					color: #FFFFFF;
					padding: 0 4rpx;
					min-width: 28rpx;
					font-size: 24rpx;
					position: absolute;
					border-radius: 16rpx;
					background: $app-base-color;
					
				}
			}
		}
		.content {
			border-left: 160rpx solid #FFFFFF;
			.choose {
				.item {
					@include flex();
					height: 90rpx;
					font-size: 26rpx;
					background: #FFFFFF;
					color: $app-main-text-color;
					border-bottom: 1rpx solid $app-base-bg;
					text, custom-counter {
						@include flex();
						flex: 1;
						height: 100%;
					}
					&:nth-child(1) {
						color: $app-sec-text-color;
					}
				}
			}
		}
	}
</style>
