<template>
	<view>
		<scroll-view scroll-y style="width: 100%; height: 100%;" @scrolltolower="onreachBottom">
		<!-- 我的课单 -->
		<view class="studyBox u-p-30">
			<view class="u-font-xl">我的收藏</view>
			<view class="u-flex u-flex-col">	
				<view class="w-full u-row-between classStyle" v-for="item in list" :key="item.id">
					<!-- <u-checkbox-group  class="w-full">						
						<u-checkbox  shape="circle" 
									v-model="item.isFavorite" :name="item.name" class="w-full u-row-between classStyle">
						</u-checkbox>
					</u-checkbox-group> -->	
					<view class="u-flex u-col-top w-full u-m-l-12 a">
						<view @click="navToDetailPage(item)"><u-image :src="vuex_baseImgUrl+item.image" border-radius="10" width="90rpx" height="90rpx"></u-image></view>
						<view class="u-flex u-flex-col u-col-top u-m-l-30 " style="width: 450rpx;">
							<text class="u-main-color u-line-1" style="width: 450rpx;">{{item.name}}</text>
							<u-parse :html="item.info" class="u-font-sm u-tips-color">></u-parse>
						</view>
						<view class="delete" @click="deleteFavorite(item.id)"><u-image src="/static/template/shanchu.png"  height="60rpx" width="60rpx"></u-image></view>
					</view>
					
				</view>
			</view>
		</view>	
		<!-- 暂无数据 -->
		<view v-if="list.length==0" class="u-m-t-80 u-p-t-80 u-flex u-flex-col">
			<view style="width: 330rpx; height: 255rpx;">
				<u-image src="/static/template/empty.jpg" width="100%" height="100%"></u-image>
			</view>						
			<view class="u-m-t-30 u-content-color u-font-lg">暂无收藏</view>
		</view>
		<!-- end -->
		</scroll-view>
		<!-- <uni-load-more :status="pageData.loadType"></uni-load-more> -->
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore	
		},
		data() {
			return {
				statusBarHeight: 20,
				navBarHeight: 44,
				list: []
			};
		},
		created() {
			const info = uni.getSystemInfoSync(); 
			this.statusBarHeight = info.statusBarHeight;			
			//#ifndef H5 || APP-PLUS || MP-ALIPAY
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect(); 
			this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info.statusBarHeight);	
			//#endif
		},
		async onLoad() {
			this.favorite()
		},
		async onNavigationBarButtonTap(e) {
			const index = e.index;
			let listShopFavorite = await this.$u.post('/plug_shop/shopuser/deleteFavorite',{list:JSON.stringify(this.list)});
			this.favorite()
		},
			
		onReachBottom(){
			this.loadPage("/plug_shop/shopuser/getShopFavorite");
		},	
		methods:{
			async favorite() {
				let listShopFavorite = await this.$u.post('/plug_shop/shopuser/getShopFavorite',{pageSize:20,pageNo:1});
				this.list=listShopFavorite.data	.list
			},
			
			toBack(){
				uni.navigateBack()
			},
			delate(){
				
			},
			navToDetailPage(item){
				//测试数据没有写id，用title代替
				let id = item.id;
				if(item.specType!=undefined){
					uni.navigateTo({
						url: `/pages/shop/product?id=${id}`
					})
				}else{
					uni.navigateTo({
						url: `/pages/shop/detailClass?id=${id}`
					})
				}
			},
			async deleteFavorite(id) {
				let listShopFavorite = await this.$u.post('/plug_shop/shopuser/addShopFavorite',{pid:id,type:0});
				this.favorite()
			},
			moreClass(index){
				console.log(index)
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				//console.log(e);
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				//console.log(e);
			}
		}
	}
</script>

<style lang="scss">
.bg-jb1{
	
	.box2{
		/*  #ifdef MP-WEIXIN */
		width: 600rpx;
		/*  #endif  */		
		/*  #ifndef MP-WEIXIN */
		width: 100%;
		/*  #endif  */
	}
}
.studyBox{	
	border-top: 18rpx solid #f5f5f5;
}
.w-full{
	width: 100% !important;
}
.classStyle{
	margin-top: 30rpx;
	padding: 30rpx 24rpx;
	box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
	border-radius: 12rpx;
}
</style>