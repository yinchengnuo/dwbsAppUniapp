<template>
	<view class="shop-car">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view v-if="shopcar.length" class="list">
				<view class="shopcar-item" v-for="(item, index) in shopcarList" :key="index">
					<view class="info item" @tap="tapGood(index)">
						<text v-if="item.choosed" class="cuIcon-roundcheckfill"></text>
						<text v-else class="cuIcon-round"></text>
						<image :src="item.img" mode=""></image>
						<view class="name ellipsis">{{ item.name }}</view>
						<text class="cuIcon-delete" @tap.stop="delGood(index)"></text>
					</view>
					<view class="type" v-for="(tyepItem, typeIndex) in item.typeList" :key="typeIndex">
						<view class="item type-size-counter" 
							v-for="(value, key) in tyepItem.size" :key="key" 
							v-if="shopcarList[index].typeList[typeIndex].size[key]" 
						>
							<text v-if="shopcarList[index].typeList[typeIndex].choosed[key]" class="cuIcon-roundcheckfill" @tap="tapType(index, typeIndex, key)"></text>
							<text v-else class="cuIcon-round" @tap="tapType(index, typeIndex, key)"></text>
							<view class="type-size" @tap="tapType(index, typeIndex, key)">
								<text>款式：{{ tyepItem.name }} 尺码： {{ key }}</text>
								<text class="cost">￥{{ item.price * value }}.00</text>
							</view>
							<custom-counter zeroWarn :value="shopcarList[index].typeList[typeIndex].size[key]" 
								:args="[index, typeIndex, key]" @change="counterChange" @zero="isZero"
							/>
						</view>
					</view>
				</view>
			</view>
			<view v-else class="none">
				<image src="../../static/icon/emptyshopcar.png"></image>
				<view class="big-btn" @tap="goToBuy">去下单</view>
			</view>
		</view>
		<view class="buy">
			<view class="all" @tap="chooseAll">
				<text v-if="choosedAll" class="cuIcon-roundcheckfill"></text>
				<text v-else class="cuIcon-round"></text>
				<text>全选</text>
			</view>
			<view class="total">总计: <text>{{ '￥ ' + choosedPrice + '.00' }}</text></view>
			<view class="pay" @tap="confirm">结算({{ ' ' + choosedNum + ' ' }})</view>
		</view>
	</view>
</template>

<script>
	import customCounter from '../../components/public/custom-counter.vue'
	export default {
		components: { customCounter },
		data() {
			return {
				title: '购物车',
				shopcarList: []
			}
		},
		computed: { 
			shopcar() { return this.$store.state.shopcar.list },
			choosedNum() { return this.$store.getters['shopcar/choosedNum'] },
			choosedAll() { return this.$store.getters['shopcar/choosedAll'] },
			choosedList() { return this.$store.getters['shopcar/choosedList'] },
			choosedPrice() { return this.$store.getters['shopcar/choosedPrice'] }
		},
		created() {
			this.shopcarList = this.shopcar
		},
		methods: {
			delGood(index) { // 删除商品
				this.$refs.ltm.modal('提示', ['确定删除这种商品？']).then(() => {
					this.$store.commit('shopcar/DEL', index)
					this.$refs.ltm.toast('删除成功')
				}).catch(() => {
					this.$refs.ltm.toast('取消删除')
				})
			},
			chooseAll() { // 点击全选
				this.$store.commit('shopcar/CHOOSEDCHANGE', [])
			},
			tapGood(index) { // 点击商品
				this.$store.commit('shopcar/CHOOSEDCHANGE', [index])
			},
			tapType(index, typeIndex, key) { // 点击类型
				this.$store.commit('shopcar/CHOOSEDCHANGE', [index, typeIndex, key])
			},
			counterChange(value, index, typeIndex, key) { // 类型数量变化
				this.$store.commit('shopcar/COUNTCHANGE', [index, typeIndex, key, value])
			},
			isZero(eventBUS, ...args) { // 当类型数量变为 0 时
				this.$refs.ltm.modal('提示', ['确定删除这个尺码', `款式：${ this.shopcar[args[0]].typeList[args[1]].name }`, `尺码： ${ args[2] }`]).then(() => {
					eventBUS.$emit('beZero')
				}).catch(() => {
					eventBUS.$emit('beOne')
				})
			},
			confirm() { // 点击结算
				if (this.choosedNum) {
					uni.navigateTo({ url: `../confirm-order/confirm-order?from=shopcar&order=${JSON.stringify(this.choosedList)}` })
				}
			},
			goToBuy() { // 点击去下单
				uni.navigateBack({ delta: 2 })
			}
		}
	}
</script>

<style lang="scss">
	.shop-car {
		@include page();
		.content {
			overflow: auto;
			border-bottom: 98rpx solid #FFFFFF;
			.shopcar-item {
				margin-bottom: 10rpx;
				.item {
					@include flex();
					height: 100rpx;
					font-size: 26rpx;
					padding-right: 30rpx;
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
						.cuIcon-delete{
							@include flex();
							width: 140rpx;
							height: 140rpx;
							font-size: 56rpx;
							color: $app-sec-text-color;
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
					.cuIcon-round, .cuIcon-roundcheckfill {
						@include flex();
						width: 90rpx;
						height: 100%;
						font-size: 32rpx;
						&.cuIcon-roundcheckfill {
							color: $app-base-color;
						}
					}
				}
			}
			.none {
				@include flex(column);
				height: 100%;
				image {
					width: 305rpx;
					height: 417rpx;
				}
				.big-btn {
					width: 280rpx;
					height: 80rpx;
					margin-top: 123rpx;
					border-radius: 40rpx;
				}
			}
		}
		.buy {
			@include flex();
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1;
			height: 98rpx;
			font-size: 32rpx;
			background: #FFFFFF;
			justify-content: space-between;
			box-shadow: 0rpx -1rpx 0rpx 0rpx rgba(178,178,178,1);
			view {
				@include flex();
				height: 100%;
				&.all {
					font-size: 32rpx;
					text {
						margin-left: 30rpx;
						&.cuIcon-roundcheckfill {
							color: $app-base-color;
						}
					}
				}
				&.total {
					flex: 1;
					margin-right: 30rpx;
					justify-content: flex-end;
					text {
						color: $app-base-color;
					}
				}
				&.pay {
					width: 220rpx;
					color: #FFFFFF;
					background: $app-base-color;
				}
			}
		}
	}
</style>
