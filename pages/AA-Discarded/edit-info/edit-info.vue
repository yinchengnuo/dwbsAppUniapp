<template>
	<view class="edit-self-info">
		<custom-nav :title="title" />
		<view class="content">
			<view class="avatar-area">
				<image class="avatar" :src="userinfo.avatar"></image>
			</view>
			<view class="app-item item">
				<text>微信昵称</text>
				<input v-model="userinfo.user_name" disabled />
			</view>
			<view class="app-item item">
				<text>真实姓名</text>
				<input v-model="userinfo.real_name" disabled />
			</view>
			<view class="app-item item">
				<text>身份证号</text>
				<input v-model="userinfo.id_card_num" disabled />
			</view>
			<view class="app-item item">
				<text>联系方式</text>
				<input v-model="userinfo.user_phone" disabled />
			</view>
			<navigator url="../address-manage/address-manage" class="app-item item address">
				<text>我的地址</text>
				<text class="addressText ellipsis">{{ addressList[usingAddressIndex].address }}</text>
				<text class="cuIcon-right"></text>
			</navigator>
			<view class="app-item item item-space">
				<text>代理级别</text>
				<input v-model="userinfo.level" disabled />
			</view>
			<view class="app-item item">
				<text>上级代理</text>
				<input v-model="userinfo.up_name" disabled />
			</view>
			<view class="app-item item">
				<text>邀请人</text>
				<input v-model="userinfo.invite_name" disabled />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '编辑资料',
				userinfo: {}
			}
		},
		computed: {
			addressList() { return this.$store.state.address.list}, // 用户的地址列表
			usingAddressIndex() { return this.$store.getters['address/usingAddressIndex'] } // 用户选择的地址（初次打开为默认地址）
		},
		created() {
			this.userinfo = this.$store.state.userinfo
		}
	}
</script>

<style lang="scss">
	.edit-self-info {
		@include page();
		.content {
			.avatar-area {
				@include flex();
				height: 300rpx;
				position: relative;
				background: linear-gradient(90deg,rgba(247,100,84,1) 0%, rgba(234,124,95,1) 100%);
				.avatar {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					
				}
			}
			input {
				text-align: right;
				color: $app-main-text-color;
			}
			.address {
				.addressText {
					flex: 1;
					font-size: 26rpx;
					margin-left: 123rpx;
					color: $app-main-text-color;
				}
			}
		}
	}
</style>
