<template>
	<view style="text-align: left">
		<view style="width: 90%;height: 80upx;background-color: #F8F8F8;display: flex;justify-content: space-between;line-height: 80upx;text-align: center;margin:20upx auto">
			<view class="zhushubox" :style="	level == 1	? ' background:#CFAB71;;width:50%;border-radius: 10px 0px 0px 10px;color:#fff'	: 'border-radius: 10px 0px 0px 10px;background:#F5F5F5;width:50%;border-radius:0px 10px 10px 0px;'	"
			 @tap="upupdateLevel(1)">直属成员</view>
			<view class="zhushubox" :style="	level == 2	? ' background:#CFAB71;;width:50%;border-radius:  0 10px 10px 0;color:#fff'	: 'background:#F5F5F5;;width:50%;border-radius:  0 10px 10px 0; border-radius: 0px 10px 10px 0px;'	"
			 @tap="upupdateLevel(2)">非直属成员</view>
		</view>
		<view style="width: 90%;height: 80upx;background-color: #F8F8F8;display: flex;justify-content: space-between;line-height: 80upx;text-align: center;margin:20upx auto">
			<view class="zhushubox" style="border-right: 1upx solid #CCCCCC;width: 50%;">直推人数：{{teamInfo.zsChildListCount}}人</view>
			<view class="zhushubox">间推人数：{{teamInfo.jtBeforeChildListCount}}人</view>
		</view>
		<view>
			<view v-for="(item, index) in pageData.data" :key="index" class="item">
				<view>
					<view style="color: #999999;font-size: 28upx;display: flex;">
						<view >昵称: {{ item.userName}}</view>
					</view>
					<view style="margin-top: 20upx;color: #999999;">账号: {{  item.mobile?item.mobile.replace(/^(.{3})(?:\d+)(.{4})$/, "$1****$2"):"" }}</view>
					<view style="margin-top: 20upx;color: #999999;">邀请时间: {{ item.createDate }}</view>
				</view>
			</view>
			<!-- 加载更多提示 -->
			<uni-load-more :status="pageData.loadType"></uni-load-more>
		</view>
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
				level:1,
				teamInfo:{},
				pageData:{
					pageNo: 1,
					pageSize: 20,
					loadType: "more" ,
					data: [],
				}
			};
		},
		async onLoad() {
		
			this.load();
			let result = await this.$u.post("/user/getMyTeamInfo",{jtLevelNum:2});
			if(!result){return;}
			this.teamInfo = result;
			
			// let userId = this.$queue.getData('userId');
			// if (userId) {
			// 	this.getMoney(userId, this.index);
			// }
		},
		methods: {
			//加载更多
			load(){
				this.loadPage("/user/getMyTeamList",{level:this.level},1);
			},
			onReachBottom(){
				this.loadPage("/user/getMyTeamList",{level:this.level});
			},
			upupdateLevel(nub) {
				this.level = nub;
				this.load();
			},
		
		},
		 
	};
</script>

<style lang="scss">

	page {
		background: #ffffff;
	}

	.header-imgsuo {
		position: absolute;
		top: 28upx;
		width: 28upx;
		height: 28upx;
		margin-right: 10upx;
		align-items: center;

	}

	.zhushubox {
		width: 50%;
		text-align: center;
	}

	.search_submit {
		width: 15%;
		margin-top: 20upx;
		height: 30px;
		line-height: 30px;
		background-color: #f92d60;
		color: #FFFFFF;
		float: right;
		font-size: 28upx;
		z-index: 30;
	}

	.icon-headerI {
		font-size: 12px;
		color: #999999;
		margin-left: 50upx;
	}





	.item {
		background: white;
		padding: 32rpx;
		margin: 32rpx;
		font-size: 28rpx;
		box-shadow: 7px 9px 34px rgba(0, 0, 0, 0.1);
		border-radius: 16upx;
	}
</style>
