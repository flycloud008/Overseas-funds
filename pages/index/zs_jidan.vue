<template>
	<view class="container">
		<view class="main">
			<view class="income-card" style="margin-top: 0upx;">
				<view class="tit">
					<text>持有鸡蛋</text>
				</view>
				<view class="show-content">
					<view class="view-category">
						<view class="num"><text style="font-size: 24upx;">{{member.money3}}个</text></view>
						<view class="text">批发鸡蛋</view>
					</view>

					<view class="line"></view>
					<view class="view-category">
						<view class="num"> <text style="font-size: 24upx;">{{member.money4}}个</text> </view>
						<view class="text">零售鸡蛋</view>
					</view>
				</view>
			</view>
			<!-- 我的团队 -->
			<view class="income-card">
				<view class="tit" @click="navTo('/pages/user/myTeam')">
					<text>赠送鸡蛋</text>
				</view>
				<view class="show-input">
					<u-radio-group v-model="typevalue" @change="radioGroupChange">
						<u-radio v-for="(item, index) in typelist" :key="index" :name="item.name">
							{{item.name}}
						</u-radio>
					</u-radio-group>
					<u-field v-model="targetCode" label="接收账号" placeholder="请填写接收账号" />
					<u-field v-model="targetNum" label="总数数量" placeholder="请填赠送数量" />
					<u-button type="warning" style="width: 100%;" @click="submit">立即赠送</u-button>
				</view>
			</view>
			<!-- 工具 -->
			<view class="tool-card">
				<view class="tool-item" @click="navTo('/pages/index/accountList',{title:'鸡蛋赠送记录',moneyType:JSON.stringify(['3','4']),changeType:JSON.stringify(['赠送批发鸡蛋','赠送零售鸡蛋','获赠批发鸡蛋','获赠零售鸡蛋'])})">
					<u-icon name="man-add" size="45" color="#FF0000"></u-icon>
					<view class="item-right">

						<view class="view-text">鸡蛋赠送记录</view>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				typelist: [{
						name: '批发鸡蛋',
					},
					{
						name: '零售鸡蛋',
					},
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				typevalue: '',
				targetCode: "",
				targetNum: "",
				member: {},

			}
		},
		onLoad(option) {
			if(option.loginCode){
				this.targetCode = option.loginCode
			}
			this.loadData();
		},
		methods: {
			async loadData() {
				var user = await this.$u.post("/login/getLoginUserinfo");
				if(!user.isLogin){
					uni.$u.route('/pages/login/login');
					return ;
				}
				
				
				this.member = user.userinfo.member
			},

			async submit() {
				if (this.typevalue == '') {
					uni.$u.toast('请选择要赠送的鸡蛋类型');
					return;
				}
				if (this.targetCode == '') {
					uni.$u.toast('请输入接受方账号');
					return;
				}
				if (this.targetNum == '') {
					uni.$u.toast('请输入要赠送的数量');
					return;
				}

				var res = await this.$u.post('/work_ddl/user/sendJiDan', {
					typevalue: this.typevalue,
					targetCode: this.targetCode,
					targetNum: this.targetNum
				});

				if (res.result == 'true') {
					uni.$u.toast('赠送'+this.typevalue+'成功');
					setTimeout(function() {
						uni.navigateBack();
					}, 1500)
				}

			},
			radioGroupChange(e) {
				this.typevalue = e;
			}
		}

	}
</script>

<style lang="scss" scoped>
	page {
		background: #F2F3F7;
	}

	.container {
		.userinfo-card {
			.card-box {
				width: 100%;
				height: 400upx;
				position: relative;
				z-index: 0;

				.user-section {
					position: absolute;
					top: 0;
					z-index: 10;
					width: 100%;
					padding: 50upx 30upx 210upx;
					display: flex;

					.avatar-wrap {
						width: 100upx;
						height: 100upx;
						border-radius: 50%;
						overflow: hidden;

						.avatar {
							width: 100%;
							height: 100%;
						}
					}

					.portrait-box {
						margin-left: 18upx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.info-box {
							font-size: 38upx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #333;
						}

						.tuan {
							display: flex;
							align-items: center;

							.ma {
								font-size: 24upx;
								font-family: PingFang SC;
								font-weight: 500;
								color: #333;
							}

							.fuzi {
								width: 64upx;
								height: 34upx;
								background: #303133;
								border-radius: 15upx;
								font-size: 20upx;
								font-family: PingFang SC;
								font-weight: 500;
								color: white;
								text-align: center;
								line-height: 34upx;
								margin-left: 10upx;
							}
						}
					}
				}

				.balance-card-wrap {
					width: 100%;
					height: 200upx;
					padding: 0 20upx;
					position: absolute;
					bottom: 0;
					z-index: 10;

					.balance-card {
						width: 100%;
						height: 200upx;
						background: linear-gradient(90deg, #fddeb8 0%, #f9c378 100%);
						border-radius: 20upx;
						padding: 30upx;

						.tit {
							font-size: 32upx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #754202;
						}

						.xia {
							width: 100%;
							display: flex;
							justify-content: space-between;

							.num {
								font-size: 70upx;
								font-family: DINPro;
								font-weight: bold;
								color: #754202;
							}

							.withdraw-btn {
								width: 150upx;
								height: 60upx;
								line-height: 60upx;
								text-align: center;
								background: #3B3533;
								font-size: 28upx;
								font-family: PingFang SC;
								font-weight: 500;
								color: #F9C378;
								border-radius: 10upx;
							}
						}
					}
				}
			}

		}


		.main {
			padding: 20upx;

			.income-card {
				width: 100%;
				background-color: #fff;
				border-radius: 20upx;
				padding: 30upx;
				margin-top: 20upx;

				.tit {
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 32upx;
					line-height: 32upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #333333;

					image {
						width: 10upx;
						height: 21upx;
					}
				}

				.show-content {
					display: flex;
					justify-content: space-around;
					align-items: center;
					margin-top: 40upx;

					.view-category {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;

						.num {
							font-size: 38upx;
							font-family: PingFang SC;
							font-weight: 800;
							color: #333333;
						}

						.text {
							font-size: 24upx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #999999;
						}
					}

					.line {
						width: 1px;
						height: 65upx;
						background-color: #E6E6E6;
					}
				}

				.show-input {
					display: flex;
					flex-direction: column;
					height: 250px;
					justify-content: space-evenly;
				}
			}

			.tool-card {
				background-color: #ffffff;
				width: 100%;
				padding: 0 30upx;
				margin-top: 20upx;
				border-radius: 20upx;

				.tool-item {
					display: flex;
					flex-direction: row;
					width: 100%;
					height: 100upx;
					align-items: center;
					justify-content: space-between;

					.view-image-left {
						width: 44upx;
					}

					.item-right {
						flex: 1;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: space-between;

						.view-text {
							margin-left: 22upx;
							font-size: 28upx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #1A1A1A;
						}

						.view-image-right {
							width: 10upx;
							height: 21upx;
						}
					}
				}
			}
		}
	}
</style>