<template>
	<view class="u-p-30" style="border-top: 18rpx solid #f5f5f5;">
		<u-verification-code :seconds="seconds" ref="uCode" @change="codeChange"></u-verification-code>
		<view class="u-m-b-30"><u-field type="password" v-model="password" label="新密码" placeholder="请设置密码"></u-field></view>
		<view class="u-m-b-30"><u-field type="password" v-model="password2" label="确认密码" placeholder="请再次输入密码"></u-field></view>
		<view class="btn" @click="createUser()">确定</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				phoneNumber: '',
				code: '',
				password:'',
				password2:'',
				tips: '',
				seconds: 10,
			};
		},

		methods: {
			codeChange(text) {
						this.tips = text;
			},
			async createUser(){
				
				if(this.password == "" || this.password2 == ""){
					uni.showToast({
						title:"请输入密码",
						icon: 'none'
					})
					return ;
				}
				if(this.password != this.password2){
					uni.showToast({
						title:"两次密码输入不一致",
						icon: 'none'
					})
					return ;
				}
			
				let result = await this.$u.post("/work_ddl/user/forgetLoginPwd",{ password:this.password});
				if(result.result == "true"){
					this.vuex_logout();
					uni.$u.route('/pages/login/login');
				}	
				else{
					uni.showToast({
						title:"修改密码失败,未知错误",
						icon: 'none'
					})
				}
			
			},
			getCode() {
				if(this.$refs.uCode.canGetCode) {
					if(this.phoneNumber == ""){
						uni.showToast({
							title:"请输入手机号",
							icon: 'none'
						})
						return ;
					}
					
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					
				
					this.$u.post('/login/getCode', {
						phoneNumber: this.phoneNumber,
					}).then(res => {
						uni.hideLoading();
						this.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
						if(res.openTest == "1"){
							this.$u.toast("测试验证码:"+res.smsCode,3500);
						}
						
					});	
				
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
		}
	}
</script>


<style lang="scss">
.btn{
	width: 100%;
	border-radius: 60rpx;
	padding: 24rpx 0;
	margin-top: 90rpx;
	text-align: center;
	font-size: 30rpx;
	color: #fff;
	background: #29CCAB;
	box-shadow: 0px 3px 8px rgba(82, 214, 165, 0.43);
}
.u-btn--success{ background: #29CCAB; }
</style>
