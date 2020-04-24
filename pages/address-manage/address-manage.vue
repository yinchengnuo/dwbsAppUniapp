<template>
	<view class="address-manage">
		<custom-nav ref="ltm" :title="title" />
		<view v-if="list.length" class="content">
			<view class="item"  v-for="(item, index) in list" :key="index" @tap="chooseAddress(index)">
				<view class="name-phone">
					<text class="name">收货人: {{ item.con_name }}</text>
					<text class="phone">{{ item.con_mobile }}</text>
				</view>
				<view class="address">{{ item | getAddressString }}</view>
				<view class="status">
					<view class="edit-del">
						<text class="edit" @tap.stop="editAddress(index)">
							<text class="cuIcon-post icon-right"></text>编辑
						</text>
						<text class="del" @tap.stop="delAddress(index)">
							<text class="cuIcon-delete icon-right"></text>删除
						</text>
					</view>
				</view>
			</view>
			<view class="bottom"></view>
		</view>
		<view v-else class="noaddress">还没有地址呢</view>
		<navigator url="../add-address/add-address" class="add-address big-btn bg">新增地址</navigator>
	</view>
</template>

<script>
	import { _API_AddressGet, _API_AddressDel } from '@/apis/address.js'
	export default {
		data() {
			return {
				title: '地址管理'
			}
		},
		computed: {
			list() { return this.$store.state.address.list }
		},
		created() { // 监听添加或者删除地址消息提示
			uni.$on('ADDRESS', msg => {
				this.$refs.ltm.toast(msg)
			})
		},
		methods: {
			editAddress(index) { // 点击编辑地址
				uni.navigateTo({ url: `../add-address/add-address?index=${index}` })
			},
			delAddress(index) { // 点击删除地址
				this.$refs.ltm.modal('提示', ['确定要删除这个地址']).then(() => {
					this.$refs.ltm.loading()
					_API_AddressDel({ id: this.list[index].id }).then(res => {
						this.$store.commit('address/DEL', index)
					})
				}).catch(() => {
					this.$refs.ltm.toast('取消删除')
				})
			},
			chooseAddress(index) { // 如果是选择地址
				if (this.title === '选择地址') {
					this.$store.commit('address/CHOOSEADDRESS', index)
					uni.navigateBack()
				}
				return
			}
		},
		onShow() {
			setTimeout(() => {
				this.$refs.ltm.loading()
				_API_AddressGet().then(res => {
					this.$store.commit('address/GET_ADDRESS', res.data.list)
				})
			}, 333)
		},
		onLoad(opt) {
			if (opt.choose) { // 表示用户是从商品详情页或确认订单页进来的
				this.title = '选择地址'
			}
		}
	}
</script>

<style lang="scss">
	.address-manage {
		@include page();
		.content {
			.item {
				@include flex(column);
				min-height: 250rpx;
				background: #FFFFFF;
				border-bottom: 10rpx solid $app-base-bg;
				box-sizing: border-box;
				padding: 30rpx 30rpx 0;
				.name-phone {
					@include flex();
					width: 100%;
					height: 66rpx;
					justify-content: space-between;
					.name {
						font-size: 32rpx;
					}
					.phone {
						font-size: 26rpx;
					}
				}
				.address {
					flex: 1;
					width: 100%;
					font-size: 26rpx;
					color: $app-sec-text-color;
				}
				.status {
					width: 100%;
					height: 76rpx;
					line-height: 76rpx;
					justify-content: space-between;
					border-top: 2rpx solid $app-base-bg;
					.edit-del {
						@include flex();
						float: right;
						height: 100%;
						width: 268rpx;
						color: $app-sec-text-color;
						justify-content: space-between;
						.edit, .del {
							flex: 1;
							height: 100%;
							text-align: center;
							&.del {
								text-align: right;
							}
						}
					}
				}
			}
			.bottom {
				height: 88rpx;
			}
		}
		.noaddress {
			@include flex();
			height: 100%;
			color: $app-sec-text-color;
		}
		.add-address {
			left: 0;
			bottom: 0;
			margin: 0;
			width: 100%;
			position: fixed;
			border-radius: 0;
		}
	}
</style>
