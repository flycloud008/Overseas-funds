<template>  
    <view class="container">  
		
		<view class="user-section">
			<image class="bg" src="/static/user-bg.jpg"></image>
			<view class="user-info-box">
				<view class="portrait-box">
					<avatar
						selWidth="250px" selHeight="250px"  ref='avatar' fileType='png'
						:avatarSrc="url" @upload="myUpload" quality="1" inner=true @click="updateAvatr"
						avatarStyle="width: 130upx; height: 130upx;border:5upx solid #fff;border-radius: 50%;">
					</avatar>
					<!-- <image class="portrait" :src=" '../../static/missing-face.png'"></image> -->
				</view>
				<view class="info-box">
					<text class="username" @click="toLogin()" >{{vuex_userInfo.loginCode || '点击登录'}}</text>
				</view>
			</view>
			<view class="vip-card-box">
				<image class="card-bg" src="/static/vip-card-bg.png" mode=""></image>
		<!-- 		<view class="b-btn" >
					立即开通
				</view> -->
				<view class="tit">
					<text class="yticon icon-iLinkapp-"></text>
					{{userLevel.name}} 
				</view>
				<text class="e-m">生源健康-存储生命</text>
				<text class="e-b">升级资格，享受更多福利</text>
			</view>
		</view>
		
		<view 
			class="cover-container"
			:style="[{
				transform: coverTransform,
				transition: coverTransition
			}]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
			<image class="arc" src="/static/arc.png"></image>
			
			<view class="tj-sction" >
				<view class="tj-item"  @click="navTo('/pages/user/accountList',{title:'消费金',moneyType:1,changeType:JSON.stringify([])})">
					<text class="num">{{vuex_userInfo.member.balance}}</text>
					<text>消费金</text>
				</view>
				<view class="tj-item">
					<!-- <text class="num">0</text>
					<text>优惠券</text> -->
				</view>
				<view class="tj-item"  @click="navTo('/pages/user/accountList',{title:'股权积分',moneyType:4,changeType:JSON.stringify([])})">
					<text class="num">{{vuex_userInfo.member.money4||0}}</text>
					<text>股权积分</text>
				</view>
			</view>
		
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/shop/order?state=0')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-shouye"></text>
					<text>全部订单</text>
				</view>
				<view class="order-item" @click="navTo('/pages/shop/order?state=1')"  hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-daifukuan"></text>
					<text>待付款</text>
				</view>
				<view class="order-item" @click="navTo('/pages/shop/order?state=2')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-yishouhuo"></text>
					<text>待收货</text>
				</view>
				<view class="order-item" @click="navTo('/pages/shop/order?state=4')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-shouhoutuikuan"></text>
					<text>退款/售后</text>
				</view>
			</view>
			<!-- 浏览历史 -->
			<view class="history-section icon">
				
				<list-cell icon="icon-iconfontweixin" iconColor="#e07472" title="我的钱包" tips="查看您的钱包和团队"  @eventClick="navTo('/pages/user/wallet')"></list-cell>
				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="地址管理" @eventClick="navTo('/pages/shop/address')"></list-cell>
				<list-cell icon="icon-share" iconColor="#9789f7" title="分享" tips="邀请好友赢10万大礼" @eventClick="fenxiang"></list-cell>
				
				<list-cell v-if="isService=='1'" icon="icon-fenlei" iconColor="#ff7da4" title="赠送消费金" @eventClick="zyjf(2)"></list-cell>
				
				<list-cell icon="icon-shoucang_xuanzhongzhuangtai" iconColor="#54b4ef" title="我的收藏" @eventClick="navTo('/pages/user/collection')"></list-cell>
				<list-cell icon="icon-shezhi1" iconColor="#e07472" title="设置" border="" @eventClick="navTo('/pages/user/set')"></list-cell>
			</view>
		</view>
			
		
    </view>  
</template>  
<script>  
	import listCell from '@/components/mix-list-cell';
	import avatar from "../../components/yq-avatar/yq-avatar.vue";
	let startY = 0, moveY = 0, pageAtTop = true;
    export default {
		components: {
			listCell,
			avatar,
		},
		data(){
			return {
				userLevel:{},
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				url:"../../static/missing-face.png",
				memberType:{},
				isService:"0",
			}
		},
		onLoad(){
			
		},
		async onShow(){
				let userinfo = await this.$u.post("/login/getLoginUserinfo");
				this.vuex_updateUser(userinfo);	
				this.userLevel = userinfo.userLevel;
				this.memberType = userinfo.memberType;
				this.isService = userinfo.userinfo.member.isService;
				if(userinfo.userinfo.avatar){
					this.url = this.vuex_baseImgUrl+userinfo.userinfo.avatar;
				}
				
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/user/set');
			}else if(index === 1){
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
			}
		},
		// #endif
        methods: {

			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e){
				if(pageAtTop === false){
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e){
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if(moveDistance < 0){
					this.moving = false;
					return;
				}
				this.moving = true;
				if(moveDistance >= 80 && moveDistance < 100){
					moveDistance = 80;
				}
		
				if(moveDistance > 0 && moveDistance <= 80){
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend(){
				if(this.moving === false){
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			},
			toLogin(){
				
				if(!this.vuex_hasLogin){
					uni.$u.route('/pages/login/login');
				}
			},
			updateAvatr() {
				let avatar = this.$refs.avatar;
				avatar.fChooseImg(1, {selWidth: "480upx", selHeight: "480upx", expWidth: "480px", expHeight: "480upx", inner:false}, {data: 'xxx'});
			},
			async myUpload(rsp) {
				let that = this;
				if(!this.vuex_hasLogin){
					url = '/pages/login/login';
					uni.$u.route(url,data);
				}
				
				this.url = rsp.path;
				uni.showLoading({
					title:"头像上传中"
				})
				this.uploadFile(this.url,function(images){
					console.log(images);
					that.$u.post("/user/updateUserAvatar",{avatarUrl:images[0]});
					uni.hideLoading();
				});
				
			},
			fenxiang(){
				this.navTo('/pages/user/userShare')
			},
		
			zyjf(type){
				uni.navigateTo({
					url: `/pages/index/zs_jifen?type=`+type
				})
			},
        }  
    }  
</script>  
<style lang='scss'>
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
	
	
	%flex-center {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	}
	%section {
	  display:flex;
	  justify-content: space-around;
	  align-content: center;
	  background: #fff;
	  border-radius: 10upx;
	}

	.user-section{
		height: 520upx;
		padding: 100upx 30upx 0;
		position:relative;
		.bg{
			position:absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);
			opacity: .7;
		}
	}
	.user-info-box{
		height: 180upx;
		display:flex;
		align-items:center;
		position:relative;
		z-index: 1;
		.portrait{
			width: 130upx;
			height: 130upx;
			border:5upx solid #fff;
			border-radius: 50%;
		}
		.username{
			font-size: $font-lg + 6upx;
			color: $font-color-dark;
			margin-left: 20upx;
		}
	}

	.vip-card-box{
		display:flex;
		flex-direction: column;
		color: #f7d680;
		height: 240upx;
		background: linear-gradient(to left, rgba(0,0,0,.7), rgba(0,0,0,.8));
		border-radius: 16upx 16upx 0 0;
		overflow: hidden;
		position: relative;
		padding: 20upx 24upx;
		.card-bg{
			position:absolute;
			top: 20upx;
			right: 0;
			width: 380upx;
			height: 260upx;
		}
		.b-btn{
			position: absolute;
			right: 20upx;
			top: 16upx;
			width: 132upx;
			height: 40upx;
			text-align: center;
			line-height: 40upx;
			font-size: 22upx;
			color: #36343c;
			border-radius: 20px;
			background: linear-gradient(to left, #f9e6af, #ffd465);
			z-index: 1;
		}
		.tit{
			font-size: $font-base+2upx;
			color: #f7d680;
			margin-bottom: 28upx;
			.yticon{
				color: #f6e5a3;
				margin-right: 16upx;
			}
		}
		.e-b{
			font-size: $font-sm;
			color: #d8cba9;
			margin-top: 10upx;
		}
	}
	.cover-container{
		background: $page-color-base;
		margin-top: -150upx;
		padding: 0 30upx;
		position:relative;
		background: #f5f5f5;
		padding-bottom: 20upx;
		.arc{
			position:absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}
	.tj-sction{
		@extend %section;
		.tj-item{
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}
		.num{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}
	.order-section{
		@extend %section;
		padding: 28upx 0;
		margin-top: 20upx;
		.order-item{
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
		}
		.yticon{
			font-size: 48upx;
			margin-bottom: 18upx;
			color: #fa436a;
		}
		.icon-shouhoutuikuan{
			font-size:44upx;
		}
	}
	.history-section{
		padding: 30upx 0 0;
		margin-top: 20upx;
		background: #fff;
		border-radius:10upx;
		.sec-header{
			display:flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;
			.yticon{
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}
		.h-list{
			white-space: nowrap;
			padding: 30upx 30upx 0;
			image{
				display:inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}
	
</style>