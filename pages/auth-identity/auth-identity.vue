<template>
	<view class="auth-identity">
		<custom-nav ref="ltm" :title="title" noback />
		<view class="content">
			<view class="app-item item">
				<text>邀请人</text>
				<text>{{ userinfo.recom_nickname }}</text>
			</view>
			<view class="app-item item">
				<text>联系方式</text>
				<text>{{ userinfo.recom_mobile }}</text>
			</view>
			
			<view class="app-item item item-space">
				<text>微信昵称</text>
				<input v-model="wx_nickname" placeholder="请填写微信昵称" />
			</view>
			<view class="app-item item">
				<text>真实姓名</text>
				<input v-model="real_name" maxlength="32" placeholder="请填写真实姓名" />
			</view>
			<view class="app-item item">
				<text>身份证号</text>
				<input type="text" v-model="id_card_num" maxlength="18" placeholder="请填写身份证号(选填）" />
			</view>
			
			<button class="big-btn bg" @tap="submit">提交</button>
		</view>
	</view>
</template>

<script>
	import { _API_SubAuthInfo } from '@/apis/user.js'
	export default {
		data() {
			return {
				title: '身份认证',
				wx_nickname: '',
				real_name: '',
				id_card_num: ''
			}
		},
		computed: {
			userinfo() {
				return this.$store.state.userinfo
			}
		},
		created() {
			this.wx_nickname = this.userinfo.wechatname
		},
		onLoad() {
			uni.AUTH.close()
		},
		methods: {
			submit() { // 点击提交
				if (!this.wx_nickname.length) {
					this.$refs.ltm.toast('微信昵称不能为空')
					return
				}
				if (!this.real_name.match(/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/)) {
					this.$refs.ltm.toast('真实姓名不符合要求')
					return
				}
				if (this.id_card_num.length && !this.id_card_num.match(/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/)) {
					this.$refs.ltm.toast('身份号码不合法')
					return
				}
				this.$refs.ltm.loading() // 显示 loading
				_API_SubAuthInfo({ // 提交信息
					wechatname: this.wx_nickname,
					realname: this.real_name,
					cre_num: this.id_card_num
				}).then(res => {
					if (res.code === 200) { // 提交成功
						this.$store.commit('userinfo/UPDATA_USERINFO', { cert_status: 1 })
						uni.redirectTo({ url:'../auth-progress/auth-progress' }) // redirect 到 审核进度页面
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.auth-identity {
		@include page();
		.content {
			
		}
	}
</style>
