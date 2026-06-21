<template>
	<view class="container">
		<view class="userinfo-card">
			<view class="card-box">
				<view class="user-section">
					<view class="avatar-wrap">
						<image v-if="!vuex_userInfo.avatar" class="avatar" :src=" '../../static/missing-face.png'"></image>
						<image v-if="vuex_userInfo.avatar" class="avatar" :src="vuex_baseImgUrl+vuex_userInfo.avatar"></image>
					</view>
					<view class="portrait-box">
						<view class="info-box">
							<text class="username" >{{vuex_userInfo.loginCode }}</text>
						</view>
						<view class="tuan" >
							<view class="ma">邀请ID：{{vuex_userInfo.member.refNumber}}</view>
							<view class="fuzi" @click="copyHref(vuex_userInfo.member.refNumber)">复制</view>
						</view>
					</view>
				</view>
				<view class="balance-card-wrap">
					<view class="balance-card">
						<view class="tit"  @click="goWithdraw()">佣金[点击提现	]</view>
						<view class="xia" @click="navTo('/pages/user/accountList',{title:'佣金',moneyType:3,changeType:JSON.stringify([])})">
							<view class="num">
								<text style="font-size: 40upx;">￥</text>{{ vuex_userInfo.member.money3 }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="income-card" style="margin-top: 0upx;">
				<view class="tit">
					<text>我的钱包</text>
				</view>
				<view class="show-content">
					<view class="view-category">
						<view class="num"><text style="font-size: 24upx;">￥</text>{{vuex_userInfo.member.money6 }}</view>
						<view class="text">我的冻结佣金</view>
					</view>
					<view class="line"></view>
					<view class="view-category">
						<view class="num"><text style="font-size: 24upx;">￥</text>{{vuex_userInfo.member.money4 }}</view>
						<view class="text" @click="navTo('/pages/user/accountList',{title:'原始积分',moneyType:4,changeType:JSON.stringify([])})">我的原始积分</view>
					</view>
				</view>
			</view>
			<view class="income-card" style="margin-top: 20upx;">
				<view class="tit"  >
					<text>我的累计奖励</text>
				</view>
				<view class="show-content">
					<view class="view-category">
						<view class="num"><text style="font-size: 24upx;">￥</text>{{vuex_userInfo.member.money5}}</view>
						<view class="text">累计佣金</view>
					</view>
					<view class="line"></view>
					<view class="view-category">
						<view class="num"><text style="font-size: 24upx;">￥</text>{{vuex_userInfo.member.money7}}</view>
						<view class="text">分享业绩</view>
					</view>
				</view>
			</view>
			<!-- 我的团队 -->
			<view class="income-card">
				<view class="tit" @click="navTo('/pages/user/myTeam')" >
					<text>我的团队</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
				<view class="show-content">
					<view class="view-category">
						<view class="num">{{teamInfo.zsChildListCount + teamInfo.jtBeforeChildListCount}}</view>
						<view class="text">全部成员</view>
					</view>
					<view class="line"></view>
					<view class="view-category">
						<view class="num">{{teamInfo.zsChildListCount}}</view>
						<view class="text">直属成员</view>
					</view>
					<view class="line"></view>
					<view class="view-category">
						<view class="num">{{teamInfo.jtBeforeChildListCount}}</view>
						<view class="text">非直属成员</view>
					</view>
				</view>
			</view>
			<!-- 工具 -->
			<view class="tool-card">
				<view class="tool-item" @click="navTo('/pages/user/userShare')" >
					<u-icon name="man-add" size="45" color="#FF0000"></u-icon>
					<view class="item-right">
					
						<view class="view-text">推广中心</view>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
				<view class="tool-item" @click="navTo('/pages/user/extractList')"  >
					<u-icon name="coupon" size="45" color="#5CACEE"></u-icon>
					<view class="item-right">
						<view class="view-text">提现记录</view>
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
				
				teamInfo : {
					ztProfitMoney: 0,
					jtProfitMoney: 0,
					zsChildListCount: 0,
					jtBeforeChildListCount: 0,
					jtAfterChildListCount: 0
				},
				userDetail:{
					member:{
						money4:0,
						money5:0,
						money6:0
					}
				},
				userShopOrderSum:{}
			};
		},
		onShow() {
			this.load();
			// this.token = this.$queue.getData('token');
			// let mobile = this.$queue.getData('nickName');
			// let image_url = this.$queue.getData('image_url');

			// let userId = this.$queue.getData('userId');
			// if (userId) {
			// 	this.getMoney(userId);
			// 	this.getUserInfo(userId);
			// 	this.getUserMoney(userId);
			// }

			// if (mobile && mobile !== 'undefined') {
			// 	this.mobile = mobile;
			// } else {
			// 	this.mobile = '';
			// }
			// if (image_url && image_url !== 'undefined') {
			// 	this.image_url = image_url;
			// } else {
			// 	this.image_url = 'https://shegnqx.oss-cn-beijing.aliyuncs.com/20200923/cad8b871208644f094bc38e3e65585e6.png';
			// }
		},
		onLoad() {
			// this.getUser();
		},
		methods: {
			async load(){
				let userinfo = await this.$u.post("/login/getLoginUserinfo");
				this.vuex_updateUser(userinfo);	
				
				
				let resultUserDetail = await this.$u.post("/user/getUserinfoDetail",{});
				
				this.userDetail = resultUserDetail.data;
				
				let result = await this.$u.post("/user/getMyTeamInfo",{jtLevelNum:2});
				if(!result){return;}
				this.teamInfo = result;
				
				// let sumRes = await this.$u.post("/work_ddl/user/getUserShopOrderSum",{});
				// this.userShopOrderSum = sumRes.userShopOrderSum;
				 
				
				
				
				
			},
			goWithdraw(){
				uni.navigateTo({
					url: `/pages/user/recharge`
				})
			},
			//邀请码复制
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
	};
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
