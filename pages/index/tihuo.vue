 <template>
 	<view>
 		<!-- 地址 -->
 		<navigator url="/pages/shop/address?source=1" class="address-section" v-if="showAddress">
 			<view class="order-content">
 				<text class="yticon icon-shouhuodizhi"></text>
 				<view class="cen" v-if="addressData">
 					<view class="top">
 						<text class="name">{{addressData.realName}}</text>
 						<text class="mobile">{{addressData.phone}}</text>
 					</view>
 					<text class="address">{{addressData.address}} {{addressData.detail}}</text>
 				</view>
 				<view class="cen" v-else>
 					<view class="top">
 						请输入收货地址
 					</view>
 					<text class="address"></text>
 				</view>
 				<text class="yticon icon-you"></text>
 			</view>

 			<image class="a-bg"
 				src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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">
 			</image>
 		</navigator>

 		<view class="goods-section">
 			<view class="g-header b-b">
 				<image class="logo" src="/static/images/jidan.png"></image>
 				<text class="name">鸡蛋提货</text>
 			</view>
 			<!-- 商品列表 -->
 			<view class="g-item">
 				<image src="/static/images/jidan.png"></image>
 				<view class="right ">
 					<text class="title clamp">土鸡蛋(一盒{{setting.tihuo_jidannum}}颗)</text>
 					<text class="spec">新鲜土鸡蛋</text>
 					<view class="price-box">
 						<text class="price">{{setting.tihuo_jidannum}}鸡蛋</text>
 						<text class="number">x {{buyNum}}盒</text>
 					</view>
 				</view>
 			</view>
 		</view>


 		<!-- 金额明细 -->
 		<view class="yt-list">
 			<view class="yt-list-cell b-b">
 				<text class="cell-tit clamp">提货盒数</text>
 				<u-number-box v-model="buyNum" :min="1" :max="100" @change="numberChange"></u-number-box>

 			</view>

 			<view class="yt-list-cell desc-cell">
 				<text class="cell-tit clamp">备注</text>
 				<input class="desc" type="text" v-model="desc" placeholder="请填写备注信息" placeholder-class="placeholder" />
 			</view>



 		</view>

 		<view class="goods-section">
 			<view class="g-header b-b">
 				<text class="name">请选择提货支付方式:</text>
 			</view>
 		</view>
 		<!-- 金额明细 -->
 		<view class="yt-list">
 			<view class="yt-list-cell b-b u-flex u-row-between">
 				<text class="cell-tit clamp">批发鸡蛋</text>
 				<view class="word u-flex">
 					<text class="cell-tip">当前可使用{{member.money3}}枚</text>
 				</view>
 				<view class="tick">
 					<u-checkbox v-model="pfCheckk" @change="checkboxGroupChange(1)"
 						active-color="#55DCB9"></u-checkbox>
 				</view>
 			</view>

 			<view class="yt-list-cell b-b u-flex u-row-between">
 				<text class="cell-tit clamp">零售鸡蛋</text>
 				<view class="word u-flex">
 					<text class="cell-tip">当前可使用{{member.money4}}枚</text>
 				</view>
 				<view class="tick">
 					<u-checkbox v-model="lsCheckk" @change="checkboxGroupChange(2)"
 						active-color="#55DCB9"></u-checkbox>
 				</view>
 			</view>

 		</view>

 		<!-- 底部 -->
 		<view class="footer">
 			<view class="price-content">
 				<text v-if="pfCheckk">实付 批发鸡蛋: </text>
 				<text v-else-if="lsCheckk">实付 零售鸡蛋: </text>
 				<text v-else>实付 ----: </text>
 				<text class="price-tip"></text>
 				<text class="price"> {{price.toFixed(0)}} 枚</text>
 			</view>
 			<text class="submit" @click="submit">提交订单</text>
 		</view>


 	</view>
 </template>

 <script>
 	export default {
 		data() {
 			return {
 				addressData: null,
 				price: 0,
 				showAddress: true,
 				desc: '',
 				pfCheckk: false,
 				lsCheckk: false,
 				setting: {},
 				buyNum: 1,
				member:{}
				


 			}
 		},
 		onShow() {
 			//每当页面加载，加载地址信息
 			if (typeof(this.addressData) == 'undefined') {
 				this.loadData();
 			}
 		},
 		onLoad(option) {

 			//商品数据
 			this.loadData();
 		},
 		methods: {

 			// 选中任一checkbox时，由checkbox-group触发
 			checkboxGroupChange(e) {
 				if (e == 1) {
 					this.pfCheckk = true;
 					this.lsCheckk = false;
 				} else {
 					this.pfCheckk = false;
 					this.lsCheckk = true;
 				}
 				this.jisuanPrice();
 			},
 			// 全选
 			checkedAll() {
 				this.list.map(val => {
 					val.checked = true;
 				})
 			},
 			async loadData() {
 				//查询默认地址
 				var address = await this.$u.post("/plug_shop/shopuser/getDefaultAddress");
 				if (address.addressData) {
 					this.addressData = address.addressData
 				}
 				//获取配置
 				var setting = await this.$u.post("/html/work_ddl/index/getDDLSetting");
 				this.setting = setting
 				if (!this.setting.tihuo_jidannum || this.setting.tihuo_jidannum <= 0) {
 					uni.$u.toast('页面出错');
 					setTimeout(function() {
 						uni.navigateBack();
 					}, 1000)
 					return
 				}
				
				var user = await this.$u.post("/login/getLoginUserinfo");
				this.member = user.userinfo.member

 			},

 			numberChange(data) {
 				this.jisuanPrice();
 			},
 			changePayType(type) {
 				this.payType = type;
 			},

 			jisuanPrice() {
 				if (this.pfCheckk || this.lsCheckk) {
 					this.price = parseInt(this.setting.tihuo_jidannum) * this.buyNum
 				}

 			},
 			async submit() {
 				if (this.addressData == null) {

 					this.$api.msg('请选择收货地址');
 					return;

 				}
 				uni.showLoading({
 					title: '提交订单中...'
 				})
				
				var res = await this.$u.post("/work_ddl/user/createDDLProduct",{buyNum:this.buyNum, types: this.pfCheckk?"批发鸡蛋":"零售鸡蛋",addressid:this.addressData.id});
				
 				// this.orderData.addressId = this.addressData.id;
 				// this.orderData.openMaxIntegral=this.checked;
 				// let result = null;

 				// if(this.buyType == 5){
 				// 	result =  await this.$u.post("/plug_edu/user/createProduct",{orderCreatemakeCoupon:JSON.stringify(this.orderData)});

 				// }else if(this.buyType == 4){
 				// 	result =  await this.$u.post("/plug_shop/shopuser/createUserVipProduct",{ShopOrderCreate:JSON.stringify(this.orderData)});

 				// }else if(this.buyType == 6){
 				// 	result =  await this.$u.post("/plug_shop/shopuser/createScoreProduct",{ShopOrderCreate:JSON.stringify(this.orderData)});

 				// }else{
 				// 	console.log(this.makeCoupons.id);
 				// 	result =  await this.$u.post("/plug_shop/shopuser/createProduct",{orderCreate:JSON.stringify(this.orderData), couponId:this.makeCoupons.id});
 				// }

 				// if(!result){
 				// 	return;
 				// }


 				setTimeout(function() {
 					uni.navigateBack();
 				}, 1500)

 			},
 			stopPrevent() {

 			},

 		}
 	}
 </script>

 <style lang="scss">
 	@font-face {
 		font-family: yticon;
 		font-weight: normal;
 		font-style: normal;
 		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
 	}

 	.yticon {
 		font-family: "yticon" !important;
 		font-size: 16px;
 		font-style: normal;
 		-webkit-font-smoothing: antialiased;
 		-moz-osx-font-smoothing: grayscale;
 	}

 	view,
 	scroll-view,
 	swiper,
 	swiper-item,
 	cover-view,
 	cover-image,
 	icon,
 	text,
 	rich-text,
 	progress,
 	button,
 	checkbox,
 	form,
 	input,
 	label,
 	radio,
 	slider,
 	switch,
 	textarea,
 	navigator,
 	audio,
 	camera,
 	image,
 	video {
 		box-sizing: border-box;
 	}

 	/* 骨架屏替代方案 */
 	.Skeleton {
 		background: #f3f3f3;
 		padding: 20upx 0;
 		border-radius: 8upx;
 	}

 	/* 图片载入替代方案 */
 	.image-wrapper {
 		font-size: 0;
 		background: #f3f3f3;
 		border-radius: 4px;

 		image {
 			width: 100%;
 			height: 100%;
 			transition: .6s;
 			opacity: 0;

 			&.loaded {
 				opacity: 1;
 			}
 		}
 	}

 	.clamp {
 		overflow: hidden;
 		text-overflow: ellipsis;
 		white-space: nowrap;
 		display: block;
 	}

 	.common-hover {
 		background: #f5f5f5;
 	}

 	/*边框*/
 	.b-b:after,
 	.b-t:after {
 		position: absolute;
 		z-index: 3;
 		left: 0;
 		right: 0;
 		height: 0;
 		content: '';
 		transform: scaleY(.5);
 		border-bottom: 1px solid $border-color-base;
 	}

 	.b-b:after {
 		bottom: 0;
 	}

 	.b-t:after {
 		top: 0;
 	}

 	/* button样式改写 */
 	uni-button,
 	button {
 		height: 80upx;
 		line-height: 80upx;
 		font-size: $font-lg + 2upx;
 		font-weight: normal;

 		&.no-border:before,
 		&.no-border:after {
 			border: 0;
 		}
 	}

 	uni-button[type=default],
 	button[type=default] {
 		color: $font-color-dark;
 	}

 	/* input 样式 */
 	.input-placeholder {
 		color: #999999;
 	}

 	.placeholder {
 		color: #999999;
 	}

 	page {
 		background: $page-color-base;
 		padding-bottom: 100upx;
 	}

 	.address-section {
 		padding: 30upx 0;
 		background: #fff;
 		position: relative;

 		.order-content {
 			display: flex;
 			align-items: center;
 		}

 		.icon-shouhuodizhi {
 			flex-shrink: 0;
 			display: flex;
 			align-items: center;
 			justify-content: center;
 			width: 90upx;
 			color: #888;
 			font-size: 44upx;
 		}

 		.cen {
 			display: flex;
 			flex-direction: column;
 			flex: 1;
 			font-size: 28upx;
 			color: $font-color-dark;
 		}

 		.name {
 			font-size: 34upx;
 			margin-right: 24upx;
 		}

 		.address {
 			margin-top: 16upx;
 			margin-right: 20upx;
 			color: $font-color-light;
 		}

 		.icon-you {
 			font-size: 32upx;
 			color: $font-color-light;
 			margin-right: 30upx;
 		}

 		.a-bg {
 			position: absolute;
 			left: 0;
 			bottom: 0;
 			display: block;
 			width: 100%;
 			height: 5upx;
 		}
 	}

 	.goods-section {
 		margin-top: 16upx;
 		background: #fff;
 		padding-bottom: 1px;

 		.g-header {
 			display: flex;
 			align-items: center;
 			height: 84upx;
 			padding: 0 30upx;
 			position: relative;
 		}

 		.logo {
 			display: block;
 			width: 50upx;
 			height: 50upx;
 			border-radius: 100px;
 		}

 		.name {
 			font-size: 30upx;
 			color: $font-color-base;
 			margin-left: 24upx;
 		}

 		.g-item {
 			display: flex;
 			margin: 20upx 30upx;

 			image {
 				flex-shrink: 0;
 				display: block;
 				width: 140upx;
 				height: 140upx;
 				border-radius: 4upx;
 			}

 			.right {
 				flex: 1;
 				padding-left: 24upx;
 				overflow: hidden;
 			}

 			.title {
 				font-size: 30upx;
 				color: $font-color-dark;
 			}

 			.spec {
 				font-size: 26upx;
 				color: $font-color-light;
 			}

 			.price-box {
 				display: flex;
 				align-items: center;
 				font-size: 32upx;
 				color: $font-color-dark;
 				padding-top: 10upx;

 				.price {
 					margin-bottom: 4upx;

 				}

 				.number {
 					font-size: 26upx;
 					color: $font-color-base;
 					margin-left: 20upx;
 				}
 			}

 			.step-box {
 				position: relative;
 			}
 		}
 	}

 	.yt-list {
 		margin-top: 16upx;
 		background: #fff;
 	}

 	.yt-list-cell {
 		display: flex;
 		align-items: center;
 		padding: 10upx 30upx 10upx 40upx;
 		line-height: 70upx;
 		position: relative;

 		&.cell-hover {
 			background: #fafafa;
 		}

 		&.b-b:after {
 			left: 30upx;
 		}

 		.cell-icon {
 			height: 32upx;
 			width: 32upx;
 			font-size: 22upx;
 			color: #fff;
 			text-align: center;
 			line-height: 32upx;
 			background: #f85e52;
 			border-radius: 4upx;
 			margin-right: 12upx;

 			&.hb {
 				background: #ffaa0e;
 			}

 			&.lpk {
 				background: #3ab54a;
 			}

 		}

 		.cell-more {
 			align-self: center;
 			font-size: 24upx;
 			color: $font-color-light;
 			margin-left: 8upx;
 			margin-right: -10upx;
 		}

 		.cell-tit {
 			flex: 1;
 			font-size: 26upx;
 			color: $font-color-light;
 			margin-right: 10upx;
 		}

 		.cell-tip {
 			font-size: 26upx;
 			color: $font-color-dark;

 			&.disabled {
 				color: $font-color-light;
 			}

 			&.active {
 				color: $base-color;
 			}

 			&.red {
 				color: red;
 			}
 		}

 		&.desc-cell {
 			.cell-tit {
 				max-width: 90upx;
 			}
 		}

 		.desc {
 			flex: 1;
 			font-size: $font-base;
 			color: $font-color-dark;
 		}
 	}

 	/* 支付列表 */
 	.pay-list {
 		padding-left: 40upx;
 		margin-top: 16upx;
 		background: #fff;

 		.pay-item {
 			display: flex;
 			align-items: center;
 			padding-right: 20upx;
 			line-height: 1;
 			height: 110upx;
 			position: relative;
 		}

 		.icon-weixinzhifu {
 			width: 80upx;
 			font-size: 40upx;
 			color: #6BCC03;
 		}

 		.icon-alipay {
 			width: 80upx;
 			font-size: 40upx;
 			color: #06B4FD;
 		}

 		.icon-xuanzhong2 {
 			display: flex;
 			align-items: center;
 			justify-content: center;
 			width: 60upx;
 			height: 60upx;
 			font-size: 40upx;
 			color: $base-color;
 		}

 		.tit {
 			font-size: 32upx;
 			color: $font-color-dark;
 			flex: 1;
 		}
 	}

 	.footer {
 		position: fixed;
 		left: 0;
 		bottom: 0;
 		z-index: 995;
 		display: flex;
 		align-items: center;
 		width: 100%;
 		height: 90upx;
 		justify-content: space-between;
 		font-size: 30upx;
 		background-color: #fff;
 		z-index: 998;
 		color: $font-color-base;
 		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

 		.price-content {
 			padding-left: 30upx;
 		}

 		.price-tip {
 			color: red;
 			margin-left: 8upx;
 		}

 		.price {
 			font-size: 36upx;
 			color: red;
 		}

 		.submit {
 			display: flex;
 			align-items: center;
 			justify-content: center;
 			width: 280upx;
 			height: 100%;
 			color: #fff;
 			font-size: 32upx;
 			background-color: #50d0af;
 		}
 	}

 	/* 优惠券面板 */
 	.mask {
 		display: flex;
 		align-items: flex-end;
 		position: fixed;
 		left: 0;
 		top: var(--window-top);
 		bottom: 0;
 		width: 100%;
 		background: rgba(0, 0, 0, 0);
 		z-index: 9995;
 		transition: .3s;

 		.mask-content {
 			width: 100%;
 			min-height: 30vh;
 			max-height: 70vh;
 			background: #f3f3f3;
 			transform: translateY(100%);
 			transition: .3s;
 			overflow-y: scroll;
 		}

 		&.none {
 			display: none;
 		}

 		&.show {
 			background: rgba(0, 0, 0, .4);

 			.mask-content {
 				transform: translateY(0);
 			}
 		}
 	}

 	/* 优惠券列表 */
 	.coupon-item {
 		display: flex;
 		flex-direction: column;
 		margin: 20upx 24upx;
 		background: #fff;

 		.con {
 			display: flex;
 			align-items: center;
 			position: relative;
 			height: 120upx;
 			padding: 0 30upx;

 			&:after {
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

 		.left {
 			display: flex;
 			flex-direction: column;
 			justify-content: center;
 			flex: 1;
 			overflow: hidden;
 			height: 100upx;
 		}

 		.title {
 			font-size: 32upx;
 			color: $font-color-dark;
 			margin-bottom: 10upx;
 		}

 		.time {
 			font-size: 24upx;
 			color: $font-color-light;
 		}

 		.right {
 			display: flex;
 			flex-direction: column;
 			justify-content: center;
 			align-items: center;
 			font-size: 26upx;
 			color: $font-color-base;
 			height: 100upx;
 		}

 		.price {
 			font-size: 44upx;
 			color: $base-color;

 			&:before {
 				content: '￥';
 				font-size: 34upx;
 			}
 		}

 		.tips {
 			font-size: 24upx;
 			color: $font-color-light;
 			line-height: 60upx;
 			padding-left: 30upx;
 		}

 		.circle {
 			position: absolute;
 			left: -6upx;
 			bottom: -10upx;
 			z-index: 10;
 			width: 20upx;
 			height: 20upx;
 			background: #f3f3f3;
 			border-radius: 100px;

 			&.r {
 				left: auto;
 				right: -6upx;
 			}
 		}
 	}

 	.tick {
 		margin-right: -40rpx;
 	}

 	.word {
 		margin-right: 20rpx;
 	}

 	.tip {
 		margin-top: 30rpx;
 	}
 </style>