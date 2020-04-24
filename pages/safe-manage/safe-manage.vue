<template>
	<view class="safe-manage">
		<custom-nav :title="title"></custom-nav>
		<view class="content">
			<!-- <navigator url="../change-bind/change-bind" class="app-item">
				<text>手机换绑</text>
				<text class="cuIcon-right"></text>
			</navigator> -->
			<navigator url="../address-manage/address-manage" class="app-item">
				<text>地址管理</text>
				<text class="cuIcon-right"></text>
			</navigator>
			<navigator url="../apply-return/apply-return" class="app-item">
				<text>申请退货</text>
				<text class="cuIcon-right"></text>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '安全中心'
			}
		}
	}
</script>

<style lang="scss">
	.safe-manage {
		@include page();
	}
</style>
