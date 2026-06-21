<template>
	 	<view>
	 		<view class="background"></view>
	 		<view class="container">
	 			<view class="panel">
	 				<view class="header">请使用生源健康扫描以下二维码</view>
	 				<view>
	 				<w-qrcode  style="margin-top: 1rem;"  :options="options" ref="qrcode"></w-qrcode>
	 				
					<view class="msg">{{msg}}</view>
					</view>
	 				
	 			</view>
	 		</view>
		
	 	</view>
</template>

<script>
	export default{
		components: {
		},
		data() {
			return {
				msg:'',
				types: '', 
				 options:{
					code: '',// 生成二维码的值
					color: ['#11998e','#38ef7d',],// 二维码颜色支持渐变色 目前只支持最多10种颜色的渐变
					size: 500,// 460代表生成的二维码的宽高均为460rpx
					border:{
							color: ['#F27121','#8A2387','#1b82d2'], //边框颜色支持渐变色 最多10种颜色 如果默认黑色此属性不需要传
							opacity: 0.6, //边框透明度 默认为1不透明 0~1
							lineWidth: 6, //边框宽度
							degree: 15 //边框圆角度数 默认5
					},
				},
			};
		}, 
 
		async onLoad(options){
			var user = await this.$u.post("/login/getLoginUserinfo");
		
			
			this.types = options.types;
			if(this.types == 'jd'){
				uni.setNavigationBarTitle({
					title: "鸡蛋收款码"
				})	
				this.msg = "鸡蛋收款码"
				this.options.code = "鸡蛋收款码_jd_"+user.userinfo.loginCode
			}else if(this.types == 'jf'){
				uni.setNavigationBarTitle({
					title: "积分收款码"
				})	
				this.msg = "积分收款码"
				this.options.code = "积分收款码_jf_"+user.userinfo.loginCode
			}else if(this.types == 'sj'){
				uni.setNavigationBarTitle({
					title: "商家收款码"
				})	
				this.msg = "商家收款码"
				this.options.code = "商家收款码_sj_"+user.userinfo.loginCode
			}
		},

		methods:{
			 data() {
            return {
              
            }
        },
		}

	}
</script>
<style scoped lang="less">
page {
	background-color: #ffaa7f;
}

.background {
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: -1;
	background-color: #ffaa7f;
}

.container {
	display: flex;
	justify-content: center;
}

.panel {
	margin-top: 80rpx;
	display: flex;
	overflow: hidden;
	flex-direction: column;
	justify-content: space-between;
	align-items: stretch;
	align-items: center;
	width: 95%;
	border-radius: 10rpx;
	background-color: #fff;
	padding-bottom: 80rpx;
}

.header {
	width: 100%;
	height: 140rpx;
	background-color: #f0f0f0;
	border-radius: 10rpx 10rpx 0 0;
	text-align: center;
	line-height: 140rpx;
	font-weight: bold;
	letter-spacing: 2px;
	margin-bottom: 40rpx;
	color: #1b82d2;
}
.msg{
	width: 100%;
	height: 50rpx;
	border-radius: 10rpx 10rpx 0 0;
	text-align: center;
	line-height: 140rpx;
	font-weight: bold;
	letter-spacing: 2px;
	margin-bottom: 40rpx;
	color: #1b82d2;
}

.barnum {
	width: 670rpx;
	height: 100rpx;
	line-height: 100rpx;
	font-size: 38rpx;
	font-weight: bold;
	text-align: center;
	letter-spacing: 5rpx;
	white-space: nowrap;
}
</style>
