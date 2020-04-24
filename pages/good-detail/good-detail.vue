<template>
	<view class="good-detail">
		<custom-nav ref="ltm" :title="title" />
		<view class="shopcar-buy">
			<navigator url="../shop-car/shop-car" id="shopcar" class="shopcar">
				<text class="cuIcon-cart"></text>
				<text>购物车</text>
				<text v-if="shopcarNum" class="num">{{ shopcarNum }}</text>
			</navigator>
			<view class="addshopcar" @tap="addToshopCar">加入购物车</view>
			<view class="buy" @tap="buy">立即购买</view>
		</view>
		<view class="content">
			<swiper :indicator-dots="true" :circular="true" :autoplay="true" :interval="3456" :duration="234" indicator-color="#FFFFFF" indicator-active-color="#F76454">
				<swiper-item v-for="(item, index) in goodInfo.imgList" :key="index">
					<image :src="item"></image>
				</swiper-item>
			</swiper>
			<view class="goodinfo app-item">
				<view class="name">商品名称：{{ goodInfo.name || '' }}</view>
				<view class="price-storage">
					<text class="price">进货价：￥{{ goodInfo.price || '' }}</text>
					<text class="storage">我的库存：{{ goodInfo.storage || '' }} 套</text>
				</view>
			</view>
			<navigator :url="'../choose-size/choose-size?typeList=' + JSON.stringify(goodInfo.typeList)" class="choose-size app-item">
				<text>选择尺码</text>
				<view class="size-right">
					<view class="size">
						<view v-if="s">
							<text>S</text>
							<text v-if="!flying" id="s" class="num">{{ s }}</text>
						</view>
						<view v-if="m">
							<text>M</text>
							<text v-if="!flying" id="m" class="num">{{ m }}</text>
						</view>
						<view v-if="l">
							<text>L</text>
							<text v-if="!flying" id="l" class="num">{{ l }}</text>
						</view>
						<view v-if="xl">
							<text>XL</text>
							<text v-if="!flying" id="xl" class="num">{{ xl }}</text>
						</view>
						<view v-if="xxl">
							<text>XXL</text>
							<text v-if="!flying" id="xxl" class="num">{{ xxl }}</text>
						</view>
						<view v-if="xxxl">
							<text>XXXL</text>
							<text v-if="!flying" id="xxxl" class="num">{{ xxxl }}</text>
						</view>
					</view>
					<text class="cuIcon-right"></text>
				</view>
			</navigator>
			<view class="choose-num app-item item-space">
				<text>已选数量</text>
				<text>{{ choosedNum + ' '}}套</text>
			</view>
			<view class="choose-money app-item">
				<text>总计金额</text>
				<text>¥{{ ' ' + choosedPrice + ' .00' }}元</text>
			</view>
		</view>
		<flyto-cart v-if="s" ref="flytoCart1" :self="positions.s" :cart="positions.shopcar"><text>{{ s }}</text></flyto-cart>
		<flyto-cart v-if="m" ref="flytoCart2" :self="positions.m" :cart="positions.shopcar"><text>{{ m }}</text></flyto-cart>
		<flyto-cart v-if="l" ref="flytoCart3" :self="positions.l" :cart="positions.shopcar"><text>{{ l }}</text></flyto-cart>
		<flyto-cart v-if="xl" ref="flytoCart4" :self="positions.xl" :cart="positions.shopcar"><text>{{ xl }}</text></flyto-cart>
		<flyto-cart v-if="xxl" ref="flytoCart5" :self="positions.xxl" :cart="positions.shopcar"><text>{{ xxl }}</text></flyto-cart>
		<flyto-cart v-if="xxxl" ref="flytoCart6" :self="positions.xxxl" :cart="positions.shopcar"><text>{{ xxxl }}</text></flyto-cart>
	</view>
</template>

<script>
	import { _API_GoodDetail } from '@/apis/good.js'
	import { deepClone, clearTypeListZeros } from '@/common/util/index.js'
	import flytoCart from '@/components/flytocart/fly-to-cart.vue'
	export default {
		components: {
			flytoCart
		},
		data() {
			return {
				title: '商品详情',
				flying: false,
				goodInfo: {},
				positions: { s: {}, m: {}, l: {}, xl: {}, xxl: {}, xxxl: {}, shopcar: {} }
			}
		},
		computed: {
			s() { return this.$store.getters['choosed/S'] }, // 已选择 s 数量
			m() { return this.$store.getters['choosed/M'] }, // 已选择 m 数量
			l() { return this.$store.getters['choosed/L'] }, // 已选择 l 数量
			xl() { return this.$store.getters['choosed/XL'] }, // 已选择 xl 数量
			xxl() { return this.$store.getters['choosed/XXL'] }, // 已选择 xxl 数量
			xxxl() { return this.$store.getters['choosed/XXXL'] }, // 已选择 xxxl 数量
			choosedList() { return this.$store.state.choosed.list }, // 已选类型列表
			choosedNum() { return this.$store.getters['choosed/total'] }, // 已选择 总 数量
			choosedPrice() { return this.choosedNum * (this.goodInfo.price || 0) }, // 已选择 总 价值
			shopcarNum() { return this.$store.getters['shopcar/shopcarNum'] } // 购车车商品数量
		},
		created() { // 页面初始化后清除已选择的尺寸
			this.$store.commit('choosed/CLEAR')
		},
		onShow() {
			this.$nextTick(() =>{ // 页面显示后获取 尺寸按钮 的位置
				this.getSizePositons()
			})
		},
		onLoad(opt) { // 进入页面后获取商品 ID （发送网络请求）
			this.$refs.ltm.loading()
			_API_GoodDetail({ id: opt.id }).then(res => {
				this.goodInfo = res.data
				this.goodInfo.storage = opt.storage
			})
		},
		methods: {
			buy() {
				if (this.choosedNum) { // 点击立即购买
					const choosed = deepClone(this.choosedList) // 克隆已选列表，不改变原数据，防止用户点击立即购买后直接返回造成数据不可逆
					clearTypeListZeros(choosed) // 清除数量为 0 的 typeListItem
					uni.navigateTo({ url: `../confirm-order/confirm-order?from=gooddetail&order=${JSON.stringify([{ ...this.goodInfo, typeList: choosed }])}` })
				} else {
					this.$refs.ltm.toast('您还没有选择尺寸')
				}
			},
			addToshopCar(e) { // 点击加入购物车
				if (this.choosedNum) {
					if (!this.flying) { // 防止连点
						this.$refs.flytoCart1 ? this.$refs.flytoCart1.fly() : '' // 飞入购物车
						this.$refs.flytoCart2 ? this.$refs.flytoCart2.fly() : '' // 飞入购物车
						this.$refs.flytoCart3 ? this.$refs.flytoCart3.fly() : '' // 飞入购物车
						this.$refs.flytoCart4 ? this.$refs.flytoCart4.fly() : '' // 飞入购物车
						this.$refs.flytoCart5 ? this.$refs.flytoCart5.fly() : '' // 飞入购物车
						this.$refs.flytoCart6 ? this.$refs.flytoCart6.fly() : '' // 飞入购物车
						this.goodInfo.choosed = true // 该商品在购物车默认为选中状态
						clearTypeListZeros(this.choosedList) // 清除 数量为空的 type 和 size
						this.$store.commit('shopcar/ADD', { ...this.goodInfo, typeList: deepClone(this.choosedList) }) // 加入购物车<!一定要 deepClone!>
						this.flying = true
						setTimeout(() => {
							this.flying = false
							this.$store.commit('choosed/CLEAR') // 清除已选择的尺寸按钮
						}, 678)
					}
				} else {
					this.$refs.ltm.toast('您还没有选择尺寸')
				}
			},
			getSizePositons() { // 获取尺寸按钮和购物车的位置信息
				this.$offset('#s').then(res => this.positions.s = res)
				this.$offset('#m').then(res => this.positions.m = res)
				this.$offset('#l').then(res => this.positions.l = res)
				this.$offset('#xl').then(res => this.positions.xl = res)
				this.$offset('#xxl').then(res => this.positions.xxl = res)
				this.$offset('#xxxl').then(res => this.positions.xxxl = res)
				this.$offset('#shopcar').then(res => this.positions.shopcar = res)
			}
		},
		onBackPress(opt) {
			if (this.choosedNum && opt.from === 'backbutton') {
				this.$refs.ltm.modal('提示', ['离开页面将不会保存您选择的尺寸']).then(() => {
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
	.good-detail {
		@include page();
		.shopcar-buy {
			@include flex();
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1;
			height: 98rpx;
			position: fixed;
			view, navigator {
				@include flex();
				flex: 1;
				height: 100%;
				color: #FFFFFF;
				font-size: 32rpx;
				position: relative;
				&.shopcar {
					background: #FFFFFF;
					color: $app-base-color;
					.cuIcon-cart {
						font-size: 40rpx;
						margin-right: 6rpx;
					}
					.num {
						@include flex();
						top: 12rpx;
						right: 20rpx;
						height: 34rpx;
						color: #FFFFFF;
						min-width: 34rpx;
						font-size: 20rpx;
						position: absolute;
						border-radius: 50%;
						background: $app-base-color;
					}
				}
				&.addshopcar {
					background: #FFA94C;
				}
				&.buy {
					background: $app-base-color;
				}
			}
		}
		.content {
			swiper {
				height: 400rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.app-item {
				font-size: 26rpx;
			}
			.goodinfo {
				height: 134rpx;
				flex-direction: column;
				align-items: flex-start;
				justify-content: flex-start;
				.name {
					font-size: 32rpx;
					margin-top: 30rpx;
				}
				.price-storage {
					margin-top: 12rpx;
					.price {
						color: $app-base-color;
					}
					.storage {
						margin-left: 30rpx;
						color: $app-sec-text-color;
					}
				}
			}
			.choose-size {
				.size-right {
					@include flex();
					flex: 1;
					margin-left: 30rpx;
					height: $app-item-height;
					justify-content: space-between;
					.size {
						@include flex();
						flex: 1;
						height: 100%;
						justify-content: flex-end;
						view {
							@include flex();
							position: relative;
							width: 68rpx;
							height: 44rpx;
							font-size: 26rpx;
							margin-right: 18rpx;
							border-radius: 4rpx;
							border: 2rpx solid $app-main-text-color;
							.num {
								@include flex();
								top: -10rpx;
								width: 30rpx;
								height: 30rpx;
								right: -10rpx;
								color: #FFFFFF;
								font-size: 18rpx;
								position: absolute;
								border-radius: 50%;
								background: $app-base-color;
							}
						}
					}
					
				}
			}
			.choose-money, .freight {
				text:nth-child(2) {
					color: $app-base-color;
				}
			}
			// .address {
			// 	.default-address {
			// 		@include flex();
			// 		flex: 1;
			// 		font-size: 26rpx;
			// 		margin-left: 30rpx;
			// 		height: $app-item-height;
			// 		justify-content: space-between;
			// 		.cuIcon-location {
			// 			width: 32rpx;
			// 			color: $app-base-color;
			// 		}
			// 		.addressText {
			// 			width: 500rpx;
			// 			height: 100%;
			// 			overflow: hidden;
			// 			white-space: nowrap;
			// 			text-overflow: ellipsis;
			// 			line-height: $app-item-height;
			// 		}
			// 		.cuIcon-right {
			// 			width: 32rpx;
			// 			font-size: 32rpx;
			// 		}
			// 	}
			// }
		}
		flyto-cart {
			text {
				font-size: 18rpx;
			}
		}
	}
</style>
