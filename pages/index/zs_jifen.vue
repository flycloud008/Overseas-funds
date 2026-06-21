<template>
	<view class="container">
		<view class="main">
			<view class="income-card" style="margin-top: 0upx;">
				<view class="tit">
					<text>持有{{typeName}}</text>
				</view>
				<view class="show-content">
					<view class="view-category">
						<view v-if="type==1" class="num"><text style="font-size: 50upx;">{{member.jindou}}</text></view>
						<view v-if="type==2" class="num"><text style="font-size: 50upx;">{{member.balance}}</text></view>
						<view v-if="type==3" class="num"><text style="font-size: 50upx;">{{member.money3}}</text></view>
					</view>
					
				
				</view>
			</view>
			<!-- 我的团队 -->
			<view class="income-card">
				<view class="tit" @click="navTo('/pages/user/myTeam')">
					<text>赠送{{typeName}}</text>
				</view>
				<view class="show-input">
					<u-field v-model="targetCode" label="接收账号" placeholder="请填写接收账号" />
					<u-field v-model="targetNum" label="赠送数量" placeholder="请填赠送数量" />
					<u-button type="warning" style="width: 100%;" @click="submit">立即赠送</u-button>
				</view>
			</view>
			<!-- 工具 -->
			<view class="tool-card">
				<view class="tool-item" @click="jilu">
					<u-icon name="man-add" size="45" color="#FF0000"></u-icon>
					<view class="item-right">
				
						<view class="view-text">{{typeName}}记录</view>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
				
			</view>
		</view>
		<u-modal v-model="show" :content="content"  @confirm="confirm" :show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				typelist: [{
						name: '消费积分',
					},
					{
						name: '商城积分',
					},
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				typevalue: '',
				targetCode: "",
				targetNum: "",
				member: {},
				type:1,
				typeName :'',
				show: false,
				content: '',
				settings:{},

			}
		},
		onLoad(option) {
			if(option.loginCode){
				this.targetCode = option.loginCode
			}
			if(option.type  ==1 ){
				uni.setNavigationBarTitle({
					title:"赠送绿色积分"
				})	
				this.type =1 ;
				this.typeName = "绿色积分"
			}else 	if(option.type  ==2 ){
				uni.setNavigationBarTitle({
					title:"赠送消费金"
				})	
				this.type = 2;
				this.typeName = "消费金"
			}else 	if(option.type  ==3 ){
				uni.setNavigationBarTitle({
					title:"赠送期权积分"
				})	
				this.type =3;
				this.typeName = "期权积分"
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
				
				//查询配置
				this.settings= await this.$u.post("/html/work_ddl/index/getDDLSetting");
			},
			
			submit(){
				console.log(this.settings.trance_qiquan)
				if (this.targetCode == '') {
					uni.$u.toast('请输入接受方手机账号');
					return;
				}
				if (this.targetNum == '') {
					uni.$u.toast('请输入要赠送的数量');
					return;
				}
				if(this.type == 1){
					this.content = "是否确认赠送"+this.targetNum+"绿色积分给"+this.targetCode;
				}else if(this.type == 2){
					this.content = "是否确认赠送"+this.targetNum+"消费金给"+this.targetCode;
				}else if(this.type == 3){
					
					if(this.member.isService == "1"){
						this.content = "是否确认赠送"+this.targetNum+"期权积分给"+this.targetCode;
					}else{
						var shouxufei = Number(this.targetNum) * Number(this.settings.trance_qiquan)
						var allMoney = shouxufei + Number(this.targetNum);
						
						this.content = "赠送手续费"+shouxufei+"期权积分,共需"+allMoney +"期权积分 ,是否确认赠送"+this.targetNum+"期权积分给"+this.targetCode;
					}
					
				}
				
				this.show =  true;
			},

			async confirm() {
			

				var res = await this.$u.post('/work_ddl/user/sendJiFen', {
					typevalue: this.type,
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
			},
			jilu(){
				if(this.type ==1 ){
					this.navTo('/pages/index/accountList',{title:this.typeName,moneyType:JSON.stringify(['10']),changeType:JSON.stringify([])})
				}
				else if(this.type ==2 ){
					this.navTo('/pages/index/accountList',{title:this.typeName,moneyType:JSON.stringify(['1']),changeType:JSON.stringify([])})
				}else if(this.type ==3 ){
					this.navTo('/pages/index/accountList',{title:this.typeName,moneyType:JSON.stringify(['3']),changeType:JSON.stringify([])})
				}
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
				
				.show-input{
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