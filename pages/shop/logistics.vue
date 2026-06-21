<template>
	<view>
		<view class="number u-flex">
			<img :src="shopData.image">
			<view class="u-flex">
				<view class="word">{{orderData.deliveryName}}</view>
				<view class="expressage">:{{orderData.deliveryId}}</view>
			</view>
			<view class="copy"><u-button @click="copyHref(orderData.deliveryId)">复制</u-button></view>
		</view>
		<view class="indent u-flex">	
			<u-image src="/static/template/car.png"  height="60rpx" width="60rpx"></u-image>
			<view class="word2">
				<view>订单编号：{{orderData.id}}</view>
				<view>收货地址：{{orderData.userAddress}}</view>
			</view>
		</view>
		<view class="logistics">
			<u-time-line>
					<u-time-line-item nodeTop="2">
						<!-- 此处自定义了左边内容，用一个图标替代 -->
						<template v-slot:node>
							<view class="u-node" style="background: #19be6b;">
								<!-- 此处为uView的icon组件 -->
								<u-icon name="pushpin-fill" color="#fff" :size="24"></u-icon>
							</view>
						</template>
						<template v-slot:content>
								<view class="u-order-title">{{state}}</view>
						</template>
					</u-time-line-item>
						<u-time-line-item v-for="(item, index) in search.Traces" :key="index">
							<!-- 此处没有自定义左边的内容，会默认显示一个点 -->
							<template v-slot:content>
								<view>
									<view class="u-order-desc">{{item.AcceptStation}}</view>
									<view class="u-order-time">{{item.AcceptTime}}</view>
								</view>
							</template>
						</u-time-line-item>
				</u-time-line>
		</view>
		<view class="bottom"><u-button type="error" @click="goReceiving(orderData.id)">确认收货</u-button></view>
	</view>
</template>

<script>
	 	// import {
	  //   	Toast
	  // 	} from 'mand-mobile'
	export default {
		// components: {
		// 	      [Toast.name]: Toast
		// 	    },
		data() {
			return {
				oid:'',
				state:'',
				orderData:{},
				shopData:{},
				search:{},		
			};
		},
		async onLoad(options){
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.oid = options.id
			let res = await this.$u.post("/plug_shop/shopuser/shopOrderDetail",{id:options.id});
			this.orderData = res.shopOrder;
			this.shopData = res.shopOrderCreateData[0];
			let search = await this.$u.post("/plug_shop/shopuser/search",{id:options.id});		
			this.search = JSON.parse(search.data)
			this.search.Traces.reverse()
			if(this.search.State=='0'){
				this.state = '暂无轨迹信息'
			}else if(this.search.State=='1'){
				this.state = '已揽收'
			}else if(this.search.State=='2'){
				this.state = '在途中'
			}else if(this.search.State=='3'){
				this.state = '已签收'
			}else if(this.search.State=='4'){
				this.state = '问题件'
			}
		},
		methods:{
			
			//确认收货
			goReceiving(id){
				uni.showModal({
					title:"确认收货吗?",
					 success: async (e)=>{
						if(e.confirm){
							let res = await this.$u.post("/plug_shop/shopuser/goReceiving",{id:id});
							if(res){
								uni.showToast({
									title:"确认收货成功",
									icon: 'none'
								});
								this.navTo("/pages/shop/order?state=2");
							}
						}
					}
				});
			},
			copyHref(refNumber) {
							uni.setClipboardData({
								data: refNumber,
								success: r => {
									uni.showToast({
										title:'邀请码复制成功'
									})
								}
							});
						},
		}
	}
</script>

<style lang="scss">
.number{
	width: 100%;
	height: 80rpx;
	border-top: 1px solid #E6E6E6;
	border-bottom: 1px solid #f5f5f5;
}
.number{
	img{
		width: 50rpx;
		height: 50rpx;
		margin-left: 20rpx;
	}
}
.indent{
	width: 100%;
	height: 100rpx;
	border-bottom: 1px solid #f5f5f5;
}
.word2{
	font-size: 14px;
	margin-left: 20rpx;
}
.indent{
	img{
		width: 45rpx;
		height: 45rpx;
		margin-left: 20rpx;
	}
}
.bottom{
	width: 100%;
	height: 100rpx;
	position: fixed;
	bottom: 0;
	border-top: 1px solid #f5f5f5;
}
.bottom button{
	width: 130rpx;
	height: 50rpx;
	font-size: 14px;
	margin-right: 20rpx;
	margin-top: 10rpx;
}
.copy button{
	width: 20rpx;
	height: 40rpx;
	font-size: 14px;
	color: #000000;
	margin-left: 200rpx;
	
}
.word{
	color: #19BE6B;
	font-size: 14px;
	margin-left: 20rpx;
}
.expressage{
	font-size: 14px;
}

.u-node {
		width: 44rpx;
		height: 44rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #d0d0d0;
		
	}
	
	.u-order-title {
		color: #333333;
		font-weight: bold;
		font-size: 32rpx;
	}
	
	.u-order-desc {
		color: rgb(150, 150, 150);
		font-size: 28rpx;
		margin-bottom: 6rpx;
	}
	
	.u-order-time {
		color: rgb(200, 200, 200);
		font-size: 26rpx;
	}
	.logistics{
		margin-left: 40rpx;
		margin-top: 20rpx;
	}
</style>
