<template>
	<view class="test">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="address">
				<view class="name-tel">
					<text class="name">收货人：{{ address.con_name || '' }}</text>
					<text class="tel">{{ address.con_mobile }}</text>
				</view>
				<viwe class="address-text">{{ address | getAddressString }}</viwe>
			</view>
			<view class="divice-order">
				<view class="swiper-nav">
					<view class="item" :class="{ active: MIXIN_ActiveIndex == 0 }" @tap="switchSwiper(0)">{{ '发货单(' + sendTotal + ')' }}</view>
					<view class="item" :class="{ active: MIXIN_ActiveIndex == 1 }" @tap="switchSwiper(1)">{{ '转货单(' + forwardTotal + ')' }}</view>
					<view class="moveBar" :style="{ left: MIXIN_MoveBarLeft + 'px', width: '50%' }"><text></text></view>
				</view>
				<view class="swiper-area">
					<swiper class="swiper" :current="MIXIN_ActiveIndex" :duration="234" @change="MIXIN_change">
						<swiper-item>
							<scroll-view scroll-y :style="{ height: MIXIN_ScrollViewHeight + 'px' }">
								<view v-if="sendTotal">
									<view class="item" v-for="(item, index) in sendList" :key="index" v-if="hasNum(item)">
										<view class="info">
											<image :src="item.img"></image>
											<view class="name ellipsis">{{ item.name }}</view>
										</view>
										<view class="type" v-for="(tyepItem, typeIndex) in item.typeList" :key="typeIndex">
											<view class="type-size-counter" 
												v-for="(sizeValue, sizeIndex) in tyepItem.size" :key="sizeIndex" 
												v-if="sendList[index].typeList[typeIndex].num[sizeIndex]" 
											>
												<view class="type-size">
													<text>款式：{{ tyepItem.name }} 尺码： {{ sizeValue }}</text>
												</view>
												<custom-counter v-model="sendList[index].typeList[typeIndex].num[sizeIndex]" 
													:args="[index, typeIndex, sizeIndex]" @change="sendChange"
													:max="list[index].typeList[typeIndex].num[sizeIndex]"
												/>
											</view>
										</view>
									</view>
									<view class="express-order">
										<text>物流单号：</text>
										<input type="number" v-model="remark" placeholder="请填写物流单号(选填)" />
									</view>
								</view>
								<view v-else class="none">-发货单暂无商品-</view>
							</scroll-view>
						</swiper-item>
						<swiper-item>
							<scroll-view scroll-y :style="{ height: MIXIN_ScrollViewHeight + 'px' }">
								<view v-if="forwardTotal">
									<view class="item" v-for="(item, index) in forwardList" :key="index" v-if="hasNum(item)">
										<view class="info">
											<image :src="item.img"></image>
											<view class="name ellipsis">{{ item.name }}</view>
										</view>
										<view class="type" v-for="(tyepItem, typeIndex) in item.typeList" :key="typeIndex">
											<view class="type-size-counter" 
												v-for="(sizeValue, sizeIndex) in tyepItem.size" :key="sizeIndex" 
												v-if="forwardList[index].typeList[typeIndex].num[sizeIndex]" 
											>
												<view class="type-size">
													<text>款式：{{ tyepItem.name }} 尺码： {{ sizeValue }}</text>
												</view>
												<custom-counter v-model="forwardList[index].typeList[typeIndex].num[sizeIndex]" 
													:args="[index, typeIndex, sizeIndex]" @change="forwardChange"
													:max="list[index].typeList[typeIndex].num[sizeIndex]"
												/>
											</view>
										</view>
									</view>
								</view>
								<view v-else class="none">-转货单暂无商品-</view>
							</scroll-view>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<view class="confirm-order" @tap="sendOrFowared">确认{{ MIXIN_ActiveIndex == 0 ? '发货' : '转单' }}({{  MIXIN_ActiveIndex == 0 ? sendTotal : forwardTotal  }})</view>
		</view>
	</view>
</template>

<script>
	import { deepClone, divideOrder } from "@/common/util/index.js"
	import customCounter from '../../components/public/custom-counter.vue'
	import { _API_OrderDetail, _API_OrderSend } from '@/apis/order.js'
	export default {
		components: { customCounter },
		data() {
			return {
				title: '发货确认',
				address: {}, // 地址
				list: [], // 订单商品列表
				sendList: [], // 发货单
				forwardList: [], // 转货单
				order_num: '', // 订单号
				remark: '', // 物流单号
				MIXIN_ActiveIndex: 1, // 默认转货单
				MIXIN_ScrollViewHeight: 0, // scrollview 高
				MIXIN_MoveBarLeft: this.$store.state.device.screenWidth / 2,
				MIXIN_ScreenWidth: this.$store.state.device.screenWidth, // 屏幕宽
				status: -1, // 0表示未转单，1表示全部转单，2表示部分转单
				actionType: -1, // 用户提交发货时点的按钮 1 发货 2 转单
			}
		},
		computed: {
			sendTotal() { // 发货单商品数量
				return this.sendList.reduce((t, e) => {
					return e.typeList.reduce((tt, ee) => {
						return ee.num.reduce((ttt, eee) => {
							return ttt + (+eee)
						}, tt)
					}, t)
				}, 0) 
			},
			forwardTotal() { // 转货单商品数量
				return this.forwardList.reduce((t, e) => {
					return e.typeList.reduce((tt, ee) => {
						return ee.num.reduce((ttt, eee) => {
							return ttt + (+eee)
						}, tt)
					}, t)
				}, 0) 
			},
			numTotal() { // 订单商品总数量
				return this.sendTotal + this.forwardTotal
			},
			hasNum() { // 计算某件商品数量是否为空
				return item => {
					return item.typeList.reduce((tt, ee) => {
						return ee.num.reduce((ttt, eee) => {
							return ttt + (+eee)
						}, tt)
					}, 0) ? true : false
				}
			}
		},
		onShow() {
			if (this.onShowed) { // 当页面从发货成功返回
				if (!this.numTotal) { // 如果发货单和转货单都为空
					// uni. // 将待发货订单移动至已发货//////////////////////////////////////////////////////////////////
					uni.navigateBack() // 触发路由返回，不让用户在此页面停留
				}
			} else {
				this.onShowed = true
			}
		},
		onLoad(opt) { 
			this.$refs.ltm.loading()
			this.num = +opt.num // 获取订单数量
			this.index = +opt.index // 获取订单下标
			_API_OrderDetail({ order_num: opt.order_num, type: 'normal' }).then(res => { // 获取订单详情
				this.list = deepClone(res.data.goodList) // 备份商品列表
				this.forwardList = deepClone(res.data.goodList) // 生成转货单
				this.sendList = deepClone(res.data.goodList) // 生成发货单
				this.sendList.forEach(e => e.typeList.forEach(ee =>  ee.num = Array(ee.size.length).fill(0))) // 将发货单数量清空
				this.address = res.data.address
				this.order_num = res.data.order_num
				this.$nextTick(() => {
					this.$offset('.swiper').then(res => { this.MIXIN_ScrollViewHeight = res.height }) // 设置scrollview 高
				})
			})
		},
		methods: {
			MIXIN_change({ detail: { current } }) {
				this.MIXIN_ActiveIndex = current
				this.MIXIN_MoveBarLeft = this.MIXIN_ActiveIndex * (this.MIXIN_ScreenWidth / 2)
			},
			switchSwiper(index) { // 点击导航栏切换
				this.MIXIN_ActiveIndex = index
				this.MIXIN_MoveBarLeft = this.MIXIN_ActiveIndex * (this.MIXIN_ScreenWidth / 2)
			},
			sendChange(value, GoodIndex, typeIndex, sizeIndex) { // 发货单数量变化 修改转货单数量
				const forward = deepClone(this.forwardList)
				forward[GoodIndex].typeList[typeIndex].num[sizeIndex] = this.list[GoodIndex].typeList[typeIndex].num[sizeIndex] - value
				this.forwardList = forward
				this.sendList = deepClone(this.sendList)
			},
			forwardChange(value, GoodIndex, typeIndex, sizeIndex) { // 转货单数量变化 修改发货单数量
				const send = deepClone(this.sendList)
				send[GoodIndex].typeList[typeIndex].num[sizeIndex] = this.list[GoodIndex].typeList[typeIndex].num[sizeIndex] - value
				this.sendList = send
				this.forwardList = deepClone(this.forwardList)
			},
			sendOrFowared() { // 点击确认发货/转单
				if (this.MIXIN_ActiveIndex === 0) { // 如果是发货
					if (this.sendTotal) { // 发货单是否有货
						if (this.sendTotal == this.numTotal) { // 如果是全部发货
							this.$refs.ltm.modal('发货确认', ['确定全部发货？', `总计： ${this.sendTotal} 套`]).then(() => {
								this.status = 0 // 该订单类型为 未转单
								this.actionType = 1 // 用户行为为 发货
								this.sendRequest() // 发起请求
							}).catch(() => {
								this.$refs.ltm.toast('取消发货')
							})
						} else { // 如果是部分发货
							this.$refs.ltm.modal('发货确认', [
								'您选择了部分发货，该订单剩余部分会自动转单(该操作不可逆)', 
								`发货部分总计： ${this.sendTotal} 套`,
								`转单部分总计： ${this.forwardTotal} 套`,
							]).then(() => {
								this.status = 2 // 该订单类型为 部分转单
								this.actionType = 1 // 用户行为为 发货
								this.sendRequest() // 发起请求
							}).catch(() => {
								this.$refs.ltm.toast('取消发货')
							})
						}
					} else {
						this.$refs.ltm.toast('发货单暂无商品')
					}
				} else if (this.MIXIN_ActiveIndex === 1) { // 如果是转单
					if (this.forwardTotal) { // 转货单是否有货
						if (this.forwardTotal == this.numTotal) { // 如果是全部转单
							this.$refs.ltm.modal('转单确认', ['确定全部转单？', `总计： ${this.forwardTotal} 套`]).then(() => {
								this.status = 0 // 该订单类型为 全部转单
								this.actionType = 2 // 用户行为为 转单
								this.sendRequest() // 发起请求
							}).catch(() => {
								this.$refs.ltm.toast('取消转单')
							})
						} else { // 如果是部分发货
							this.$refs.ltm.modal('转单确认', [
								'您选择了部分转单，该订单剩余部分会自动发货(该操作不可逆)', 
								`转单部分总计： ${this.forwardTotal} 套`,
								`发货部分总计： ${this.sendTotal} 套`,
							]).then(() => {
								this.status = 2 // 该订单类型为 部分转单
								this.actionType = 2 // 用户行为为 转单
								this.sendRequest() // 发起请求
							}).catch(() => {
								this.$refs.ltm.toast('取消转单')
							})
						}
					} else {
						this.$refs.ltm.toast('转货单暂无商品')
					}
				}
			},
			sendRequest() { // 发货转单网路请求
				this.$refs.ltm.loading()
				_API_OrderSend({ order_num: this.order_num, status: this.status,  list: divideOrder(this.forwardList), remark: this.remark }).then(res => {
					if (res.code === 200) { // 发货成功
						uni.$emit('SENDGOOD', this.index) // 将订单从待发货列表删除
						uni.redirectTo({ url: `../send-success/send-success?type=${this.actionType}&numTotal=${this.num}` })
					} else {
						this.$refs.ltm.toast('发货失败，请稍后重试')
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.test {
		@include page();
		.content {
			@include flex(column);
			.address {
				width: 100%;
				font-size: 26rpx;
				background: #FFFFFF;
				padding: 20rpx 30rpx;
				margin-bottom: 10rpx;
				box-sizing: border-box;
				.name-tel {
					@include flex();
					margin-bottom: 20rpx;
					justify-content: space-between;
					.name {
						font-size: 32rpx;
					}
				}
			}
			.divice-order {
				@include flex(column);
				flex: 1;
				width: 100%;
				.swiper-nav {
					margin-bottom: 1rpx;
					text {
						width: 56rpx;
					}
				}
				.swiper-area {
					flex: 1;
					width: 100%;
					.swiper {
						height: 100%;
						scroll-view {
							.none {
								@include flex();
								height: 100%;
							}
							.item, .express-order {
								padding: 0 30rpx;
								font-size: 26rpx;
								background: #FFFFFF;
								margin-bottom: 10rpx;
								box-sizing: border-box;
								&.express-order {
									@include flex();
									height: 90rpx;
									margin-top: 10rpx;
									input {
										flex: 1;
										height: 100%;
									}
								}
								.info {
									@include flex();
									height: 180rpx;
									justify-content: flex-start;
									image {
										width: 140rpx;
										height: 140rpx;
										margin-right: 40rpx;
									}
									.name {
										font-size: 32rpx;
									}
								}
								.type-size-counter {
									@include flex();
									height: 90rpx;
									box-sizing: border-box;
									justify-content: space-between;
									border-bottom: 1rpx solid $app-base-bg;
								}
							}
						}
					}
				}
			}
			.confirm-order {
				@include flex();
				width: 100%;
				height: 98rpx;
				color: #FFFFFF;
				font-size: 32rpx;
				background: $app-base-color;
			}
		}
	}
</style>
