<template>
	<view class="topBor">
		<form >
			<view class="u-flex u-row-between u-m-l-30 u-m-r-30 u-p-t-30 u-p-b-30 " >
				<u-input class="text" v-model="showMobile" :type="type" :border="border"/>	
			</view>	
			 <view class="saveBtn" @click="update">修改</view>			   
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
		
		
		 
		 
		methods: {
			
			async update(){
				let data = this.showMobile;
				
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data)){
				 this.$api.msg('请输入正确的手机号码');
				 return;
				};
				
				let mobile = await this.$u.post('/work_ymgj/user/getMobile');
				
							
				if(mobile.data == data){
				 this.$api.msg('输入的手机号后与之前的手机号相同');
				 return;
				};
				
				let result = await this.$u.post('/work_ymgj/user/updateMobile',{mobile:this.showMobile})				
				
				
				if(result.result == "true"){
				 
				 this.$api.msg("修改成功");
				 setTimeout(()=>{
				  uni.navigateBack({
				  	delta:2
				  })
				 }, 800)
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
