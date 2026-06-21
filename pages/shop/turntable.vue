<template>
	<view class="almost-lottery">
		<!-- head -->
		<view class="almost-lottery__head">
			<view :class="['action', isApple && 'action-shadow']" @click="getPrizeAccount()">
				<text class="gold"></text>
				<text class="content">抽奖记录<text class="num"></text></text><!-- {{ goldCoin }} -->
			</view>
			<view class="word u-flex">
				<view class="ico3">
					<u-icon name="arrow-right" @click="show = true"></u-icon>
				</view>
				<u-popup v-model="show" mode="center" border-radius="14" width="604rpx" height="604rpx"
					:closeable="false">
					<view class="puobag">
						<view class="text_a">抽奖记录</view>
						<u-line color="#f4b179" style="margin: 15rpx 0;"/>
						<view v-for="(item, index) in list" :key="index" >
						<view class="u-flex u-row-between text_c">
							<view class="text_b">
								<view class="zhongj">{{item.name}}</view>
								<view class="text_f">{{item.createDate}}</view>
							</view>
							<view class="text_d" v-if="item.grant==1">已完成</view>
							<view class="text_no" v-if="item.grant==0" @click="goAdd(item)">兑换奖品</view>
						</view>
						<u-line color="#f4b179" style="margin: 15rpx 0;"/>
						</view>
					</view>
				</u-popup>
			</view>
		</view>
		<view class="almost-lottery__wheel">
			<almost-lottery :canvasId="canvasConfig.canvasId" :canvasWidth="canvasConfig.width"
				:canvasHeight="canvasConfig.height" :ringCount="2" :duration="5" :prizeList="prizeList"
				:prizeIndex="prizeIndex" @reset-index="prizeIndex = -1" @draw-start="handleDrawStart"
				@draw-end="handleDrawEnd" @finish="handleDrawFinish" v-if="prizeList.length" />
			<view class="count">
				<text class="text">剩余免费抽奖 {{freeNum}} 次</text>
			</view>
		</view>
		<!-- rule -->
		<view class="almost-lottery__rule">
			<view class="rule-head">
				<view class="line"></view>
				<text class="title">活动规则</text>
				<view class="line"></view>
			</view>
			<u-parse :html="info" :autoscroll="true" :tag-style="tagStyle"  ></u-parse>
		</view>
	</view>
</template>

<script>
	import AlmostLottery from '@/uni_modules/almost-lottery/components/almost-lottery/almost-lottery.vue'
	import {
		clearCacheFile
	} from '@/uni_modules/almost-lottery/utils/almost-utils.js'
	export default {
		name: 'Home',
		components: {
			AlmostLottery
		},
		data() {
			return {
				conversion:0,
				tagStyle: {
						  	img: 'float:left',
						  },
						  info:"",
				// 开启调试模式
				list: [],
				isDev: true,
				show: false,
				shopId: '',
				addressData: {},
				// 以下是画板配置相关数据
				// canvas id、宽、高
				canvasConfig: {
					canvasId: 'almostLotteryCanvas',
					width: 280,
					height: 280
				},

				// 以下是转盘 UI 配置
				// 转盘外环图
				lotteryBg: 'https://raw.githubusercontent.com/ialmost/almost-components_uniapp/dev/Lottery/almost-lottery_sample/static/lottery-bg.png',
				// 抽奖按钮图
				actionBg: 'https://raw.githubusercontent.com/ialmost/almost-components_uniapp/dev/Lottery/almost-lottery_sample/static/action-bg.png',

				// 以下是奖品配置数据
				// 奖品数据
				prizeList: [],
				// 奖品是否设有库存
				onStock: true,
				// 中奖下标
				prizeIndex: -1,

				// 是否正在抽奖中，避免重复触发
				prizeing: false,

				// 以下为中奖概率有关数据
				// 是否由前端控制概率，默认不开启，强烈建议由后端控制
				onFrontend: false,
				// 权重随机数的最大值
				weightTotal: 0,
				// 权重数组
				weightArr: [],

				// 以下为业务需求有关示例数据
				// 金币余额
				goldCoin: 600,
				// 当日免费抽奖次数余额
				freeNum: 3,
				// 每次消耗的金币数
				goldNum: 20,
				// 每天免费抽奖次数
				freeNumDay: 3
			}
		},
		computed: {
			isApple() {
				return uni.getSystemInfoSync().platform === 'ios'
			}
		},
		methods: {
			// 重新生成
			handleInitCanvas() {
				clearCacheFile()
				this.prizeList = []
				this.getPrizeList()
			},
			goAdd(item) {
				console.log(item.id)
				uni.navigateTo({
					url: `/pages/shop/address?source=2&prizeId=${item.id}`
				})
			},
			// 获取奖品列表
			async getPrizeList() {
				uni.showLoading({
					title: '奖品准备中...'
				})
				//获取免费抽奖次数
				// 等待接口返回的数据进一步处理
				let res = await this.$u.post("/plug_shop/shopuser/turnableData");
				let data = res.data
				let luckNum = data.pop().LuckNum
				this.freeNum = luckNum
				console.log('剩余次数', luckNum)
				if (res) {
					let prizeList = data
					console.log('奖品列表：', prizeList)
					if (data.length) {
						this.prizeList = prizeList
						console.log('已获取到奖品列表数据，开始绘制抽奖转盘')
					}
				} else {
					uni.hideLoading()
					uni.showToast({
						title: '获取奖品失败'
					})
				}
			},
			// 本次抽奖开始
			 handleDrawStart() {
				console.log('触发抽奖按钮')
				if (this.prizeing) return
				this.prizeing = true


				// 还有免费数次或者剩余金币足够抽一次
				if (this.freeNum > 0) {

					// 更新免费次数或金币余额
					if (this.freeNum > 0) {
						this.freeNum--
					}
					this.tryLotteryDraw()
				} else {
					this.prizeing = false
					uni.showModal({
						// title: '今日抽奖次数用完了',
						content: '抽奖次数用完了哦,是否使用用'+this.conversion+'积分兑换一次抽奖机会？',
						success:async (e)=>{
							if(e.confirm){
							let res = await this.$u.post("/plug_shop/shopuser/conversion");
							if(res.result=="true"){
								this.getPrizeList()
								// this.handleDrawStart()
							}
							}
							
						}
					})
				}
			},
			// 尝试发起抽奖
			async tryLotteryDraw() {
					//this.remoteGetPrizeIndex()
					//获取抽奖的奖品下标
					let res = await this.$u.post("/plug_shop/shopuser/getPrizeIndex");
					console.log('返回对象=====', res)
					let data = res.data;
					console.log(data)
					for (var i = 0; i < this.prizeList.length; i++) {
						if(this.prizeList[i].prizeId ==data){
							this.prizeIndex = i
						}
					}
					console.log(this.prizeIndex)
					console.log(this.prizeList[this.prizeIndex].prizeId)
			},
			// 本次抽奖结束
			handleDrawEnd() {
				// 旋转结束后，开始处理拿到结果后的逻辑
				this.prizeing = false
				let prizeName = this.prizeList[this.prizeIndex].name
				let tipContent = ''

				if (prizeName === '谢谢参与') {
					tipContent = '很遗憾，没有中奖，请再接再厉！'
				} else {
					// 如果奖品设有库存
					if (this.onStock) {
						let prizeStock = this.prizeList[this.prizeIndex].stock
						tipContent = prizeStock ? `恭喜您，获得 ${prizeName}` : `很抱歉，您来晚了，当前奖品 ${prizeName} 已无库存`
					} else {
						tipContent = `恭喜您，获得 ${prizeName} ！`
					}
				}

				uni.showModal({
					content: tipContent,
					showCancel: false
				})
			},
			// 抽奖转盘绘制完成
			handleDrawFinish(res) {
				uni.showToast({
					title: res.msg,
					duration: 3000,
					mask: true,
					icon: 'none'
				})
			},

			async getPrizeAccount() {
				let res = await this.$u.post("/plug_shop/shopuser/getPrizeAccount"); 
				this.show = true
				this.list =  res.data
			}
		},
		async onLoad() {
			// 请求奖品数据
			this.getPrizeList()
			let res = await this.$u.post("/plug_shop/shopuser/ueditor"); 
			this.info = res.date;
			this.conversion= res.conversion
		},
		onUnload() {
			uni.hideLoading()
		}
	}
</script>

<style lang="scss" scoped>
	.zhongj{
		width: 400rpx;
		// font-size: 32rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 24rpx;
	}
	.text_no{
		width: 120rpx;
		height: 42rpx;
		line-height: 42rpx;
		text-align: center;
		background-color: #e8c276;
		color: #aa0000;
		border-radius:20rpx;
		margin-right: -10rpx;
		font-size: 24rpx;
	}
	.puobag{
		min-height: 604rpx;
		background-color: #f0e1cb;
	}
	.text_c{
		margin: 0 30rpx;
	}
	.text_b{
		color: #424242;
		font-size: 22rpx;
	}
	.text_d{
		color: #FF893F;
		font-size: 24rpx;
	}
	
	.text_a {
		width: 130rpx;
		height: 60rpx;
		line-height: 60rpx;
		margin: 0 auto;
		color: #424242;
		font-size: 32rpx;
		padding: 20rpx 0;
		margin-bottom: 26rpx;
	}

	.almost-lottery {
		flex: 1;
		background-color: #FF893F;
		max-width: 750rpx;
		overflow: hidden;
	}

	.almost-lottery__head {
		position: relative;
		width: 100%;
		height: 640rpx;
		background: url('~static/images/lottery/top-bg.png') no-repeat center center/cover;

		.action {
			position: relative;
			top: 400rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 480rpx;
			height: 88rpx;
			line-height: 88rpx;
			margin: 0 auto;
			color: #FFFFFF;
			font-size: 32rpx;
			background-color: rgba(255, 136, 61, 1);
			border-radius: 44rpx;
		}

		.action-shadow {
			box-shadow: 0px 14rpx 0px 0px rgba(235, 112, 36, 1);
		}

		.gold {
			width: 44rpx;
			height: 44rpx;
			margin-right: 10rpx;
			background-repeat: no-repeat;
			background-position: center center;
			background-size: contain;
			background-image: url("~static/images/lottery/gold.png");

			@media (-webkit-min-device-pixel-ratio: 2),
			(min-device-pixel-ratio: 2) {
				background-image: url("~static/images/lottery/gold@2x.png");
			}

			@media (-webkit-min-device-pixel-ratio: 3),
			(min-device-pixel-ratio: 3) {
				background-image: url("~static/images/lottery/gold@3x.png");
			}
		}

		.num {
			color: #F9FC31;
		}

		.tip {
			position: relative;
			top: 428rpx;
			color: #FFFFFF;
			font-size: 24rpx;
			text-align: center;
		}
	}

	.almost-lottery__wheel {
		text-align: center;

		.count {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
			padding: 40rpx 0;
		}

		.text {
			color: #FFFFFF;
			font-size: 24rpx;
		}
	}

	.almost-lottery__rule {
		padding: 0 28rpx;
		color: #FFF8CB;

		.rule-head {
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin: 40rpx 0;

			.line {
				flex: 1;
				height: 1px;
				background-color: #FFF3A5;
			}

			.title {
				width: 280rpx;
				color: #F63857;
				line-height: 70rpx;
				text-align: center;
				margin: 0 20rpx;
				border-radius: 8rpx;
				background-image: linear-gradient(0deg, rgba(255, 242, 158, 1), rgba(255, 244, 168, 1));
			}
		}

		.rule-body {
			color: #FFF8CB;
			font-size: 24rpx;
			padding: 10rpx 0 40rpx;

			.item {
				display: flex;
				margin-bottom: 10rpx;
			}

			.number {
				position: relative;
				top: 4rpx;
				width: 28rpx;
				height: 28rpx;
				line-height: 28rpx;
				text-align: center;
				color: #F63857;
				background: #FFF8CB;
				border-radius: 50%;
				margin-right: 10rpx;
			}

			.text {
				flex: 1;
			}

			.item-rule .text {
				display: flex;
				flex-direction: column;
			}
		}
	}

	.almost-action {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 400rpx;
		height: 80rpx;
		border-radius: 10rpx;
		text-align: center;
		background-color: red;
		margin: 0 auto 40rpx;

		.text {
			color: #FFFFFF;
			font-size: 28rpx;
		}
	}
</style>
