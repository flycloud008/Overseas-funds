<template>
	<view class="content">
		<!-- <text class="success-icon yticon icon-xuanzhong2"></text> -->
		<u-icon style="margin-top: 80rpx;" v-if="type==1" name="checkbox-mark" size="160" color="#fa436a" label-size="40" margin-top="30" :label="msg" label-pos="bottom" ></u-icon>
		<u-icon style="margin-top: 80rpx;" v-if="type==0" name="close" size="160" color="#77787b" label-size="40" margin-top="30" :label="msg" label-pos="bottom" ></u-icon>
		
		<view class="btn-group">
			<navigator url="/pages/shop/order?state=0" open-type="redirect" class="mix-btn">查看订单</navigator>
			<navigator url="/pages/index/index" open-type="switchTab" class="mix-btn hollow">返回首页</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:0,
				msg:""
			}
		},
		
		onLoad(option){
			this.type = option.type;
			this.msg = option.msg;
		},
		methods: {
			
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
	
	.content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.success-icon{
		font-size: 160upx;
		color: #fa436a;
		margin-top: 100upx;
	}
	.tit{
		font-size: 38upx;
		color: #303133;
	}
	.btn-group{
		padding-top: 100upx;
	}
	.mix-btn {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600upx;
		height: 80upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		&.hollow{
			background: #fff;
			color: #303133;
			border: 1px solid #ccc;
		}
	}
</style>
