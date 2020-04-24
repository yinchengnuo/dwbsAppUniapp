<template>
	<view class="notify-order">
		<custom-nav ref="ltm" :title="title"></custom-nav>
		<view class="content">
			<view class="swiper-nav">
				<view class="item" :class="{ active: MIXIN_ActiveIndex == 0 }" @tap="switchSwiper(0)">我的订单</view>
				<view class="item" :class="{ active: MIXIN_ActiveIndex == 1, hasNotRead: downOrderMessageNum }" @tap="switchSwiper(1)">下级订单</view>
				<view class="moveBar" :style="{ left: MIXIN_MoveBarLeft + 'px', width: '50%' }"><text></text></view>
			</view>
			<view class="swiper-area">
				<swiper class="swiper" :current="MIXIN_ActiveIndex" :duration="234" @change="MIXIN_change">
					<swiper-item>
						<scroll-view scroll-y :style="{ height: MIXIN_ScrollViewHeight + 'px' }">
							<view class="item" v-for="(dateItem, dateIndex) in myOrderList" :key="dateIndex">
								<view class="date">{{ dateItem[0].date }}</view>
								<view v-for="(orderItem, orderIndex) in dateItem" :key="orderIndex">
									<view class="order-item">
										<view class="top">
											<text class="order_num">订单编号：{{ orderItem.order_num }}</text>
											<view class="time">
												<text>{{ orderItem.time | formatHourMin }}</text>
												<text v-if="!orderItem.readed" class="not-read"></text>
											</view>
										</view>
										<view class="mid">
											<view class="good-item" v-for="(goodItem, goodIndex) in orderItem.goodList" :key="goodIndex">
												<image :src="goodItem.img"></image>
												<view class="info">
													<text class="name">{{ goodItem.name }}</text>
													<text class="num">数量：{{ goodItem.num }}件</text>
													<text class="price">金额：￥{{ goodItem.price * goodItem.num + '.00' }}</text>
												</view>
											</view>
										</view>
										<view class="bot">
											<text class="status">{{ orderItem.status | getOrderStatus }}</text>
											<view class="detail" @tap="toDetail(orderItem.order_num, 2, orderItem.index)">
												<text>查看详情</text>
												<text class="cuIcon-right"></text>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="nomore" :class="{ empty: !myOrderList.length }">--暂无更多--</view>
						</scroll-view>
					</swiper-item>
					<swiper-item>
						<scroll-view scroll-y :style="{ height: MIXIN_ScrollViewHeight + 'px' }">
							<view class="item" v-for="(dateItem, dateIndex) in downOrderList" :key="dateIndex">
								<view class="date">{{ dateItem[0].date }}</view>
								<view v-for="(orderItem, orderIndex) in dateItem" :key="orderIndex">
									<view class="order-item">
										<view class="top">
											<text class="order_num">订单编号：{{ orderItem.order_num }}</text>
											<view class="time">
												<text>{{ orderItem.time | formatHourMin }}</text>
												<text v-if="!orderItem.readed" class="not-read"></text>
											</view>
										</view>
										<view class="mid down">
											<view class="price">订单金额：￥{{ orderItem.price }}.00</view>
											<view class="name">下单用户：{{ orderItem.nickname }}({{ orderItem.phone }})</view>
											<view class="time">下单时间：{{ orderItem.time | formatTime }}</view>
										</view>
										<view class="bot">
											<text class="status"></text>
											<view class="detail" @tap="toDetail(orderItem.order_num, 3, orderItem.index)">
												<text>查看详情</text>
												<text class="cuIcon-right"></text>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="nomore" :class="{ empty: !downOrderList.length }">--暂无更多--</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import { deepClone } from "@/common/util/index.js"
	import { _API_AppMessage_Read } from '@/apis/app.js'
	export default {
		data() {
			return {
				title: '订单通知',
				MIXIN_ActiveIndex: 0,
				MIXIN_MoveBarLeft: 0,
				MIXIN_ScrollViewHeight: 0, // 滚动区域高度
				MIXIN_ScreenWidth: this.$store.state.device.screenWidth // 屏幕宽
			}
		},
		computed: {
			downOrderMessageNum() { return this.$store.getters['message/downOrderMessageNum'] }, // 获取未读下级订单数量
			myOrderList() { // 将已读的消息按照日期进行排列
				const myOrder = deepClone(this.$store.state.message.myOrder)
				const myOrderLocal = deepClone(this.$store.state.message.myOrderLocal)
				return Object.values([...myOrder, ...myOrderLocal].reduce((res, item, index) => {
					const date = this.$options.filters.formatDate(item.time)
					item.date = date
					item.index = index
					res[date] ? res[date].push(item) : res[date] = [item]
					return res
				}, {}))
			},
			downOrderList() { // 将已读的消息按照日期进行排列
				const downOrder = deepClone(this.$store.state.message.downOrder)
				const downOrderLocal = deepClone(this.$store.state.message.downOrderLocal)
				return Object.values([...downOrder, ...downOrderLocal].reduce((res, item, index) => {
					const date = this.$options.filters.formatDate(item.time)
					item.date = date
					item.index = index
					res[date] ? res[date].push(item) : res[date] = [item]
					return res
				}, {}))
			},
		},
		watch: {
			MIXIN_ActiveIndex: { // watch swiper 变化时将某一批消息设置为已读
				handler(val) {
					if (+val === 0) {
						if (this.$store.state.message.myOrder.length) { // 当我的订单有未读消息时
							this.$refs.ltm.loading()
							_API_AppMessage_Read({ type: 2 }).then(res => { // 将我的订单未读消息设置位已读
								this.$store.commit('message/setStorage', 2)
							})
						}
					} else if (+val === 1) {
						if (this.$store.state.message.downOrder.length) { // 当下级订单有未读消息时
							this.$refs.ltm.loading()
							_API_AppMessage_Read({ type: 3 }).then(res => { // 将下级订单未读消息设置位已读
								this.$store.commit('message/setStorage', 3)
							})
						}
					}
				},
				immediate: true
			}
		},
		mounted() {
			this.$offset('.swiper').then(res => { this.MIXIN_ScrollViewHeight = res.height }) // 设置scrollview 高
			if (this.$store.state.message.myOrder.length) { // 当我的订单有未读消息时
				this.$refs.ltm.loading()
				_API_AppMessage_Read({ type: 2 }).then(res => { // 将我的订单未读消息设置位已读
					this.$store.commit('message/setStorage', 2)
				})
			}
		},
		methods: {
			MIXIN_change({ detail: { current } }) { // swiper 切换
				this.MIXIN_ActiveIndex = current
				this.MIXIN_MoveBarLeft = this.MIXIN_ActiveIndex * (this.MIXIN_ScreenWidth / 2)
			},
			switchSwiper(index) { // 点击导航栏切换
				this.MIXIN_ActiveIndex = index
				this.MIXIN_MoveBarLeft = this.MIXIN_ActiveIndex * (this.MIXIN_ScreenWidth / 2)
			},
			toDetail(order_num, type, index) { // 点击查看订单详情
				this.$store.commit('message/readMessage', { type, index }) // 将这条消息标记为已读
				uni.navigateTo({ url: `../order-detail/order-detail?order_num=${order_num}` })
			}
		}
	}
</script>

<style lang="scss">
	.notify-order {
		@include page();
		.content {
			@include flex(column);
			.swiper-nav {
				margin-bottom: 1rpx;
				.item {
					&.hasNotRead::after {
						content: "";
						width: 10rpx;
						height: 10rpx;
						margin-left: 10rpx;
						border-radius: 50%;
						background: $app-base-color;
					}
				}
				.moveBar {
					height: 2rpx;
				}
				text {
					width: 200rpx;
				}
			}
			.swiper-area {
				flex: 1;
				width: 100%;
				.swiper {
					height: 100%;
					scroll-view {
						.nomore {
							margin: 39rpx auto;
							text-align: center;
							&.empty {
								margin-top: 567rpx;
							}
						}
						.item {
							padding: 0 30rpx;
							font-size: 26rpx;
							box-sizing: border-box;
							.date {
								@include flex();
								height: 50rpx;
								font-size: 24rpx;
							}
							.order-item {
								width: 690rpx;
								position: relative;
								background: #FFFFFF;
								border-radius: 10rpx;
								margin-bottom: 10rpx;
								.top {
									@include flex();
									height: 58rpx;
									padding: 0 30rpx;
									box-sizing: border-box;
									justify-content: space-between;
									border-bottom: 1rpx solid $app-base-bg;
									.time {
										@include flex();
										height: 100%;
										.not-read {
											width: 10rpx;
											height: 10rpx;
											margin-left: 10rpx;
											border-radius: 50%;
											background: $app-base-color;
										}
									}
								}
								.mid {
									&.down {
										@include flex(column);
										height: 160rpx;
										padding: 0 30rpx;
										font-size: 26rpx;
										box-sizing: border-box;
										align-items: flex-start;
										>view {
											@include flex();
											flex: 1;
										}
									}
									.good-item {
										@include flex();
										height: 180rpx;
										padding: 0 30rpx;
										background: #FFFFFF;
										box-sizing: border-box;
										justify-content: space-between;
										border-bottom: 1rpx solid $app-base-bg;
										image {
											width: 140rpx;
											height: 140rpx;
										}
										.info {
											@include flex(column);
											flex: 1;
											height: 100%;
											margin: 0 30rpx;
											align-items: flex-start;
											justify-content: flex-start;
											.name {
												font-size: 32rpx;
												margin-top: 20rpx;
											}
											.num {
												font-size: 26rpx;
												margin-top: 10rpx;
												color: $app-sec-text-color;
											}
											.price {
												font-size: 26rpx;
												margin-top: 10rpx;
												color: $app-base-color;
											}
										}
									}
								}
								.bot {
									@include flex();
									height: 72rpx;
									padding: 0 30rpx;
									box-sizing: border-box;
									justify-content: space-between;
									border-top: 1rpx solid $app-base-bg;
									.status {
										font-size: 24rpx;
										color: $app-sec-text-color;
									}
									.detail {
										@include flex();
										height: 100%;
										font-size: 26rpx;
										color: $app-base-color;
										.cuIcon-right {
											font-size: 34rpx;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
