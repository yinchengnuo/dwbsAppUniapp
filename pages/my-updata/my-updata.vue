<template>
	<view class="my-updata">
		<custom-nav ref="ltm" :title="title" />
		<view class="content">
			<view class="total">
				<view class="area">
					<text>付款金额：<text class="basecolor">{{ total }}</text></text>
					<input type="number" maxlength="11" v-model="money" />
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
					<view class="choose" @tap="ChooseImage" v-if="imgList.length < maxnum">
						<text class="cuIcon-add"></text>
					</view>
				</view>
				<view class="remark">
					<textarea placeholder="可添加备注：最多20个字" maxlength="20" v-model="remark"></textarea>
				</view>
			</view>
			<view class="big-btn bg" @tap="upload">提交凭证</view>
		</view>
	</view>
</template>

<script>
	import { _API_Proxy_Upload, _API_Proxy_UploadUrls } from '@/apis/user.js'
	export default {
		data() {
			return {
				title: '我的升级',
				total: '',
				money: '',
				remark: '',
				maxnum: 3,
				imgList: []
			}
		},
		onLoad(opt) {
			this.total = opt.total
		},
		methods: {
			ChooseImage() { // 选择截图
				uni.chooseImage({
					count: this.maxnum - this.imgList.length,
					sizeType: ['original '], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						this.imgList = this.imgList.concat(res.tempFilePaths)
					}
				});
			},
			ViewImage(e) { // 预览截图
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				})
			},
			DelImg(e) { // 删除截图
				this.$refs.ltm.modal('提示', ['确定删除这张截图？']).then(() => {
					this.imgList.splice(e.currentTarget.dataset.index, 1)
				}).catch(() => {
					this.$refs.ltm.toast('取消删除')
				})
			},
			async upload() {
				if (!this.money) {
					this.$refs.ltm.toast('请输入付款金额')
					return
				}
				if (!this.imgList.length) {
					this.$refs.ltm.toast('请选择付款截图')
					return
				}
				this.$refs.ltm.loading()
				const list = []
				for(let i = 0; i < this.imgList.length; i ++) {
					list.push(await this.uploadImg(this.imgList[i]))
				}
				_API_Proxy_UploadUrls({ list }).then(res => {
					this.$refs.ltm.loading()
					uni.$emit('UPLOADED')
					uni.navigateBack()
				})
			},
			uploadImg(path) { // 上传图片
				return new Promise((resolve, reject) => {
					plus.zip.compressImage({ src: path, dst: '_doc/a.jpg', overwrite: true, quality: 20 },  e => {
						_API_Proxy_Upload({
							name: 'img',
							filePath: e.target,
							formData: {
								money: this.money,
								remark: this.remark
							}
						}).then(res => {
							resolve(res.data.url)
						})  
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.my-updata {
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
					input {
						flex: 1;
						height: 100%;
						padding: 0 20rpx;
						text-align: right;
						box-sizing: border-box;
					}
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
						width: 140rpx;
						height: 140rpx;
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
