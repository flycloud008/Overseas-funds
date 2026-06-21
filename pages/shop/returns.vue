<template>
	<view>
		<view class="box u-flex">
			<view class="u-m-r-40 box-leix">申请类型</view>
			<view class="box-tuik">我要退款（无需退货）</view>
		</view>
		<view class="box u-flex u-row-between" @click="show = true">
			<view class="u-flex">
				<view class="u-m-r-40 box-leix">申请原因</view>
				<view class="box-tuik">{{ result }}</view>
			</view>
			<u-icon name="arrow-right" color="#ccc" size="28" />
		</view>
		<u-select v-model="show" mode="single-column" :list="list" @confirm="confirm" />
		<view class="box" @click="show = true">
			<view class="box-leix u-m-b-20">申请金额</view>
			<view class="box-money">￥25.6</view>
		</view>
		<view class="box" @click="show = true">
			<view class="u-flex u-row-between u-m-b-10">
				<view class="u-m-r-40 box-leix">申请说明</view>
				<view class="box-shuru">退款说明</view>
			</view>
			<u-input v-model="value" :type="type" :height="height" :auto-height="autoHeight" placeholder="必填,请您详细填写申请说明"
				placeholder-style="font-size: 28rpx;color:#999;" />
		</view>
		<view class="box u-flex">
			<view class="box-leix u-m-r-40">联系电话</view>
			<view class="box-tuik">15309168079</view>
		</view>

		<button class="box-btn">提交申请</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				type: 'textarea',
				height: 170,
				autoHeight: true,
				show: false,
				result: '',
				list: [{
						value: '1',
						label: '协商一致退款'
					},
					{
						value: '2',
						label: '多拍，错拍，不想要'
					},
					{
						value: '3',
						label: '发货慢'
					},
					{
						value: '4',
						label: '缺货'
					},
					{
						value: '5',
						label: '地址/信息填错'
					},
					{
						value: '4',
						label: '其他'
					}
				],

			}
		},
		methods: {
			confirm(e) {
				this.result = '';
				e.map((val, index) => {
					this.result += this.result == '' ? val.label : '-' + val.label;
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #f1f1f1;
	}

	.box {
		width: 100%;
		// height: 40rpx;
		margin-top: 20rpx;
		padding: 20rpx 40rpx;
		background: #fff;
		font-size: 30rpx;

		&-leix {
			color: #333;
		}

		&-tuik {
			color: #000;
		}

		&-money {
			font-size: 72rpx;
			font-weight: 700;
			color: #000;
		}

		&-shuru {
			font-size: 28rpx;
			color: rgba(102, 102, 102, 0.83);
		}

		&-btn {
			width: 690rpx;
			height: 80rpx;
			line-height: 80rpx;
			margin: 60rpx auto;
			font-size: 32rpx;
			color: #fff;
			background-color: $base-color;
			border-radius: 10rpx;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
		}
	}
</style>
