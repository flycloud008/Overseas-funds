<template>
	<view class="container">
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->
		<view class="mp-search-box">
			<input class="ser-input" type="text" value="输入关键字搜索" disabled />
		</view>
		<!-- #endif -->

		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view>
			<swiper class="carousel" circular @change="swiperChange" interval=2000 current=swiperCurrent+1
				:autoplay="true">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item"
					@click="navTo(item.href)">
					<image :src="item.img" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>
		<view class="cate-section">
			
			<view class="cate-item" @click="zyjf(2)" v-if="isService=='1'">
				<image src="/static/template/xiaofei.png" ></image>
				<text>赠送消费金</text>
			</view>
			<view class="cate-item" @click="navTo('/pages/index/gxbOrder')">
				<image src="/static/template/lvse.png" ></image>
				<text>存储订单</text>
			</view>
			<view class="cate-item"  @click="navTo('/pages/shop/order?state=0')">
				<image src="/static/template/qiquan.png"></image>
				<text>商品订单</text>
			</view>
			<view class="cate-item"  >
				<image src="/static/template/tuiguang.png"  @click="navTo('/pages/user/userShare')" ></image>
				<text>推广分享</text>
			</view>
		
		</view>
		
	
		<view class="ad-1" v-if="data.indexImg1">
			<image :src="data.indexImg1" @click="navToView(data.indexImg1url)" mode="scaleToFill"></image>
		</view>
		<view class="ad-1" v-if="data.indexImg2">
			<image :src="data.indexImg2" @click="navToView(data.indexImg2url)" mode="scaleToFill"></image>
		</view>
		<view class="ad-1" v-if="data.indexImg3">
			<image :src="data.indexImg3" @click="navToView(data.indexImg3url)" mode="scaleToFill"></image>
		</view>

		<!-- 秒杀楼层 -->
		<!-- <view class="seckill-section m-t">
			<view class="s-header">
				<image class="s-img" src="/static/temp/secskill-img.jpg" mode="widthFix"></image>
				<text class="tip">8点场</text>
				<text class="hour timer">07</text>
				<text class="minute timer">13</text>
				<text class="second timer">55</text>
				<text class="yticon icon-you"></text>
			</view>
			<scroll-view class="floor-list" scroll-x>
				<view class="scoll-wrapper">
					<view 
						v-for="(item, index) in goodsList" :key="index"
						class="floor-item"
						@click="navToDetailPage(item)"
					>
						<image :src="item.image" mode="aspectFill"></image>
						<text class="title clamp">{{item.title}}</text>
						<text class="price">￥{{item.price}}</text>
					</view>
				</view>
			</scroll-view>
		</view> -->

		<!-- 团购楼层 -->
		<!-- <view class="f-header m-t">
			<image src="/static/temp/h1.png"></image>
			<view class="tit-box">
				<text class="tit">精品团购</text>
				<text class="tit2">Boutique Group Buying</text>
			</view>
			<text class="yticon icon-you"></text>
		</view>
		<view class="group-section">
			<swiper class="g-swiper" :duration="500">
				<swiper-item
					class="g-swiper-item"
					v-for="(item, index) in goodsList" :key="index"
					v-if="index%2 === 0"
					@click="navToDetailPage(item)"
				>
					<view class="g-item left">
						<image :src="item.image" mode="aspectFill"></image>
						<view class="t-box">
							<text class="title clamp">{{item.title}}</text>
							<view class="price-box">
								<text class="price">￥{{item.price}}</text> 
								<text class="m-price">￥188</text> 
							</view>
							
							<view class="pro-box">
							  	<view class="progress-box">
							  		<progress percent="72" activeColor="#fa436a" active stroke-width="6" />
							  	</view>
								<text>6人成团</text>
							</view>
						</view>
						            
					</view>
					<view class="g-item right">
						<image :src="goodsList[index+1].image" mode="aspectFill"></image>
						<view class="t-box">
							<text class="title clamp">{{goodsList[index+1].title}}</text>
							<view class="price-box">
								<text class="price">￥{{goodsList[index+1].price}}</text> 
								<text class="m-price">￥188</text> 
							</view>
							<view class="pro-box">
							  	<view class="progress-box">
							  		<progress percent="72" activeColor="#fa436a" active stroke-width="6" />
							  	</view>
								<text>10人成团</text>
							</view>
						</view>
					</view>
				</swiper-item>

			</swiper>
		</view> -->


		<view class="f-header m-t">
			<image src="/static/temp/h1.png"></image>
			<view class="tit-box">
				<text class="tit">会员资格兑换</text>
				<text class="tit2">Competitive Products For You</text>
			</view>
		 
		</view>
		<view class="hot-floor">
			<view class="floor-img-box">
				<image class="floor-img" :src="data.jingpinimg" mode="scaleToFill"></image>
			</view>
			<scroll-view class="floor-list" scroll-x>
				<view class="scoll-wrapper">
					<view v-for="(item, index) in ddlItemList" :key="index" class="floor-item"
						@click="buyJXS(item)">
						<image :src="item.image" mode="aspectFill"></image>
						<text class="title clamp" style="text-align: center;">{{item.name}}</text>
						<text class="price" >{{item.money}}</text>
					</view>
					
				</view>
			</scroll-view>
		</view>

		<view class="f-header m-t">
			<image src="/static/temp/h1.png"></image>
			<view class="tit-box">
				<text class="tit">新品专区</text>
				<text class="tit2">Competitive Products For You</text>
			</view>
		</view>
		<view class="hot-floor">
			<view class="floor-img-box">
				<image class="floor-img" :src="data.xinpinimg" mode="scaleToFill"></image>
			</view>
			<scroll-view class="floor-list" scroll-x>
				<view class="scoll-wrapper">
					<view v-for="(item, index) in data.xpProductList" :key="index" class="floor-item"
						@click="navToDetailPage(item)">
						<image :src="vuex_baseImgUrl + item.image" mode="aspectFill"></image>
						<text class="title clamp">{{item.name}}</text>
						<text class="price">￥{{item.price}}</text>
						<text class="price-old">￥{{item.otPrice}}</text>
					</view>
					
				</view>
			</scroll-view>
		</view>

		<!-- 分类推荐楼层 -->
		<view class="f-header m-t">
			<image src="/static/temp/h1.png"></image>
			<view class="tit-box">
				<text class="tit">精品专区</text>
				<text class="tit2">Competitive Products For You</text>
			</view>
		</view>
		<view class="hot-floor">
			<view class="floor-img-box">
				<image class="floor-img" :src="data.youhuiimg" mode="scaleToFill"></image>
			</view>
			<scroll-view class="floor-list" scroll-x>
				<view class="scoll-wrapper">
					<view v-for="(item, index) in data.jpProductList" :key="index" class="floor-item"
						@click="navToDetailPage(item)">
						<image :src="vuex_baseImgUrl + item.image" mode="aspectFill"></image>
						<text class="title clamp">{{item.name}}</text>
						<text class="price">￥{{item.price}}</text>
						<text class="price-old">￥{{item.otPrice}}</text>
					</view>
					
				</view>
			</scroll-view>
		</view>


		<view class="ad-1" v-if="data.indexImg3">
			<image :src="data.indexImg3" @click="navToView(data.indexImg3url)" mode="scaleToFill"></image>
		</view>
		
		<view class="guess-section" style="padding-top: 20px;">
				<view 
					v-for="(item, index) in pageData.data" :key="index"
					class="guess-item"
					@click="navToDetailPage(item)"
				>
					<view class="image-wrapper">
						<image :src="vuex_baseImgUrl+item.image" mode="aspectFit"></image>
					</view>
					<text class="title clamp">{{item.name}}</text>
					<view style="flex-direction: row;">
						<text class="price">￥{{item.price}}</text>
						<text class="price-old" style="margin-left: 10px;">￥{{item.otPrice}}</text>
					</view>
					
				</view>
				
		</view>
		<uni-load-more :status="pageData.loadType"></uni-load-more>

		
		<u-modal v-model="show" content="测试版本, 当前为测试版本."  :show-cancel-button="true"></u-modal>

	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	 import {
	        toScanCode
	    } from '@/pages/component/scan'

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				member: [],
				discount: [],
				boutique: [],
				specialty: [],
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				carouselList: [],
				goodsList: [],
				data: {},
				pageData: {
					pageNo: 1,
					pageSize: 10,
					loadType: "more",
					data: []
				},
				ddlItemList:[],
				isService:'0',
				show:true,
			};
		},

		onLoad() {
			this.loadData();
			this.loadPage('/html/plug_shop/shopindex/indextj', {}, 1);
			
		
		},

		methods: {

			handleOpenTaobao() {
				// 淘宝的商品链接，换成需要访问的地址
				let url =
					"https://www.taobao.com/?spm=a231o.13503973.1581860521.1.140568edU8HkGP&pid=mm_130402922_1111150093_109790500145&union_lens=recoveryid%3A201_11.1.81.73_2187904_1620196363615%3Bprepvid%3A201_11.1.81.73_2187904_1620196363615?spm=a231o.13503973.1581860521.1.140568edU8HkGP&pid=mm_130402922_1111150093_109790500145&union_lens=recoveryid%3A201_11.1.81.73_2187904_1620196363615%3Bprepvid%3A201_11.1.81.73_2187904_1620196363615";
				let openUrl = url;
				// // 因为 url 一般是从其它地方获取的，所以这里要将 http 和 https 删去
				// // 也可以直接输入 https:// 之后的内容，则不需要此步判断，直接调用 plus.runtime.openURL
				// if (url.substr(0, 5) === 'https') {
				// openUrl = `taobao://${url.substr(8)}`;
				// 	}else if (url.substr(0, 4) === 'http') {
				// 			openUrl = `taobao://${url.substr(7)}`;
				// 	}

				plus.runtime.openURL(openUrl, function(res) {
					uni.showModal({
						content: '本机未检测到对应客户端，是否打开浏览器访问页面？',
						success: function(res) {
							if (res.confirm) {
								plus.runtime.openURL(url);
							}
						}
					});
				});

			},
			/**
			 * 打开京东
			 */
			handleOpenJingdong() {
				
			},

			handleOpenWeiPinHui() {
				
			},
			handleOpenTianMao() {
			
			},
			handleOpenPinDuoDuo() {
			
			},
			onPageScroll(e) {
				//兼容iOS端下拉时顶部漂移
				if (e.scrollTop >= 0) {
					this.headerPosition = "fixed";
				} else {
					this.headerPosition = "absolute";
				}
			},
			//下拉刷新
			onPullDownRefresh() {
				this.loadData();
				this.loadPage('/html/plug_shop/shopindex/indextj', {}, 1);
			},
			//加载更多
			onReachBottom() {
				this.loadPage('/html/plug_shop/shopindex/indextj', {});
			},
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			async loadData() {

				let carouselList = await this.$u.post('/html/app/banner', {
					type: 1
				});

				let data = await this.$u.post('/html/plug_shop/shopindex/index', {});
				//加载商城配置
				this.$u.post('/html/plug_shop/shopindex/indexOption', {

				}).then(res => {
					Object.assign(this.vuex_config, res);
					this.$u.vuex('vuex_config', this.vuex_config);

				})

				this.data = data;
				
				//加载经销商产品
					let ddlShop = await this.$u.post('/html/work_ddl/index/getDDLShoplevel', {});
					this.ddlItemList = ddlShop.data

				if (carouselList.length > 0) {
					this.titleNViewBackground = carouselList[0].background;
					this.swiperLength = carouselList.length;
					this.carouselList = carouselList;

				}
				
				let userinfo = await this.$u.post("/login/getLoginUserinfo");
				this.isService = userinfo.userinfo.member.isService;
				
			
				
				// let member = await this.$u.post("/html/plug_shop/shopindex/findProductByCatge",{cid:"1387342446096162816",pageSize:10,pageNo:1});
				// this.member= member.data.list
				// //折扣
				// let discount = await this.$u.post("/html/plug_shop/shopindex/findProductByCatge",{cid:"1387342536810569728",pageSize:10,pageNo:1});
				// this.discount= discount.data.list
				// //特产
				// let specialty = await this.$u.post("/html/plug_shop/shopindex/findProductByCatge",{cid:"1387342571568766976",pageSize:10,pageNo:1});
				// this.specialty= specialty.data.list
				// //精品
				// let boutique = await this.$u.post("/html/plug_shop/shopindex/findProductByCatge",{cid:"1387342500139769856",pageSize:10,pageNo:1});
				// this.boutique= boutique.data.list
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.carouselList[index].background;
			},

			//详情页
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.id;
				uni.navigateTo({
					url: `/pages/shop/product?id=${id}`
				})
			},
			goTolist(id) {
				uni.navigateTo({
					url: `/pages/shop/list?cid=${id}`
				})
			},
			saoma(){
				// #ifdef process.env.UNI_PLATFORM === 'h5'
				  uni.$u.toast('请下载app才能使用此功能');
				// #endif  
				
				// #ifndef process.env.UNI_PLATFORM === 'h5'
				  toScanCode({
					 onlyFromCamera: false // 只允许通过相机扫码
				 }).then(res => {
					var msg = 	res.split("_");
					var type= msg[1]; 
					var loginCode = msg[2];
					
					if(type=="jd"){
						uni.navigateTo({
							url: `/pages/index/zs_jidan?loginCode=${loginCode}`
						}) 
						
					}else if(type=="jf"){
						uni.navigateTo({
							url: `/pages/index/zs_jifen?loginCode=${loginCode}`
						})
						
					}else if(type=="sj"){
						uni.navigateTo({
							url: `/pages/index/zs_jifen?loginCode=${loginCode}`
						})
					}
				 })
				// #endif 
				
			},
			fukuanma(){
				uni.navigateTo({
					url: `/pages/index/qrcode?types=jd`
				})
			},
			shoukuanma(){
				uni.navigateTo({
					url: `/pages/index/qrcode?types=jf`
				})
			},
			async shangjiama(){
				let ddlShop = await this.$u.post('/work_ddl/user/userShoperAuthenStatus', {});
				if(!ddlShop.data){
					  uni.$u.toast('请先申请成为商家');
					  return 
				}
				
				if(ddlShop.data.extype == 0){
					  uni.$u.toast('请先申请成为商家');
					  return 
				}
				
				 
				uni.navigateTo({
					url: `/pages/index/qrcode?types=sj`
				})
			},
			//赠予鸡蛋
			zyjd(){
				uni.navigateTo({
					url: `/pages/index/zs_jidan`
				})
			},
			//赠予积分
			zyjf(type){
				uni.navigateTo({
					url: `/pages/index/zs_jifen?type=`+type
				})
			},
			//积分兑换
			jfdh(){ 
				uni.navigateTo({
					url: `/pages/index/jfdh`
				})
			},
			jdth(){
				uni.navigateTo({
					url: `/pages/index/tihuo`
				})
			},
			//购买经销商
			buyJXS(item){
				if(!this.vuex_hasLogin){
					uni.$u.route('/pages/login/login');
					return ;
				}
			
				uni.navigateTo({
						url: `/pages/index/buyJXS?id=`+item.id
					})
			},
				
			
		},
		// #ifndef MP
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			uni.navigateTo({
				url: '/pages/shop/searchdetail'
			})
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;

			// #ifdef APP-PLUS
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.hideTitleNViewButtonRedDot({
				index
			});
			// #endif
			uni.navigateTo({
				url: '/pages/public/notice/notice'
			})
		},

		// #endif
		
		
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


	/* #ifdef MP */
	.mp-search-box {
		position: absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;

		.ser-input {
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color: $font-color-base;
			border-radius: 20px;
			background: rgba(255, 255, 255, .6);
		}
	}

	page {
		.cate-section {
			position: relative;
			z-index: 5;
			border-radius: 16upx 16upx 0 0;
			margin-top: -20upx;
		}

		.carousel-section {
			padding: 0;

			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}

			.carousel {
				.carousel-item {
					padding: 0;
				}
			}

			.swiper-dots {
				left: 45upx;
				bottom: 40upx;
			}
		}
	}

	/* #endif */


	page {
		background: #f5f5f5;
	}

	.m-t {
		margin-top: 16upx;
	}

	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: .4s;
		}
	}

	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;

		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}

		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			
			width: 66upx;
			height: 66upx;
			margin-bottom: 14upx;
			border-radius: 10%;
			opacity: .7;
			box-shadow: 4upx 4upx 40upx rgba(147, 126, 126, 0.2);
		}
	}

	.ad-1 {
		width: 100%;
		height: 210upx;
		padding: 10upx 0;
		background: #fff;

		image {
			width: 100%;
			height: 100%;
		}
	}

	/* 秒杀专区 */
	.seckill-section {
		padding: 4upx 30upx 24upx;
		background: #fff;

		.s-header {
			display: flex;
			align-items: center;
			height: 92upx;
			line-height: 1;

			.s-img {
				width: 140upx;
				height: 30upx;
			}

			.tip {
				font-size: $font-base;
				color: $font-color-light;
				margin: 0 20upx 0 40upx;
			}

			.timer {
				display: inline-block;
				width: 40upx;
				height: 36upx;
				text-align: center;
				line-height: 36upx;
				margin-right: 14upx;
				font-size: $font-sm+2upx;
				color: #fff;
				border-radius: 2px;
				background: rgba(0, 0, 0, .8);
			}

			.icon-you {
				font-size: $font-lg;
				color: $font-color-light;
				flex: 1;
				text-align: right;
			}
		}

		.floor-list {
			white-space: nowrap;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		.floor-item {
			width: 150upx;
			margin-right: 20upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			line-height: 1.8;

			image {
				width: 150upx;
				height: 150upx;
				border-radius: 6upx;
			}

			.price {
				color: $uni-color-primary;
			}
		}
	}

	.f-header {
		display: flex;
		align-items: center;
		height: 140upx;
		padding: 6upx 30upx 8upx;
		background: #fff;

		image {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}

		.tit-box {
			flex: 1;
			display: flex;
			flex-direction: column;
		}

		.tit {
			font-size: $font-lg +2upx;
			color: #font-color-dark;
			line-height: 1.3;
		}

		.tit2 {
			font-size: $font-sm;
			color: $font-color-light;
		}

		.icon-you {
			font-size: $font-lg +2upx;
			color: $font-color-light;
		}
	}

	/* 团购楼层 */
	.group-section {
		background: #fff;

		.g-swiper {
			height: 650upx;
			padding-bottom: 30upx;
		}

		.g-swiper-item {
			width: 100%;
			padding: 0 30upx;
			display: flex;
		}

		image {
			width: 100%;
			height: 460upx;
			border-radius: 4px;
		}

		.g-item {
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}

		.left {
			flex: 1.2;
			margin-right: 24upx;

			.t-box {
				padding-top: 20upx;
			}
		}

		.right {
			flex: 0.8;
			flex-direction: column-reverse;

			.t-box {
				padding-bottom: 20upx;
			}
		}

		.t-box {
			height: 160upx;
			font-size: $font-base+2upx;
			color: $font-color-dark;
			line-height: 1.6;
		}

		.price {
			color: $uni-color-primary;
		}

		.m-price {
			font-size: $font-sm+2upx;
			text-decoration: line-through;
			color: $font-color-light;
			margin-left: 8upx;
		}

		.pro-box {
			display: flex;
			align-items: center;
			margin-top: 10upx;
			font-size: $font-sm;
			color: $font-base;
			padding-right: 10upx;
		}

		.progress-box {
			flex: 1;
			border-radius: 10px;
			overflow: hidden;
			margin-right: 8upx;
		}
	}

	/* 分类推荐楼层 */
	.hot-floor {
		width: 100%;
		overflow: hidden;
		margin-bottom: 20upx;

		.floor-img-box {
			width: 100%;
			height: 320upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(rgba(255, 255, 255, .06) 30%, #f8f8f8);
			}
		}

		.floor-img {
			width: 100%;
			height: 100%;
		}

		.floor-list {
			white-space: nowrap;
			padding: 20upx;
			padding-right: 50upx;
			border-radius: 6upx;
			margin-top: -140upx;
			margin-left: 30upx;
			background: #fff;
			box-shadow: 1px 1px 5px rgba(0, 0, 0, .2);
			position: relative;
			z-index: 1;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		.floor-item {
			width: 180upx;
			margin-right: 20upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			line-height: 1.8;

			image {
				width: 180upx;
				height: 180upx;
				border-radius: 6upx;
			}

			.price {
				color: $uni-color-primary;
			}
		}

		.more {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			flex-shrink: 0;
			width: 180upx;
			height: 180upx;
			border-radius: 6upx;
			background: #f3f3f3;
			font-size: $font-base;
			color: $font-color-light;

			text:first-child {
				margin-bottom: 4upx;
			}
		}
	}

	/* 猜你喜欢 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.guess-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}

	}

	.price-old {
		font-size: 12px;
		color: $u-type-info-disabled;
		line-height: 1;
		margin-left: 5px;
		text-decoration: line-through
	}
</style>