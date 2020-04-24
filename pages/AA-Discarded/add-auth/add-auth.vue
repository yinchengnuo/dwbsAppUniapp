<template>
	<view class="add-auth">
		<custom-nav :title="title"></custom-nav>
		<view class="content">
			<view class="total">
				<view class="area">
					<text>
						付款金额：<text class="basecolor">{{ total }}</text>
					</text>
					<text>元</text>
				</view>
			</view>
			<view class="add">
				<view class="imgs">
					<view class="choose" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						<image :src="imgList[index]" mode="aspectFill"></image>
						<view class="del" @tap.stop="DelImg" :data-index="index">
							<text></text>
						</view>
					</view>
					<view class="choose" @tap="ChooseImage" v-if="imgList.length < 3">
						<text class="cuIcon-add"></text>
					</view>
				</view>
				<view class="remark">
					<textarea placeholder="添加备注"></textarea>
				</view>
			</view>
			<view class="big-btn bg">提交凭证</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '添加凭证',
				total: '',
				imgList: ['https://p1.music.126.net/pzJpSxdcALY8_bsvMDkFeA==/18784056651018911.jpg?param=200y200']
			}
		},
		onLoad(opt) {
			this.total = opt.total
		},
		methods: {
			ChooseImage() {
				uni.chooseImage({
					count: 3 - this.imgList.length,
					sizeType: ['original '], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						this.imgList = this.imgList.concat(res.tempFilePaths)
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '删除',
					content: '确定删除这张截图嘛？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.add-auth {
		@include page();
		.content {
			.total {
				@include flex();
				height: 160rpx;
				background: #FFFFFF;
				margin-bottom: 10rpx;
				.area {
					@include flex();
					width: 690rpx;
					height: 90rpx;
					padding: 0 20rpx;
					border-radius: 10rpx;
					box-sizing: border-box;
					border: 2rpx solid #F5F5F5;
					justify-content: space-between;
				}
			}
			.add {
				.imgs {
					@include flex();
					height: 240rpx;
					background: #FFFFFF;
					margin-bottom: 2rpx;
					padding: 35rpx 30rpx;
					box-sizing: border-box;
					justify-content: flex-start;
					.choose {
						@include flex();
						width: 170rpx;
						height: 170rpx;
						position: relative;
						margin-right: 20rpx;
						border: 1rpx solid #999999;
						.del {
							@include flex();
							top: -15rpx;
							width: 30rpx;
							height: 30rpx;
							right: -15rpx;
							border-radius: 50%;
							position: absolute;
							background: $app-base-color;
							text {
								width: 19rpx;
								height: 3rpx;
								background: #FFFFFF;
							}
						}
						text {
							font-size: 60rpx;
						}
						image {
							width: 100%;
							height: 100%;
						}
					}
				}
				.remark {
					@include flex();
					height: 160rpx;
					background: #FFFFFF;
					textarea {
						width: 690rpx;
						height: 120rpx;
						padding: 20rpx;
						box-sizing: border-box;
						border: 2rpx solid #F5F5F5;
					}
				}
			}
			.big-btn {
				width: 480rpx;
			}
		}
	}
</style>
