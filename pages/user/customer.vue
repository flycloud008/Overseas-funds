
<template>
	<view>
		<u-image class="logo" v-if="!logo==''"  :src="logo" mode="widthFix" shape="circle" width="200rpx" height="400rpx"></u-image>
		
		<!-- <u-image class="logo" v-if="logo==''" src="/static/template/icon_logo.png" shape="circle" height="100%" width="100%"></u-image> -->
		<view class="content">
		<view class="word u-flex">
			<view class="customerservice">客服电话</view>
			<view class="Telephone">{{phone}}</view>
			<view class="ico"><u-icon name="arrow-right"></u-icon></view>
		</view>
		<!-- <view class="word u-flex">
			<view class="mailbox">邮箱</view>
			<view class="number">{{email}}</view>
			<view class="ico2"><u-icon name="arrow-right"></u-icon></view>
			
		</view> -->
		<view class="u-flex u-row-between data">
			<view class="data-itee">邮箱</view>
			<view class="u-flex">
				<view class="data-item1">{{email}}</view>
				<view class="data-ico2"><u-icon name="arrow-right"></u-icon></view>
			</view>
		</view>
		<view class="word u-flex" @click="show = true">
			<view class="weixin" >添加客服微信</view>
			<view class="ico3"><u-icon name="arrow-right" @click="show = true"></u-icon></view>
			<view>
					<u-popup v-model="show" mode="center" border-radius="14" width="500rpx" height="250px" :closeable="true">
						<view class="wexin"><img :src=wxin alt=""></view>
						<view class="add">添加客服微信</view>
					</u-popup>
			</view>
		</view>
		<view class="word u-flex" @click="toUrl()">
			<view class="agreement" >关于我们
			</view>
			<view class="ico4"><u-icon name="arrow-right"></u-icon></view>
			
			
			<!-- <view class="ico"><u-icon name="arrow-right"></u-icon></view> -->
			
		</view>
		</view>
	</view>
</template>

<script>
	
	export default {
			data() {
				return {
					show: false,
					logo:"/static/template/icon_logo.png",		
								phone:'',
								email:"",
								wxin:""
					}
			},
			async onLoad() {
			
			 let aboutList = await this.$u.post('/html/app/aboutUs');
			 if(aboutList.describe!=''){
			 		this.about =aboutList.describe;
			 }
			 if(aboutList.logo!=''){
			 		this.logo = aboutList.logo;
			 }
			 if(aboutList.phone!=''){
			 		this.phone =aboutList.phone;
			 }
			 if(aboutList.email!=''){
			 		this.email = aboutList.email;
			 }
			 if(aboutList.wxin!=''){
			 		this.wxin =aboutList.wxin;
			 }
			 },
			methods:{
				toUrl(){
					uni.navigateTo({
								url: `/pages/user/aboutUs`
						})
				},
			}			
			
		}
</script>

<style lang="scss">
	.data {
			font-size: 28rpx;
			font-weight: 500;
			color: #000000;
			margin-top: 64rpx;
			&-itee {
				margin-left: 32rpx;
			}
			&-item1{
				margin-right: 24rpx;
			}
			&-ico2{
		color: #D1D1D1;
		margin-right:54rpx ;
	}
	}
.logo{
		margin: 0 auto;
		margin-top: 60rpx;
}
.word{
	font-size: 28rpx;
	font-weight: 500;
	color: #000000;
	margin-left: 32rpx;
}
.customerservice{
	margin-top: 120rpx;
}
.Telephone{
	margin-top: 120rpx;
	margin-left: 334rpx;
}
.ico{
	color: #D1D1D1;
	margin-top: 120rpx;
	margin-left: 23rpx;
}
.mailbox{
	margin-top: 64rpx;
}
.number{
	margin-left: 440rpx;
	margin-top: 64rpx;
}
.ico2{
	color: #D1D1D1;
	margin-top: 64rpx;
	margin-left: 23rpx;
}
.weixin{
	margin-top: 64rpx;
}
.ico3{
	color: #D1D1D1;
	margin-top: 64rpx;
	margin-left: 480rpx;
}
.agreement{
	margin-top: 64rpx;
}
.ico4{
	color: #D1D1D1;
	margin-top: 64rpx;
	margin-left: 536rpx;
}
.wexin{
	img{
		width: 204rpx;
		height: 204rpx;
		margin-top: 132rpx;
		margin-left: 150rpx;
	}
}
.add{
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
}
.content{
	// margin-top: -250rpx;
	// width: 686rpx;
	//  height: 700rpx;
	//  background: #ffffff;
	//  margin-left: 32rpx;
	//  border-radius: 12rpx;
	//  margin-bottom: 32rpx;
	//  box-shadow: 0rpx 0rpx 26rpx 0rpx rgba(82,100,202,0.22);
}
.word3{
	background-color: #f7f8fa;
	border-radius: 10rpx;
	text-indent:60rpx;
}
</style>
