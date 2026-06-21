<template>
	<view style="text-align: left">
		<view v-for="(item, index) in pageData.data" :key="index" class="item">
			<view>
				<view style="margin-bottom: 8upx;text-align: right;">
					<text style="margin-bottom: 8upx;color: #1470d2" v-if="item.type==1"> 申请提现</text>
					<text style="margin-bottom: 8upx;color: #4cd0d2" v-if="item.type==2"> 初审通过</text>
					<text style="margin-bottom: 8upx;color: #5fcbae" v-if="item.type==3"> 提现成功</text>
					<text style="margin-bottom: 8upx;color: #e10a07" v-if="item.type==4"> 提现失败</text>
				</view>

				<view style="color: #999999;font-size: 28upx;">
					<view style="margin-bottom: 8upx"> 真实姓名: {{item.trueName}}</view>
					<view style="margin-bottom: 8upx" v-if="item.extractType=='2'"> 支付宝号: {{item.bankCode}}</view>
					<view style="margin-bottom: 8upx" v-if="item.extractType=='1'"> 提现银行: {{item.bankName}}</view>
					<view style="margin-bottom: 8upx" v-if="item.extractType=='1'"> 银行卡号: {{item.bankCode}}</view>
					<view style="margin-bottom: 8upx" v-if="item.extractType=='3'"> 微信账号: {{item.bankCode}}</view>
					<view style="margin-bottom: 8upx"> 发起时间: {{item.createDate}}</view>
					<view style="margin-bottom: 8upx" v-if="item.type==1">成功时间 {{item.updateDate}}</view>
					<view style="margin-bottom: 8upx;color: #e10a07" v-if="item.type==4">失败原因: {{item.remarks}}</view>

					<view style="margin-bottom: 8upx" class="u-flex u-row-between">
						<!-- 提现金额： -->
						<text style="color: #e10a07;font-size: 32upx;font-weight: 500"> 提现金额￥{{item.extMoney}}</text>
						<text style="color: #e10a07;font-size: 32upx;font-weight: 500"> 实际到账￥{{item.money}}</text>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="pageData.loadType"></uni-load-more>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore	
		},
		data() {
			return {
				pageData:{
					pageNo: 1,
					pageSize: 10,
					loadType: "more" ,
					data: []
				}
			};
		},

		async onLoad() {
			this.favorite()
		},
			
		//下拉刷新
		onPullDownRefresh(){
			this.loadPage("/user/wthdraw",{},1);
		},
		//加载更多
		onReachBottom(){
			this.loadPage("/user/wthdraw",{});
		},
		methods:{
			favorite() {
				this.loadPage("/user/wthdraw",{},1);
			},
			
			toBack(){
				uni.navigateBack()
			},
			moreClass(index){
				console.log(index)
			},

		}
	}
</script>

<style lang='scss'>

	page {
		background: #FFFFFF;
	}

	.item {
		background: white;
		padding: 32rpx;
		margin: 32rpx;
		font-size: 28rpx;
		box-shadow: 7px 9px 34px rgba(0, 0, 0, 0.1);
		border-radius: 16upx;
	}
</style>
