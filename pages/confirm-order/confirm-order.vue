<template>
	<view class="confirm-order">
		<custom-nav ref="ltm" :title="title" />
		<view v-if="!confirmed" class="pay">
			<view class="num">共{{ totalNum }}件</view>
			<view class="total">
				总计：<text>￥{{ totalPrice + '.00' }}</text>
			</view>
			<view class="buy" @tap="confirm">结算({{ ' ' + totalNum + ' ' }})</view>
		</view>
		<view v-if="!confirmed" class="content">
			<navigator url="../address-manage/address-manage?choose=1" class="address">
				<view class="left">
					<view class="name-tel">
						<text class="name">收货人：{{ address ? address.con_name : '未选择' }}</text>
						<text class="tel">{{ address ? address.con_mobile : '' }}</text>
					</view>
					<view class="text">{{ address | getAddressString }}</view>
				</view>
				<text class="cuIcon-right"></text>
			</navigator>
			<view class="list">
				<view class="comfirm-item" v-for="(item, index) in list" :key="index">
					<view class="info item">
						<image :src="item.img" mode=""></image>
						<view class="name ellipsis">{{ item.name }}</view>
					</view>
					<view class="type" v-for="(tyepItem, typeIndex) in item.typeList" :key="typeIndex">
						<view class="item type-size-counter" v-for="(value, key) in tyepItem.size" :key="key">
							<view class="type-size">
								<text>款式：{{ tyepItem.name }} 尺码： {{ key }}</text>
								<text class="cost">￥{{ item.price * value }}.00</text>
							</view>
							<view class="num">×{{ ' ' + value + ' ' }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="remark">
				<textarea :auto-height="true" class="textarea" v-model="remark" placeholder="请输入备注" />
			</view>
		</view>
		<view v-else class="success">
			<image class="ok" src="../../static/icon/ok.png"></image>
			<view class="title">下单成功，请等待上级审核发货...</view>
			<view class="big-btn bg" @tap="upload">查看订单</view>
			<view class="big-btn know" @tap="know">我知道了</view>
		</view>
	</view>
</template>

<script>
	import { confirmOrder } from '../../common/util/index.js'
	import { _API_PlaceOrder } from '@/apis/order.js'
	export default {
		data() {
			return {
				title: '确认订单',
				list: [],
				from: '',
				remark: '',
				confirmed: false,
				order_num: '',
				requesting: false
			}
		},
		computed: {
			address() { return this.$store.state.address.list[this.$store.getters['address/usingAddressIndex']] }, // 用户选择的地址
			totalNum() {
				return this.list.reduce((t, e) => {
					return e.typeList.reduce((tt, ee) => {
						return Object.keys(ee.size).reduce((ttt, eee) => {
							return ttt + ee.size[eee]
						}, tt)
					}, t)
				}, 0)
			},
			totalPrice() {
				return this.list.reduce((t, e) => {
					return e.typeList.reduce((tt, ee) => {
						return Object.keys(ee.size).reduce((ttt, eee) => {
							return ttt + ee.size[eee] * e.price
						}, tt)
					}, t)
				}, 0)
			}
		},
		onLoad(opt) {
			this.from = opt.from // 记录用户是用那个页面进来的
			this.list = JSON.parse(opt.order)
		},
		beforeDestroy() {
			this.$store.commit('address/CLEARCHOOSED') // 清除已选地址
		},
		methods: {
			upload() { // 点击查看订单
				uni.redirectTo({ url: `../order-detail/order-detail?order_num=${this.order_num}` })
			},
			know() { // 点击我知道了
				uni.navigateBack()
			},
			confirm() { // 点击提交订单
				if (this.address) {
					if (!this.requesting) {
						this.requesting = true
						this.$refs.ltm.loading()
						_API_PlaceOrder({ // 发送网络请求
							remark: this.remark, // 备注
							total: this.totalPrice, // 订单总金额
							list: confirmOrder(this.list), // 将数据转换为后端需要的数据格式
							address_id: this.address.id // 地址
						}).then(res => {
							if (res.code === 200) {
								this.requesting = false
								this.confirmed = true // 显示下单成功样式
								this.order_num = res.data.order_num // 获取订单号
								this.$store.commit('address/CLEARCHOOSED') // 清除已选地址
								if (this.from === 'gooddetail') { // 如果用户是从商品详情页点进来的，清除已选择状态
									this.$store.commit('choosed/CLEAR')
								} else if (this.from === 'shopcar') { // 如果用户是从购车车页点进来的，清除购车车中已经提交的商品
									this.$store.commit('shopcar/CLEARCONFIRM', this.list)
								}
							} else {
								this.requesting = false
								this.$refs.ltm.toast('下单失败，请稍后重试')
							}
						})
					}
				} else {
					this.$refs.ltm.toast('请选择地址')
				}
			}
		}
	}
</script>

<style lang="scss">
	.confirm-order {
		@include page();
		.pay {
			@include flex();
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1;
			height: 98rpx;
			position: fixed;
			font-size: 32rpx;
			background: #FFFFFF;
			box-shadow: 0rpx -1rpx 0rpx 0rpx rgba(178,178,178,1);
			.num {
				@include flex();
				height: 100%;
				padding: 0 30rpx;
				box-sizing: border-box;
			}
			.total {
				@include flex();
				flex: 1;
				height: 100%;
				padding: 0 30rpx;
				box-sizing: border-box;
				text {
					color: $app-base-color;
				}
			}
			.buy {
				@include flex();
				height: 100%;
				width: 220rpx;
				color: #FFFFFF;
				background: $app-base-color;
			}
		}
		.success {
			@include flex(column);
			height: 100%;
			background: #FFFFFF;
			box-sizing: border-box;
			padding: 98rpx 111rpx 0;
			justify-content: flex-start;
			.ok {
				width: 228rpx;
				height: 228rpx;
			}
			.title {
				font-size: 36rpx;
				margin-top: 100rpx;
			}
			.big-btn {
				width: 100%;
				margin-top: 121rpx;
				&.know {
					margin-top: 30rpx;
				}
			}
		}
		.content {
			overflow: auto;
			border-bottom: 98rpx solid #FFFFFF;
			.address {
				@include flex();
				min-height: 128rpx;
				background: #FFFFFF;
				padding: 20rpx 30rpx;
				margin-bottom: 10rpx;
				box-sizing: border-box;
				.left {
					@include flex(column);
					flex: 1;
					height: 100%;
					.name-tel {
						@include flex();
						width: 100%;
						font-size: 26rpx;
						justify-content: space-between;
						margin-bottom: 16rpx;
						.name {
							font-size: 32rpx;
						}
					}
					.text {
						width: 100%;
						font-size: 26rpx;
						line-height: 36rpx;
						color: $app-sec-text-color;
					}
				}
				>text {
					margin-left: 20rpx;
				}
			}
			.list {
				.comfirm-item {
					margin-bottom: 10rpx;
					.item {
						@include flex();
						height: 100rpx;
						font-size: 26rpx;
						padding: 0 30rpx;
						margin-bottom: 2rpx;
						background: #FFFFFF;
						box-sizing: border-box;
						justify-content: flex-start;
						&.info {
							height: 180rpx;
							image {
								width: 140rpx;
								height: 140rpx;
								margin-right: 30rpx;
							}
							.name {
								flex: 1;
							}
						}
						&.type-size-counter {
							.type-size {
								@include flex(column);
								flex: 1;
								height: 100%;
								margin-right: 30rpx;
								text {
									@include flex();
									flex: 1;
									width: 100%;
									justify-content: space-between;
									&.cost {
										color: $app-base-color;
									}
								}
							}
						}
					}
				}
			}
			.remark {
				font-size: 26rpx;
				margin-top: 10rpx;
				min-height: 120rpx;
				line-height: 36rpx;
				position: relative;
				background: #FFFFFF;
				padding: 20rpx 30rpx;
				box-sizing: border-box;
				.textarea {
					width: 100%;
					height: 80rpx;
				}
			}
		}
	}
</style>
