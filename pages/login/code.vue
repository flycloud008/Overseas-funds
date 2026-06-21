<template>
	<view class="wrap">
		<view class="key-input">
			<view class="title">输入验证码</view>
			<view class="tips">验证码已发送至 {{paramData.mobile}}</view>
			<u-message-input :focus="true" :value="value" @change="change" @finish="finish" mode="bottomLine" :maxlength="maxlength"></u-message-input>
			<text :class="{ error: error }">验证码错误，请重新输入</text>
			<view class="captcha">
				<text :class="{ noCaptcha: show }" @tap="noCaptcha">收不到验证码点这里</text>
				<text :class="{ regain: !show }">{{ second }}秒后重新获取验证码</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			maxlength: 6,
			value: '',
			second: 60,
			show: false,
			error: false,
			paramData : {},
			back:false
		};
	},
	computed: {},
	onLoad(paramData) {
		this.paramData = paramData;
		this.back = paramData.back;
		this.getCaptcha()
		
	},
	methods: {
		getCaptcha(){
			this.second = 60;
			this.show = false;
			this.error  = false;
			this.value = '';
			let interval = setInterval(() => {
				this.second--;
				if (this.second <= 0) {
					this.show = true;
					if (this.value.lenth != 6) {
						this.error = true;
					}
					clearInterval(interval);
				}
			}, 1000);
			
			this.$u.post('/login/getCode', {
				phoneNumber: this.paramData.mobile,
			}).then(res => {
				if(res.openTest == "1"){
					this.$u.toast("测试验证码:"+res.smsCode,3500);
				}
				
			});	
		},
		// 收不到验证码选择时的选择
		noCaptcha() {
			var that = this;
			uni.showActionSheet({
				itemList: ['重新获取验证码'],
				success: function(res) {
					that.getCaptcha();
				},
				
			});
		},
		// change事件侦听
		change(value) {
			// console.log('change', value);
		},
		// 输入完验证码最后一位执行
		finish(value) {
			this.value = value;
			
			this.$u.post('/login/codeLogin', {
				phoneNumber: this.paramData.mobile,
				code : this.value,
				param_deviceType : 'mobileApp',
				rememberMe : true
			}).then(res => {
				if(res.result == "true"){
					this.vuex_login(res);
					if(this.back){
						uni.navigateBack({
							delta: 3
						});
					}
					else{
						this.$u.route({type:'tab',url:'pages/index/index'});
					}
					
				}	
			});	
		}
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	padding: 80rpx;
}

.box {
	margin: 30rpx 0;
	font-size: 30rpx;
	color: 555;
}

.key-input {
	padding: 30rpx 0;
	text {
		display: none;
	}
	.error {
		display: block;
		color: red;
		font-size: 30rpx;
		margin: 20rpx 0;
	}
}

.title {
	font-size: 50rpx;
	color: #333;
}

.key-input .tips {
	font-size: 30rpx;
	color: #333;
	margin-top: 20rpx;
	margin-bottom: 60rpx;
}
.captcha {
	color: $u-type-warning;
	font-size: 30rpx;
	margin-top: 40rpx;
	.noCaptcha {
		display: block;
	}
	.regain {
		display: block;
	}
}
</style>
