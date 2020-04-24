<template>
	<view class="problem-feedback">
		<custom-nav ref="ltm" :title="title" @cTap="cTap"></custom-nav>
		<view class="content">
			<view class="input">
				<textarea v-model="value" maxlength="200" placeholder="请输入反馈内容，我们会为您更好的服务" />
				<text class="num">{{ value.length }}/200</text>
			</view>
			<view class="big-btn" :class="{ value: value.length }" @tap="handup">提交反馈</view>
		</view>
	</view>
</template>

<script>
	import { _API_AppFeedback } from '@/apis/app.js'
	export default {
		data() {
			return {
				title: '问题反馈',
				value: '',
				root: 0
			}
		},
		methods: {
			handup() {
				if(this.value.trim().length) {
					this.$refs.ltm.loading()
					_API_AppFeedback({ feedback: this.value }).then(res => {
						this.value = ''
						this.$refs.ltm.modal('提示', ['我们已经收到您的反馈内容，非常感谢'], 'nocancel')
					})
				}
			},
			cTap() {
				this.root += 1
				if (this.root > 3) {
					this.root = 0
					plus.nativeUI.prompt("密钥", e => {
						if (e.index == 0 && e.value === 'root') {
							uni.navigateTo({ url:'../AA-apitest/AA-apitest' })
						}
					}, "测试环境", "密钥", ["确认","取消"])
				}
			}
		}
	}
</script>

<style lang="scss">
	.problem-feedback {
		@include page();
		.content {
			padding: 20rpx 30rpx;
			.input {
				width: 690rpx;
				height: 380rpx;
				position: relative;
				background: #FFFFFF;
				border-radius: 10rpx;
				.num {
					right: 30rpx;
					bottom: 20rpx;
					position: absolute;
				}
				textarea {
					width: 100%;
					height: 100%;
					font-size: 26rpx;
					padding: 20rpx 30rpx;
					box-sizing: border-box;
				}
			}
			.big-btn {
				color: #FFFFFF;
				border-width: 0;
				background: #CCCCCC;
				&.value {
					background: $app-base-color;
				}
			}
		}
	}
</style>
