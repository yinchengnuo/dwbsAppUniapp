<template>
	<view class="login-reg">
		<custom-nav ref="ltm" />
		<image class="hello" src="../../static/icon/login-reg.png"></image>
		<view class="form">
			<navigator url="../phone-area/phone-area" class="phone-area">
				<text class="text">国家/地区</text>
				<text class="area">{{ areaName }}（{{ areaCode == '86' ? '+' : '' }}{{ areaCode }}）</text>
				<text class="icon cuIcon-right"></text>
			</navigator>
			<view class="item">
				<text class="icon cuIcon-mobilefill"></text>
				<input maxlength="11" type="number" v-model="phone" placeholder="请输入手机号" />
				<text v-if="phone" class="cuIcon-roundclosefill" @tap="clearPhone"></text>
			</view>
			<view class="item">
				<text  class="icon cuIcon-markfill"></text>
				<input maxlength="6" type="number" v-model="verifycode" placeholder="请输入6位验证码" />
				<text v-if="verifycode" class="cuIcon-roundclosefill" @tap="clearVerify"></text>
				<view class="countdown" @tap="getCode">
					发送验证码 <text v-if="countDown">{{ ' ' + countDown }}</text>
				</view>
			</view>
			<view v-if="isREG" class="item">
				<text  class="icon cuIcon-medalfill"></text>
				<input maxlength="6" type="text" v-model="invitecode" placeholder="请输入6位邀请码" />
				<text v-if="invitecode" class="cuIcon-roundclosefill" @tap="clearInvite"></text>
			</view>
		</view>
		<view class="big-btn bg" @tap="login">立即{{ isREG ? '注册' : '登录' }}</view>
		<view class="aggree">注册即代表您同意<navigator url="../user-agreement/user-agreement" class="basecolor">《大卫博士会员隐私协议》</navigator></view>
		<view class="weixin">
			<view class="text">
				<text></text>
				<view>第三方登录</view>
				<text></text>
			</view>
			<text class="cuIcon-weixin weixin-icon" @tap="wxlogin"></text>
		</view>
	</view>
</template>

<script>
	import { _API_GetVerifyCode, _API_Reg, _API_Login, _API_LoginWX } from '@/apis/verify.js'
	export default {
		data() {
			return {
				phone: '', // 手机号
				verifycode: '', // 验证码
				invitecode: '', // 邀请码
				countDown: 0, // 倒计时
				isREG: false, // 是否是注册
				areaName: '中国大陆', // 手机号地区名称
				areaCode: '86', // 手机号地区代码
			}
		},
		created() {
			uni.$on('CHOOSEPHONECODE', (name, code) => { // 监听 chooseArea 事件更新
				this.areaName = name // 修改选择的手机号地区名称
				this.areaCode = code // 修改选择的手机号地区代码
			})
		},
		methods: {
			clearPhone() { setTimeout(() => this.phone = '') }, // 清空手机号
			clearVerify() { setTimeout(() => this.verifycode = '') }, // 清空验证码
			clearInvite() { setTimeout(() => this.invitecode = '') }, // 清空邀请码
			getCode() { // 点击获取手机验证码
				if (this.phone.length) { // 手机号是否输入
					if (this.countDown) { // 如果正在倒计时
						this.$refs.ltm.toast('验证码已发送,请稍后重试')
					} else {
						this.$refs.ltm.loading() // 显示 loading
						_API_GetVerifyCode({ mobile: this.phone, code: this.areaCode }).then(res => {
							if (res.code == 200) {
								if (res.data.status == 0) { // 登录 // 0、 1 代表用户是登录 或 注册
									this.isREG = false // 隐藏邀请码框
								} else {
									this.isREG = true // 显示邀请码框
								}
								this.$refs.ltm.toast('验证码发送成功') // 提示邀请码发送成功
								this.countDown = 120 // 倒计时时长
								this.timer = setInterval(() => { // 开始倒计时
									this.countDown --
									if (this.countDown <= 0) { // 倒计时结束清除倒计时
										this.countDown = 0
										clearInterval(this.timer)
									}
								}, 1000)
							} else if (res.code == 300) { // code 300 表示禁止获取验证码，禁止登陆
								this.$refs.ltm.toast('获取验证码失败')
							}
						})
					}
				} else {
					this.$refs.ltm.toast('手机号格式不正确，请重新输入')
				}
			},
			login() { // 点击登录/注册
				if (!this.phone.length) { this.$refs.ltm.toast('手机号格式不正确，请重新输入'); return }
				if (!(this.verifycode.length == 6)) { this.$refs.ltm.toast('验证码格式不正确，请重新输入'); return }
				if (this.isREG && this.invitecode.length != 6) { this.$refs.ltm.toast('请输入正确的邀请码'); return }
				this.$refs.ltm.loading() // 显示 loading
				if (this.isREG) { // 如果是注册
					_API_Reg({
						mobile: this.phone,
						verify_code: this.verifycode,
						recom_code: this.invitecode,
						code: this.areaCode
					}).then(res => {
						this.$refs.ltm.hideLoading()
						if (res.code == 200) { // 注册成功
							this.$store.commit('app/LOGIN', res.data.token) // 保存 token
							uni.reLaunch({ url: '/pages/index-index/index-index' }) // 跳转到首页
						} else if (res.code == 300) { // 验证码不正确
							this.$refs.ltm.toast('验证码错误')
						} else if (res.code == 400) { // 邀请码不存在
							this.$refs.ltm.toast('邀请码不存在，请联系邀请人确认邀请码是否正确')
						}
					})
				} else { // 如果是登录
					_API_Login({
						mobile: this.phone,
						verify_code: this.verifycode
					}).then(res => {
						this.$refs.ltm.hideLoading()
						if (res.code == 200) { // 登录成功
							this.$store.commit('app/LOGIN', res.data.token) // 保存 token
							uni.reLaunch({ url: '/pages/index-index/index-index' }) // 跳转到首页
						} else if (res.code == 300) { // 验证码不正确
							this.$refs.ltm.toast('验证码错误')
						} else if (res.code == 300) { // 验证码不正确
							this.$refs.ltm.toast('验证码失效')
						}
					})
				}
			},
			wxlogin() { // 点击微信登录
				this.$refs.ltm.loading() // 显示 loading
				uni.login({ // 唤起微信登录
				  provider: 'weixin',
				  success: wxres => { // 获取到微信授权信息
					console.log(wxres)
					this.$refs.ltm.loading() // 
					_API_LoginWX(wxres.authResult).then(res => { // 发起微信登录网络请求
						if (res.code == 200) { // 登陆成功
							this.$store.commit('app/LOGIN', res.data.token) // 保存 token
							uni.reLaunch({ url: '/pages/index-index/index-index' }) // 跳转到首页
						} else if (res.code == 300) { // 注册或者未绑定,带着微信信息跳转到手机绑定页面
							uni.navigateTo({ url: '../bind-phone/bind-phone?wx='+ JSON.stringify(wxres.authResult) })
						}
					})
				  },
				  fail: ({ code }) => { // 微信登陆失败，提示失败原因
					  let errMsg;
					  switch (+code) {
						  case -1: errMsg = '参数错误'; break
						  case -2: errMsg = '用户取消'; break
						  case -3: errMsg = '此功能不支持'; break
						  case -4: errMsg = '文件不存在'; break
						  case -5: errMsg = 'IO错误'; break
						  case -6: errMsg = '网络错误'; break
						  case -7: errMsg = '业务参数配置缺失'; break
						  case -8: errMsg = '客户端未安装'; break
						  case -9: errMsg = '快捷方式已存在'; break
						  case -10: errMsg = '授权失败'; break
						  case -99: errMsg = '未知错误'; break
						  case -100: errMsg = '业务内部错误'; break
					  }
					 this.$refs.ltm.toast('微信登陆失败：' + errMsg)
				  },
				  complete: () => { this.$refs.ltm.hideLoading() } // 唤起微信结束后隐藏loading
				})
			}
		}
	}
</script>

<style lang="scss">
	.login-reg {
		height: 100%;
		padding: 30rpx 60rpx;
		box-sizing: border-box;
		.hello {
			width: 345rpx;
			height: 126rpx;
			margin-top: 168rpx;
		}
		.form {
			margin-top: 100rpx;
			.phone-area {
				@include flex();
				justify-content: space-between;
				.text {
					font-size: 32rpx;
				}
				.area {
					color: #42b983;
				}
				
			}
			.item {
				@include flex();
				height: 110rpx;
				padding-top: 20rpx;
				box-sizing: border-box;
				color: $app-sec-text-color;
				border-bottom: 1rpx solid #B2B2B2;
				.icon, .cuIcon-roundclosefill {
					margin: 0 20rpx;
					font-size: 36rpx;
				}
				input {
					flex: 1;
					height: 84rpx;
					margin-left: 15rpx;
				}
				.countdown {
					@include flex();
					height: 50rpx;
					font-size: 24rpx;
					padding: 0 20rpx;
					background: #FFEFF0;
					margin-right: 20rpx;
					border-radius: 33rpx;
					color: $app-base-color;
					text {
						margin-left: 8rpx;
					}
				}
			}
		}
		.aggree {
			margin-top: 30rpx;
			text-align: center;
			font-size: 22rpx;
			navigator {
				display: inline-block;
			}
		}
		.weixin {
			@include flex(column);
			left: 0;
			right: 0;
			bottom: 0;
			position: fixed;
			padding: 30rpx 60rpx;
			box-sizing: border-box;
			.text {
				@include flex();
				width: 100%;
				height: 26rpx;
				justify-content: space-between;
				text {
					height: 3rpx;
					width: 240rpx;
					font-size: 22rpx;
					background: #B2B2B2;
				}
				veiw {
					font-size:22px;
					color: #B2B2B2;
				}
			}
			.weixin-icon {
				@include flex;
				width: 88rpx;
				height: 88rpx;
				color: #64AB23;
				font-size: 52rpx;
				margin-top: 30rpx;
				border-radius: 50%;
				border: 2rpx solid #64AB23;
			}
		}
	}
</style>
