<template>
	<view>
		<!-- 顶部 -->
		<view class="bg-jb1 u-rela">
			<!-- 状态栏 -->
			<view :style="{height:statusBarHeight+'px'}"></view>
			<!-- 导航栏 -->
			<view class="box2 u-abso w-full u-flex u-p-30" :style="{height:navBarHeight+'px'}">
				<u-image src="/static/template/fanhui.png" width="30rpx" height="30rpx" class="u-m-r-18" @click="toBack"></u-image>
				<view class="u-font-weight u-font-lg fc-f">我的VIP会员</view>
			</view>
			<!-- banner -->
			<view class="u-abso u-flex u-row-between bg-sow">
				<view class="u-flex">
					<view v-if="!vuex_userInfo.avatarUrl"><u-image :src="vuex_userInfo.avatarUrl" shape="circle" height="120rpx" width="120rpx"></u-image></view>
					<view v-if="vuex_userInfo.avatarUrl"><u-image :src="user.src" shape="circle" height="120rpx" width="120rpx"></u-image></view>
					<view class="u-m-l-24 uMsg">
						
						<view class="u-font-lg">{{vuex_userInfo.userName}} ({{vuex_userInfo.mobile}})</view>
						<view class="u-font-sm u-m-t-8" v-if="userLevel.id == 0">尚未开通全美教育会员</view>
						<view class="u-font-sm u-m-t-8" v-if="userLevel.id > 0">剩余时间({{$u.timeFormat(levelEndDate, 'yyyy年mm月dd日')}})</view>
					
					</view>
				</view>
				<view class="zsImg"><u-image src="/static/template/huiyuan-fill.png" shape="circle" height="120rpx" width="150rpx"></u-image></view>
			</view>	
			<view class="u-abso bgImg"><image src="/static/template/img_vip_bg.jpg" class="w-full h-full"></image></view>
		</view>
		<!-- 单选组 -->
		<scroll-view scroll-x="true">
			<radio-group @change="radioChange" class="u-flex u-row-between u-m-30 u-m-t-60">
				<label class="u-rela u-flex-shrink u-m-r-30 uni-list-cell" :class="{current:index === current}" v-for="(item,index) in items" :key="item.code" >
					<view>{{item.name}}</view>
					<view class="u-p-18" style="color: #EBB758;">¥ <text class="u-font-40">{{item.money}}</text></view>
					<view class="u-tips-color u-font-sm" style="text-decoration: line-through;">{{item.moneyCost}}</view>
					<view class="u-abso radioStyle"><radio :value="item.money +''" :checked="index === current" color="#EBB758" /></view>
				</label>
			</radio-group>
		</scroll-view>
		
		<!-- 会员特权 -->
		<view class="u-p-30 u-m-t-30" style="border-top: 18rpx solid #f5f5f5;">
			<view class="u-p-t-30 u-font-xl">VIP会员尊享特权</view>
			<u-grid :col="4" :border="false">
				<u-grid-item class="u-m-t-30" v-for="(item,index) in list" :key="index">
					<navigator :url="item.toUrl" class="u-flex u-flex-col u-col-center">
						<u-image :src="item.src" width="72rpx" height="72rpx"></u-image>
						<view class="u-m-t-18 u-font-sm">{{item.text}}</view>
					</navigator>
				</u-grid-item>
			</u-grid>
		</view>	
		<!-- 底部合计 -->
		<view class="bottomCount u-flex u-row-between">
			<view class="u-flex">总计：<text class="u-font-40" style="color: #EBB758;">¥{{value}}</text></view>
			<view class="ktBtn fc-f" @click="toPay">立即开通</view>
		</view>
		<!-- end -->
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				statusBarHeight: 20,
				navBarHeight: 44,
				user: {
					name: "米卡",
					tel: "13623686000",
					src: "/static/template/img_hd2.png",
				},
				items: [
					
				],
				current: 0,
				value: "",
				list: [
					{ src: "/static/template/icon_vip_jg1.png", text: "精品口语课程" },
					{ src: "/static/template/icon_vip_jg2.png", text: "专属学习计划" },
					{ src: "/static/template/icon_vip_jg3.png", text: "尊享皮肤" },
					{ src: "/static/template/icon_vip_jg4.png", text: "敬请期待" }
				],
				userLevel : {},
				levelEndDate: ""
				
			};
		},
		async onLoad() {
		
		   let list = await this.$u.post('plug_shop/shopuser/getVipLevelListInfo');
		   console.log(list.userLevel)
		   this.items = list.list;
		   this.value = list.list[0].money;
		   this.userLevel = list.userLevel;
		   this.levelEndDate = list.levelEndDate;
		 
		
		  },
		created() {
			const info = uni.getSystemInfoSync(); 
			this.statusBarHeight = info.statusBarHeight;			
			//#ifndef H5 || APP-PLUS || MP-ALIPAY
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect(); 
			this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info.statusBarHeight);	
			//#endif
			
		},
	
		methods: {
			toBack(){
				uni.navigateBack()
			},
			radioChange(evt){
				
				this.value = evt.detail.value;
				for (let i = 0; i < this.items.length; i++) {
					
					if (this.items[i].money == evt.target.value) {				
						this.current = i;						
						break;
					}
				}
			},
			toPay(){
				let checkList = [];
				let checkItem = {};
				checkItem.pid = this.items[this.current].id;
				checkItem.sku = this.items[this.current].name;
				checkItem.buyNum = 1;
				checkItem.buyType = 4;
				checkList.push(checkItem);
				if(!this.vuex_hasLogin){
					let url = '/pages/login/login';
					uni.$u.route(url);
					return ;
				}
				uni.navigateTo({
					url: `/pages/shop/createOrder?data=${JSON.stringify({
						goodsData: checkList
					})}&buyType=4`
				})
			}
		}
	}
</script>

<style lang="scss">
.bg-jb1{ 
	height: 390rpx;
	overflow: hidden;
	.box2{
		z-index: 1;
	}
	.bg-sow{
		bottom: 0;
		left: 30rpx;
		width: 690rpx;
		z-index: 1;
		border-radius: 12rpx;
		background: linear-gradient(102deg, #eacd95 0%, #eacb92 100%);
		padding: 36rpx;
		overflow: hidden;
		.uMsg{
			color: #7E4503;
		}
		.zsImg{
			opacity: 0.2;
		}
	}
	.bgImg{
		left: 0;
		top: 0;
		width: 750rpx;
		height: 390rpx;
		z-index: 0;
	}
}
.uni-list-cell{
	width: 30%;
	padding: 30rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 12rpx;
	box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.06);
	overflow: hidden;
	.radioStyle{
		bottom: 0;
		right: -5px;
	}
}
.current{	
	border: 1px solid #EBB758;
	box-sizing: border-box;
}
.bottomCount{
	position: fixed;
	bottom: 0;
	width: 100%;
	padding: 30rpx;
	box-shadow: 0px -3px 6px rgba(200, 197, 197, 0.4);
	.ktBtn{
		padding: 18rpx 48rpx;
		background: #EBB758;
		border-radius: 60rpx;
	}
}
</style>
