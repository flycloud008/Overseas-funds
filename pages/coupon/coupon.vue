<template>
	<!-- 优惠卷面板 -->
	<view class="mask">
		<view class="mask-content">
			<view v-if="couponList.length <= 0 && userCouponList.length <= 0">
				<u-divider height="250" bg-color="#f3f3f3">您没有可领优惠卷</u-divider>
			</view>
			<view v-else>
				<!-- 优惠券页面，仿mt -->
				<!-- 用户未领取的优惠卷 -->
				<view class="coupon-item" v-for = "(item, index) in couponList" :key = "item.id">
					<view>
						<view class="con" v-if="item.num > 0">
							<view class="left">
								<text class="title">{{item.name}}</text>
								<text class="time">有效时间{{item.numDay}}天</text>
							</view>
							<view class="right">
								<text class="price">{{item.money}}</text>
								<text>满{{item.satisfyMoney}}可用</text>
							</view>
							
							<view class="circle l"></view>
							<view class="circle r"></view>
						</view>
						<text class="tips">限新用户使用</text>
						<u-button type="primary" v-if="item.flag == false" @click="userGetCoupon(item,index)">领取</u-button>
						<u-button type="primary" v-else @click="makeCoupon">去使用</u-button>
					</view>
				</view>
				<!-- 用户已领取的优惠卷 -->
				<view class="coupon-item" v-for = "(item, index) in userCouponList" :key = "item.id">
					<view>
						<view class="con" v-if="item.num > 0">
							<view class="left">
								<text class="title">{{item.name}}</text>
								<text class="time">有效时间{{item.numDay}}天</text>
							</view>
							<view class="right">
								<text class="price">{{item.money}}</text>
								<text>满{{item.satisfyMoney}}可用</text>
							</view>
							
							<view class="circle l"></view>
							<view class="circle r"></view>
						</view>
						<text class="tips">限新用户使用</text>
						<u-button type="primary" v-if="item.flag == false" @click="userGetCoupon(item,index)">领取</u-button>
						<u-button type="primary" v-else @click="makeCoupon">去使用</u-button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				couponList:[],
				userCouponList:[]
			}
		},
		onLoad() {
			this.loadDate();
		},
		methods: {
			async loadDate(){
				//展示所有未被领完的优惠卷
			 	let resultData =  await this.$u.post("/plug_shop/shopuser/shopCoupon",{});
				this.couponList = resultData.shopCoupon;
				this.userCouponList = resultData.userShopCoupon;
			},
			async userGetCoupon(item,index){
				this.couponList[index].flag = true;
				//领取优惠卷
				let result = await this.$u.post("/plug_shop/shopuser/userGetShopCoupon",{cid:item.id,num:item.num});
				
			},
			makeCoupon(){
				this.$u.route({
							url:"/pages/category/category"
				})
			}
		}
	}
</script>

<style lang="scss">
	.mask{
		
		background: rgba(0,0,0,0);
		
		.mask-content{
			width: 100%;
			min-height: 30vh;
			max-height: 90vh;
			background: #f3f3f3;
			overflow-y:scroll;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.mask-content{
				transform: translateY(0);
			}
		}
	}
	
	/* 优惠券列表 */
	.coupon-item{
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;
		.con{
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;
			&:after{
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
		.left{
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}
		.time{
			font-size: 24upx;
			color: $font-color-light;
		}
		.right{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}
		.price{
			font-size: 44upx;
			color: $base-color;
			&:before{
				content: '￥';
				font-size: 34upx;
			}
		}
		.tips{
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}
		.circle{
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;
			&.r{
				left: auto;
				right: -6upx;
			}
		}
	}
</style>
