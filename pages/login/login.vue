<template>
	<view class="u-flex u-flex-col u-row-center u-p-60 h-full">
		<view><u-image src="/static/template/icon_logo.png" width="270" height="200"></u-image></view>
		<view class="u-flex-col u-col-bottom w-full u-m-t-80">
			<view class="w-full u-m-t-60"><u-field icon="phone" v-model="username" placeholder="请输入账号"></u-field></view>
			<view class="w-full u-m-t-48"><u-field icon="lock" type="password" v-model="password" placeholder="请输入密码" ></u-field></view>
			<!-- <view class="u-p-t-30 u-p-b-30" >忘记密码</view> -->
		</view>	
					<view class="u-flex u-row-between">
								<view class="remem  u-flex u-flex-nowrap u-row-left u-p-l-30 u-m-t-30" @click="rememberHandle">
									<u-icon  :name="is_remember ? 'checkmark-circle-fill': 'checkmark-circle'" :color="is_remember ? '#29CCAB': 'inherit'" size="35" color="#29CCAB"/>
									<view class="u-font-24 u-m-l-10" style="color: #29CCAB; font-size: 28rpx;">记住密码</view>
								</view>
							
							<view class=" password"><text  style="color: #29CCAB;"  @click="$u.route({url:'/pages/login/retrieve'})">忘记密码</text></view>
							</view>
		<view class="btn" @click="toHome">登录</view>
		
		<!-- #ifdef H5 -->
		<view class="btn" style="margin-top: 10px;background: #f5a936;" @click="dowonload">下载app</view>
		<!-- #endif -->
		<view class="u-m-t-80 u-p-30">还没有账号？<text class="u-p-18" style="color: #29CCAB; "  @click="register">立即注册</text></view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				is_remember: false,
			};
		},
		onShow() {
			if(uni.getStorageSync('remember_password')) {
				this.is_remember = uni.getStorageSync('remember_password').is_remember
				if(this.is_remember) {
					this.username = uni.getStorageSync('remember_password').username
					this.password = uni.getStorageSync('remember_password').password
				} else {
					this.username = ''
					this.password = ''
				}
			} else {
				this.username = ''
				this.password = '' 
			}
		},
		methods: {
			rememberHandle() {
				this.is_remember = !this.is_remember
			},
			
			async toHome(){
				if(this.username == ''){
					uni.showToast({
						title:"请输入登录账号或手机号",
						icon: 'none'
					})
					return ;
				}
				if(this.password == ''){
					uni.showToast({
						title:"请输入登录密码",
						icon: 'none'
					})
					return ;
				}
				
				uni.showToast({
					title:"正在登录",
					icon: 'none'
				}) 
				
				let result = await this.$u.post("/login/login",{username:this.username,password:this.password,loginType:"pwd"});
				if(result.result == "true"){
					
					this.vuex_login(result);
					if(this.back){
						uni.navigateBack({
							delta: 3
						});
					}
					else{
						this.$u.route({type:'tab',url:'pages/index/index'});
					}
					
				}	
				else{
					uni.showToast({
						title:"登录失败,未知错误",
						icon: 'none'
					})
				}
			},
			
			register(){
				this.$u.route({
							url:"/pages/login/registor"
				})
			},
			
			dowonload(){
				location.href = 'https://app.shengyuanjk.cn/f/html/app/update/index';
			}
		
		}
	}
</script>

<style lang="scss">
page{ height: 100%; }
.btn{
	width: 100%;
	border-radius: 60rpx;
	padding: 24rpx 0;
	margin-top: 80rpx;
	text-align: center;
	font-size: 30rpx;
	color: #fff;
	background: #29CCAB;
	box-shadow: 0px 3px 8px rgba(82, 214, 165, 0.43);
}
.password{
	margin-top: 30rpx;
	margin-left:250rpx;
}
</style>
