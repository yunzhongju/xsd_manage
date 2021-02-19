<template>
	<div>
		<div class="top">
			<Breadcrumb></Breadcrumb>
		</div>
		<div class="content">
			<el-card shadow="always" class="box-card">
				<div>
				 <el-tabs v-model="activeName" @tab-click="handleClick">
						<el-tab-pane label="活动详情" name="0">
							<el-form label-position="right" label-width="150px" inline class="demo-table-expand">
								<el-form-item label="活动标题:">
									<span>{{ currentActivity.title }}</span>
								</el-form-item>
								<el-form-item label="活动界面:">
									<div class="block">
										<el-avatar shape="square" :size="100" :src="currentActivity.coverImg">
											
										</el-avatar></div>
									<!-- <img :src="currentActivity.coverImg " alt="" style="width: 260px;height: 162px;"> -->
								</el-form-item>
								<el-form-item label="活动创建时间:">
									<span>{{currentActivity.createTime|timeFormate}}</span>
								</el-form-item>
								<el-form-item label="活动开始时间:">
									<span>{{ currentActivity.startTime|timeFormate}}</span>
								</el-form-item>
								<el-form-item label="活动结束时间:">
									<span>{{currentActivity.endTime|timeFormate }}</span>
								</el-form-item>
								<el-form-item label="投票详情描述:">
									<div style="margin-left: 120px;">
										<span v-html="currentActivity.content"></span>
									</div>
								</el-form-item>
								<el-form-item label="发布状态:">
									<span v-if="currentActivity">{{ currentActivity.name}}</span>
								</el-form-item>
								<el-form-item label="用户每天投票次数:">
									<span v-if="currentActivity.sets">{{ currentActivity.sets.dayTimes}}</span>
								</el-form-item>
								<el-form-item label="用户投票总次数:">
									<span v-if="currentActivity.sets">{{ currentActivity.sets.totalTimes}}</span>
								</el-form-item>
								<el-form-item label="是否允许单日重复投:">
									<span v-if="currentActivity.sets">{{ currentActivity.sets.dayRevote?'允许':'不允许'}}</span>
								</el-form-item>
								<el-form-item label="文案:">
									<span v-if="currentActivity.sets">{{ currentActivity.sets.title}}</span>
								</el-form-item>
								<el-form-item label="投票选项:" style="width: 100%;">
									<ul class="tabs-item">
										<li v-for="(item,index) in currentActivity.items">
											<!-- <div class="block"><el-avatar shape="square" :size="150" :src="item.coverImg"></el-avatar></div> -->
											<img :src="item.coverImg" alt="" style="width: 260px;height: 162px;">
											<p>{{item.title}}</p>
										</li>
									</ul>
								</el-form-item>
							</el-form>
						</el-tab-pane>
						<el-tab-pane label="参与情况" name="2">
							<StatisticsList :data="currentActivity"></StatisticsList>
							<PartcipateList :list="list"></PartcipateList>
							<Footer :total="total" @currentPage="getCurrentPage"></Footer>
						</el-tab-pane>
						<el-tab-pane label="投票结果" name="3">
							<VotingResults :list="currentActivity.items"></VotingResults>
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-card>
		</div>
	</div>
</template>

<script>
	import Breadcrumb from '../../components/breadcrumb.vue'
	import VotingResults from './components/votingResults.vue'
	import StatisticsList from './components/statisticsList.vue'
	import PartcipateList from './components/participateList.vue'
	import Footer from '../../components/footer.vue'
	import {getActiveDetailByIdAPI,getJoinerRecordsAPI} from '../../api/api.js'
	export default {
		components:{
			Breadcrumb,
			VotingResults,
			StatisticsList,
			PartcipateList,
			Footer
		},
		data(){
			return {
				list:[],
				pageSize:10,
				pageNumber:1,
				id:'',
				total:0,
				currentActivity:'',
				input:'',
				activeName:'0',
				activeLink:'pages/index/index?scene=qr_2_753786866385293312'
			}
		},
		methods:{
			getCurrentPage(page){
				this.getJoinerRecords({id:this.id,pageSize:this.pageSize,pageNumber:page})
			},
			getJoinerRecords(params){
				getJoinerRecordsAPI(params).then(res=>{
					console.log(res,111111111);
					this.total=res.totalRow
					this.list=res.list
				})
			},
			getActiveDetailById(id){
				getActiveDetailByIdAPI({id:id}).then(res=>{
					console.log('info',res);
					this.currentActivity=res
				})
			}
		},
		created() {
			this.id=this.$route.query.id
			this.getJoinerRecords({id:this.id,pageSize:this.pageSize,pageNumber:this.pageNumber})
			this.getActiveDetailById(this.id)
		},
		filters: {
			timeFormate(time) {
				let timer = new Date(time*1000);
				let y = timer.getFullYear();
				let m = timer.getMonth() + 1 < 10 ? '0' + (timer.getMonth() + 1) : timer.getMonth() + 1;
				let d = timer.getDate() > 9 ? timer.getDate() : '0' + timer.getDate();
				let h = timer.getHours() < 10 ? '0' + timer.getHours() : timer.getHours();
				let mint = timer.getMinutes() < 10 ? '0' + timer.getMinutes() : timer.getMinutes();
				return y + '-' + m + '-' + d + ' ' + h + ':' + mint;
			}
		},
	}
</script>

<style lang="less" scoped>
	.content{
		margin-top: 40px;
	}
	.box-card{
		min-height: 700px;
		overflow-y: auto;
	}
	.recommend{
		padding: 20px 30px;
		h3{
			margin-bottom: 20px;
			margin-left: 10px;
		}
		.btn{
			padding-left: 50px;
			margin-top: 30px;
		}
		span{
			margin-left: 10px;
			width: 80px;
			// height: 70px;
			cursor: pointer;
			padding: 8px 8px;
			border-radius: 4px;
			color: rgba(16, 16, 16, 1);
			font-size: 14px;
			text-align: center;
			font-family: Microsoft Yahei;
			border: 1px solid rgba(187, 187, 187, 1);
		}
	}
	.Votingresults{
		display: flex;
		justify-content: space-between;
		// border-bottom: 1px solid gainsboro;
		padding: 20px 10px;
	}
	.daochu{
		display: flex;
		justify-content: space-between;
		padding: 20px 10px;
		border-bottom: 1px solid gainsboro;
	}
	.demo-table-expand{
		display: flex;
		flex-direction: column;
		padding-left: 40px;
	}
	.tabs-item{
		display: flex;
		flex-wrap: wrap;	
		width: 100%;
		li{
			// margin-right: 20px;
			width: 260px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 10px 20px;
			p{
				text-align: center;
			}
		}
	}
</style>
