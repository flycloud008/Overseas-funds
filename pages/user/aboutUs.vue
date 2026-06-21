<template>
	<view class="topBor u-p-80 u-flex u-flex-col">
		<view class="br-circle u-m-30" >
			<u-image  :src="logo"  height="200" width="270"></u-image>
		</view>		
		<view class="u-m-t-60" style="color: #666;">
			{{about}}
		</view>		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				logo:"/static/template/icon_logo.png",
				about:"生源健康,守护您的每一天",
			};
			
		},
		async onLoad() {
		
		 let aboutList = await this.$u.post('/html/app/aboutUs');
		 if(aboutList.describe!=''){
		 		this.about =aboutList.describe;
		 }
		 if(aboutList.logo!=''){
		 		this.logo = aboutList.logo;
		 }
		 // if(aboutList.phone!=''){
		 // 		this.phone =aboutList.phone;
		 // }
		 // if(aboutList.email!=''){
		 // 		this.email = aboutList.email;
		 // }
		 // if(aboutList.wxin!=''){
		 // 		this.wxin =aboutList.wxin;
		 // }
		 },
	}
</script>

<style lang="scss">

</style>
