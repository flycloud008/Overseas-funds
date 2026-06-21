<template>
	<view class="topBor">
		<form >
			<view class="u-flex u-row-between u-m-l-30 u-m-r-30 u-p-t-30 u-p-b-30 " >
				<u-input class="text" v-model="showMobile" :type="type" :border="border"/>	
			</view>	
			 <view class="saveBtn"  @click="test">验证</view>			   
		</form>
		
	</view>
</template>
<script>
	
	export default {
		data() {
			return {
				
				value: '',
				type: 'text',
				border: true,
				showMobile: "",
				mobile:""
				
			};
		},
		
		
		async onLoad(data) {
			let result = await this.$u.post('/work_ymgj/user/getMobile')
		
			this.mobile = result.data;
		  	
		  },
		 
		methods: {
			
			test(){
				
				if(this.mobile == this.showMobile){
					this.$api.msg("验证成功请修改手机号");
					setTimeout(()=>{
					 uni.navigateTo({
					 	url: `/pages/user/updateMobile`
					 })
					}, 800)
					
				}else{
					this.$api.msg("验证失败");
				}
			}
			
			
		}
	}
</script>

<style lang="scss">
.text{
	text-align:right;
	dir:rtl;
}
.borBom{ border-bottom: 0.5px solid #e6e6e6; }
.topBor{
	border-top: 18rpx solid #f5f5f5;
}
.saveBtn{
	width: 80%;
	margin: 0 auto;
	border-radius: 60rpx;
	padding: 24rpx 0;
	margin-top: 80rpx;
	text-align: center;
	font-size: 30rpx;
	color: #fff;
	background: #29CCAB;
	box-shadow: 0px 3px 8px rgba(82, 214, 165, 0.43);
}
</style>
