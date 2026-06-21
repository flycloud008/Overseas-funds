<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录</view>
			<input class="u-border-bottom" type="number" v-model="tel" placeholder="请输入手机号" />
			<view class="tips">未注册的手机号验证后自动创建账号</view>
			<u-button @click="getMobileCode" :style="[inputStyle]" class="getCaptcha">获取短信验证码</u-button>
			<view class="alternative">
				<view class="password" @click="$u.route({url:'/pages/login/login',type:'redirectTo'})">密码登录</view>
			</view>
		</view>
		<!-- <view class="buttom">
			<view class="loginType">
				<view class="wechat item">
					<view class="icon"><u-icon size="70" name="weixin-fill" color="rgb(83,194,64)"></u-icon></view>
					微信
				</view>
				<view class="QQ item">
					<view class="icon"><u-icon size="70" name="qq-fill" color="rgb(17,183,233)"></u-icon></view>
					QQ
				</view>
			</view>
			
		</view> -->
		
			<view class="u-m-t-80 u-p-30" style="position: fixed;bottom: 60rpx;left: 26%;">还没有账号？<text class="u-p-18" style="color: #29CCAB;" @click="toRegister">立即注册</text></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tel: '',
			back: false,
		}
	},
	onLoad(option){
		if(option.back){
			this.back = true;
		}
	},
	computed: {
		inputStyle() {
			let style = {};
			if(this.tel) {
				style.color = "#fff";
				style.backgroundColor = "#29CCAB";
			}
			return style;
		}
	},	
	methods: {
		
		getMobileCode() {
			
			let ismobile  =  this.$u.test.mobile(this.tel);
			if(!ismobile){
				this.$u.toast("请输入正确的手机号码");
				return ;
			}
			
			this.$u.route('/pages/login/code', {
				mobile: this.tel,
				back:this.back
			});
			
		}
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	font-size: 28rpx;
	.content {
		width: 600rpx;
		margin: 80rpx auto 0;

		.title {
			text-align: left;
			font-size: 60rpx;
			font-weight: 500;
			margin-bottom: 100rpx;
		}
		input {
			text-align: left;
			margin-bottom: 10rpx;
			padding-bottom: 6rpx;
		}
		.tips {
			color: $u-type-info;
			margin-bottom: 60rpx;
			margin-top: 8rpx;
		}
		.getCaptcha {
			background-color: rgb(253, 243, 208);
			color: $u-tips-color;
			border: none;
			font-size: 30rpx;
			padding: 12rpx 0;
			
			&::after {
				border: none;
			}
		}
		.alternative {
			color: $u-tips-color;
			display: flex;
			justify-content: center;
			margin-top: 50rpx;
		}
	}
	.buttom {
		.loginType {
			display: flex;
			padding: 350rpx 150rpx 150rpx 150rpx;
			justify-content:space-between;
			
			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: $u-content-color;
				font-size: 28rpx;
			}
		}
		
		.hint {
			padding: 20rpx 40rpx;
			font-size: 20rpx;
			color: $u-tips-color;
			
			.link {
				color: $u-type-warning;
			}
		}
	}
}
</style>
