<template>
		<view>
	<view v-if="userCardFlag=='1'">
		<view class="top">
			<view class="mode">提现方式</view>
			<view class="line"></view>
			<view class="bank u-flex">
				<view class="u-flex">
				<view>
					<view  @click=" show = true">{{label}}
					
				<view class="ico"><u-icon name="arrow-right"></u-icon></view>
					</view>
					<u-select v-model="show" :list="typeList"  @confirm="confirm"></u-select>
				</view>
				</view>
			</view>
		</view>
		<view class="bottom">
			<view><u-field label="真实姓名" v-model="trueName" label-width="150" disabled="disabled" placeholder="请输入真实姓名">{{trueName}}</u-field></view>
		</view>
		<view class="bottom" v-if="value==1">
			<view><u-field label="银行名称" v-model="bankName" placeholder="请输入银行名称"></u-field></view>
		</view>
		<view class="bottom" v-if="value==1">
			<view><u-field label="银行卡号" v-model="bankCode"  placeholder="请输入银行卡号"></u-field></view>
		</view>
		<view class="bottom" v-if="value==2">
			<view><u-field label="支付宝账号" label-width="150" v-model="bankCode" placeholder="请输入支付宝账号"></u-field></view>
		</view>
		<view class="bottom" v-if="value==3">
			<view><u-field label="微信号" v-model="bankCode" placeholder="请输入微信号"></u-field></view>
		</view>
		<view class="bottom">
			<view><u-field label="提现金额" v-model="money" label-width="150" placeholder="请输入提现金额"></u-field></view>
		</view>
		<view class="rate">可提现佣金:{{yongjin}}  费率:{{rate*100}}%</view>
		<view class="withdrawal"><u-button @click="withdraw" style="background-color: #f9c378;">提现</u-button></view>
		
	</view>
	<view class="u-m-t-80 u-p-t-80 u-flex u-flex-col" v-if="userCardFlag =='0'" >
			<u-image src="/static/temp/goapprove.png" mode="widthFix"></u-image>
		<view class="u-m-t-30 u-content-color u-font-lg authentication" ><u-button @click="navTo('/pages/user/authentication')" type="primary" style="background-color: #f9c378 ;">去实名认证</u-button></view>
	</view>
	<view class="u-m-t-80 u-p-t-80 u-flex u-flex-col" v-if="userCardFlag =='2'">
			<u-image src="/static/temp/load2.png" mode="widthFix"></u-image>
		<view class="u-m-t-30 u-content-color u-font-lg authentication">实名认证审核中...</view>
	</view>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				trueName:'',
				money:'',
				bankCode:'',
				bankName:'',
				label: '提现方式选择',
				value:'',
				rate:'',
				typeList: [{
						value: '1',
						label: '银行卡'
					},
					{
						value: '2',
						label: '支付宝'
					},
					],
				show: false,
				userCardFlag:'',
				yongjin:0,
			};
			},async onLoad() {
				this.loadData()
			},
		methods: {
			
			async loadData() {
				let userInfoDetail = await this.$u.post("/user/getUserinfoDetail");
				this.trueName = userInfoDetail.data.member.trueName;
				this.userCardFlag=userInfoDetail.data.member.userCardFlag;
				let systemConfig = await this.$u.post("/html/base_core/index/getSystemConfig",{name:'basecore.userinfo.extract.charge'});
				this.rate = systemConfig.data;
				this.yongjin = userInfoDetail.data.member.money3;
			},
			async withdraw() {
				if(this.value==0){
					uni.showToast({
						title:"请选择提现方式",
						icon: 'none'
					});
					return;
				}else{
					if(this.money=='0'||this.money.replace(/\s+/g,'')==''){
						uni.showToast({
							title:"请输入正确的提现金额",
							icon: 'none'
						});
						return;
					}else if(this.trueName.replace(/\s+/g,'')==''){
						uni.showToast({
							title:"请输入正确的姓名",
							icon: 'none'
						});
						return;
					}else if(this.bankCode.replace(/\s+/g,'')==''){
						uni.showToast({
							title:"请输入正确的账户",
							icon: 'none'
						});
						return;
					}
					else if(this.bankName.replace(/\s+/g,'')==''&&this.value==1){
						uni.showToast({
							title:"请输入正确的银行名称",
							icon: 'none'
						});
						return;
					}
					let trueMoney = this.money*(1-this.rate)
					
					uni.showModal({
					    content: '手续费:'+(this.money*this.rate).toFixed(2)+'元,到账金额:'+(this.money*(1-this.rate)).toFixed(2)+'元。',
					    success: async (e)=>{
					    	if(e.confirm){
								let withdraw = await this.$u.post('/user/applyWithdrawalByM3',{money:this.money,extractType:this.value,bankCode:this.bankCode,bankName:this.bankName});
								if(withdraw){
									uni.showToast({
										title:"申请提现成功,请等待系统审核",
										icon: 'none'
									});
									uni.navigateBack(2)
								}
					    	}
					    }
					});
					// let withdraw = await this.$u.post('/user/applyWithdrawalByM3',{money:this.money,extractType:this.value,bankCode:this.bankCode,bankName:this.bankName});
					// if(withdraw){
					// 	uni.showToast({
					// 		title:"申请提现成功,请等待系统审核",
					// 		icon: 'none'
					// 	});
					// 	uni.navigateBack(2)
					// }
				}
			},
			confirm(e) {
				this.label = e[0].label;
				this.value = e[0].value;
				this.bankCode='';
			},
			}
	}
</script>

<style lang="scss">
page{
	background: #f1f2f6;
}
.title{
	margin-left: 30rpx;
}
.classify{
	margin-right: 350rpx;

}
.content{
	width: 100%;
	height: 100%;
	background-color: #FFFFFF;
}
.top{
	width: 686rpx;
	height: 160rpx;
	background: #ffffff;
	border-radius: 16rpx;
	margin-top: 24rpx;
	margin-left: 30rpx;
}
.bottom{
	width: 686rpx;
	height: 84rpx;
	background: #ffffff;
	border-radius: 16rpx;
	margin-top: 25rpx;
	margin-left: 30rpx;
}
.withdrawal button{
	width: 690rpx;
	height: 80rpx;
	background: #5670fe;
	border-radius: 50rpx;
	color: #FFFFFF;
	margin-top: 56rpx;
}
.line{
	width: 0rpx;
	height: 74rpx;
	opacity: 1;
	border: 2rpx solid #efefef;
	margin-left: 190rpx;
	margin-top: -45rpx;
}
.mode{
	padding-top: 66rpx;
	padding-left: 32rpx;
}
.bank{
	margin-left: 252rpx;
	margin-top: -70rpx;
}
.title{
	font-size: 24rpx;
	font-weight: 700;
	color: #333333;
	margin-bottom: 10rpx;
}
.quota{
	font-size: 20rpx;
	font-weight: 500;
	color: #999999;
}
.ico{
	color: #999999;
	margin-top: -35rpx;
	margin-left: 350rpx;
}
.bankcard{
	margin-left: 16rpx;
	margin-right: 24rpx;
}
.money{
	font-size: 36rpx;
	font-weight: 500;
	color: #666666;
	padding-top: 32rpx;
	margin-left: 32rpx;
}
.input{
	margin-left: 32rpx;
	margin-top: 106rpx;
}
.ico2{
	color: #999999;
	margin-top: 150rpx;
	margin-right: 27rpx;
}
.authentication button{
	border-radius: 50rpx;
	width: 400rpx;
	margin-top: 20rpx;
}
.rate{
	// color: red;
	margin-left: 55rpx;
	margin-top: 20rpx;
}
</style>
