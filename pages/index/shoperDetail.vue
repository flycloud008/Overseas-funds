<template>
	<view>
		<view v-if="extype =='0'">
			<view class="bottom">
				<view><u-field label="商家名称:" v-model="name" placeholder="请输入商家名称" :disabled="true"></u-field></view>
			</view>
			<view class="bottom">
				<view><u-field label="联系电话:" v-model="mobile" placeholder="请输入联系电话"  :disabled="true"></u-field></view>
			</view>
			<view class="bottom">
				<view><u-field label="信用码:" v-model="cardNum" placeholder="请输入统一社会信用代码"  :disabled="true"></u-field></view>
			</view>

			<view class="uploading u-flex" style="justify-content: center;flex-direction: column;">
				<view class="title2" style="    align-self: start;">营业执照</view>
				<view class="">
					<image :src="cardimg1" style="width: 180px; height: 180px;"></image>
				</view>

			</view>


			<view class="uploading u-flex" style="justify-content: center;flex-direction: column;">
				<view class="title2" style="    align-self: start;">门头照片</view>
				<view class=""><image :src="cardimg2" style="width: 180px; height: 180px;"></image></view>

			</view>


			<view class="uploading u-flex" style="justify-content: center;flex-direction: column;">
				<view class="title2" style="    align-self: start;">内饰照片</view>
				<view class=""><image :src="cardimg3" style="width: 180px; height: 180px;"></image></view>

			</view>

			<view class="bottom">
				<view><u-field label="详细地址:" v-model="address" placeholder="请输入详细地址"  :disabled="true"></u-field></view>
			</view>
			<view class="bottom">
				<view><u-field label="简介详情:" v-model="msg" placeholder="请输入简介详情" type="textarea"  :disabled="true"></u-field></view>
			</view>

		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				cardNum: '',
				cardimg1:'',
				cardimg2:'',
				cardimg3:'',
				address:'',
				msg:'',
				mobile:'',
				extype:'0'
			};
		},
		async onLoad(option) {
			this.loadData(option.id)
		},
		methods: {

			async loadData(id) {
				let res = await this.$u.post("/html/work_ddl/index/getDDLShoperDetail",{id:id});
				this.name = res.data.name;
				this.cardNum = res.data.cardNum
				this.cardimg1 = res.data.cardimg1
				this.cardimg2 = res.data.cardimg2
				this.cardimg3 = res.data.cardimg3
				this.address = res.data.address
				this.msg = res.data.msg
				this.mobile = res.data.mobile
		

			
			},

		

		
		}
	}
</script>

<style lang="scss">
	page {
		background: #f1f2f6;
	}

	.title {
		margin-left: 30rpx;
	}

	.classify {
		margin-right: 350rpx;

	}

	.content {
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
	}

	.top {
		width: 686rpx;
		height: 160rpx;
		background: #ffffff;
		border-radius: 16rpx;
		margin-top: 24rpx;
		margin-left: 30rpx;
	}

	.bottom {
		width: 686rpx;
		background: #ffffff;
		border-radius: 16rpx;
		margin-top: 25rpx;
		margin-left: 30rpx;
	}

	.withdrawal button {
		width: 690rpx;
		height: 80rpx;
		background: #50d0af;
		;
		border-radius: 50rpx;
		color: #FFFFFF;
		margin-top: 56rpx;
	}

	.line {
		width: 0rpx;
		height: 74rpx;
		opacity: 1;
		border: 2rpx solid #efefef;
		margin-left: 190rpx;
		margin-top: -45rpx;
	}

	.mode {
		padding-top: 66rpx;
		padding-left: 32rpx;
	}

	.bank {
		margin-left: 252rpx;
		margin-top: -70rpx;
	}

	.title {
		font-size: 24rpx;
		font-weight: 700;
		color: #333333;
		margin-bottom: 10rpx;
	}

	.quota {
		font-size: 20rpx;
		font-weight: 500;
		color: #999999;
	}

	.ico {
		color: #999999;
		margin-top: -35rpx;
		margin-left: 350rpx;
	}

	.bankcard {
		margin-left: 16rpx;
		margin-right: 24rpx;
	}

	.money {
		font-size: 36rpx;
		font-weight: 500;
		color: #666666;
		padding-top: 32rpx;
		margin-left: 32rpx;
	}

	.input {
		margin-left: 32rpx;
		margin-top: 106rpx;
	}

	.ico2 {
		color: #999999;
		margin-top: 150rpx;
		margin-right: 27rpx;
	}

	.authentication {
		font-size: 32rpx;
		font-weight: 700;

	}

	.uploading {
		width: 686rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		margin-top: 25rpx;
		margin-left: 30rpx;
	}

	.title2 {
		font-weight: 700;
		margin-left: 20rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}

	.addition {
		margin-left: 80rpx;
		margin-bottom: 20rpx;
	}

	.addition2 {
		margin-top: 60rpx;
		margin-left: 80rpx;
	}
</style>