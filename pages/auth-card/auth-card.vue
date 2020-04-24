<template>
	<view class="auth-card">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="auth-paper">
				<image src="../../static/index/my/auth-paper.png"></image>
				<canvas @tap="previewImage" v-if="drawOver" id="canvas" canvas-id="canvas" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px'}"></canvas>
			</view>
			<view class="save" @tap="save"><text class="cuIcon-down icon-right"></text>保存图片</view>
			<view class="show" @tap="share"><text class="cuIcon-news icon-right"></text>分享证书</view>
		</view>
	</view>
</template>

<script>
	import { 
		judgeIosPermission, // 获取iOS设备上当前App是否有某项权限
		requestAndroidPermission, // 获取Android设备上当前App是否有某项权限
	} from '@/common/util/permission.js'
	import _share from '@/common/util/share.js'
	import { _API_Auth_Code, _API_Auth_Share } from '@/apis/user.js'
	export default {
		data() {
			return {
				title: '我的授权',
				drawOver: false,
				name: this.$store.state.userinfo.nickname,
				phone: this.$store.state.userinfo.mobile,
				canvasWidth: uni.upx2px(465),
				canvasHeight: uni.upx2px(820),
				url: '',
			}
		},
		mounted() {
			this.$refs.ltm.loading()
			_API_Auth_Code().then(res => {
				console.log(res)
				this.url = res.data.url
				const y = this.$options.filters.getYear(res.data.time)
				const m = this.$options.filters.getMonth(res.data.time)
				const d = this.$options.filters.getDate(res.data.time)
				const filters = this.$options.filters
				const ctx = uni.createCanvasContext('canvas')
				ctx.drawImage('../../static/index/my/auth-paper.png', 0, 0, this.canvasWidth, this.canvasHeight)
				ctx.setFontSize(uni.upx2px(14))
				ctx.setTextAlign('left')
				ctx.fillText(this.name, this.canvasWidth / 2 - uni.upx2px(30), uni.upx2px(265))
				ctx.fillText(this.phone, this.canvasWidth / 2 - uni.upx2px(30), uni.upx2px(305))
				ctx.setTextAlign('center')
				ctx.fillText(res.data.code, this.canvasWidth / 2 + uni.upx2px(30), uni.upx2px(485))
				ctx.fillText(`${y}年${m}月${d}日 至 ${y + 1}年${m}月${d}日`, this.canvasWidth / 2 + uni.upx2px(30), uni.upx2px(525))
				ctx.draw()
				this.drawOver = true
			})
		},
		onBackPress() { // 返回时收起分享
			if (uni._SHARE && uni._SHARE.isVisible()) {
				uni._MASK.hide()
				uni._SHARE.hide()
				return true
			}
		},
		methods: {
			previewImage () {  //点击预览图片
				this.$refs.ltm.loading()
				uni.canvasToTempFilePath({ canvasId: 'canvas' }).then(([ , res]) => {  //首先将 canvas 转化为一个图片，获得图片的临时路径
					this.$refs.ltm.hideLoading()
					uni.previewImage({ urls: [res.tempFilePath] })
				})
			},
			save() { // 点击保存图片
				if (plus.os.name == "iOS") { // 判断设备
					if (judgeIosPermission("photoLibrary")) {
						this.$refs.ltm.loading()
						uni.canvasToTempFilePath({ canvasId: 'canvas' }).then(([ , res]) => {  //首先将 canvas 转化为一个图片，获得图片的临时路径
							uni.saveImageToPhotosAlbum({ filePath: res.tempFilePath }).then(() => {
								this.$refs.ltm.hideLoading()
								this.$refs.ltm.toast('保存成功')
							})
						})
					} else {
						this.$refs.ltm.toast('大卫博士需要获取访问相册的权限，以保证图片能够保存到您的手机相册')
					}
				} else {
					requestAndroidPermission('android.permission.WRITE_EXTERNAL_STORAGE').then(res => {
						if (res === 1) {
							this.$refs.ltm.loading()
							uni.canvasToTempFilePath({ canvasId: 'canvas' }).then(([ , res]) => {  //首先将 canvas 转化为一个图片，获得图片的临时路径
								uni.saveImageToPhotosAlbum({ filePath: res.tempFilePath }).then(() => {
									this.$refs.ltm.hideLoading()
									this.$refs.ltm.toast('保存成功')
								})
							})
						} else {
							this.$refs.ltm.modal('保存失败', ['大卫博士需要获取访问相册的权限，以保证图片能够保存到您的手机相册'], 'nocancel')
						}
					})
				}
			},
			share() { // 点击分享证书
				if (this.url) { // 如果证书已经上传到服务器，直接分享
					_share({ type: 2, imageUrl: this.url })
				} else { // 如果服务器没有证书，先上传再分享
					this.$refs.ltm.loading()
					uni.canvasToTempFilePath({ canvasId: 'canvas', quality: 0.5 }).then(([ , res]) => {  //首先将 canvas 转化为一个图片，获得图片的临时路径
						plus.zip.compressImage({ src: res.tempFilePath, dst: '_doc/a.jpg', overwrite: true, quality: 20 },  e => {
							_API_Auth_Share({ name: 'img', filePath: e.target }).then(res => {
								if (res.code == 200) {
									this.url = res.data.url
									_share({ type: 2, imageUrl: this.url })
								}
							})  
						})
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.auth-card {
		@include page();
		.content {
			.auth-paper {
				@include flex();
				height: 922rpx;
				background: #FFFFFF;
				position: relative;
				image {
					width: 465rpx;
					height: 820rpx;
				}
				canvas {
					top: 50%;
					left: 50%;
					z-index: 1;
					position: absolute;
					transform: translate(-50%, -50%);
				}
			}
			.save, .show {
				@include flex();
				width: 315rpx;
				height: 88rpx;
				color: #FFFFFF;
				font-size: 34rpx;
				display: inline-flex;
				border-radius: 10rpx;
				margin: 88rpx 30rpx 0rpx;
				background: $app-base-color;
				text {
					font-size: 42rpx;
				}
			}
		}
	}
</style>
