<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home/communityList' }">区划列表</el-breadcrumb-item>
			<el-breadcrumb-item><a href="javascript:void(0);">楼层导览</a></el-breadcrumb-item>
		</el-breadcrumb>

		<el-card class="box-card">
			<el-row>
				<el-col :span="12">
					<div class="grid-content bg-purple">
						<el-button type="primary" size="small" @click="onHandleAdd">添加</el-button>
						<el-button type="primary" size="small" @click="$router.go(-1)">返回</el-button>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<div class="grid-content bg-purple-dark">
						<el-table :data="tableData" height="700" style="width: 100%">
							<el-table-column prop="address" width="100" label="导览图" align="center">
								<template slot-scope="scope">
									<el-image 
										style="height: 76px;width:94px;" 
										:src="scope.row.image" 
										@click="onHandlePreview(scope.row.image)"
										:preview-src-list="srcList"></el-image>
								</template>
							</el-table-column>
							<el-table-column prop="title" label="名称"  align="center"></el-table-column>
							<el-table-column prop="vrImage" label="全景地址" align="center">
								<template slot-scope="scope">
									<a 
										style="color: #409EFF;"
										target="_blank"
										:href="scope.row.vrImage">
										{{scope.row.vrImage}}
										</a>
								</template>
							</el-table-column>
							<el-table-column 
								prop="addTime" 
								label="日期" 
								width="180" 
								align="center">
									<template slot-scope="scope">
										<span>{{scope.row.addTime |timeFormate}}</span>
									</template>
								</el-table-column>
							<el-table-column 
								label="操作" 
								align="center"
								width="180">
								<template slot-scope="scope">
									<el-button type="text" size="small" @click="onHandleDel(scope.row)">删除</el-button>
									<el-button type="text" size="small" @click="onHandleEdit(scope.row)">编辑</el-button>
									<a 
										target="_blank" 
										style="margin-left: 10px;"
										:href="scope.row.vrImage">					
										<el-button type="text" size="small">预览</el-button>
									</a>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-col>
			</el-row>
		</el-card>

		<el-dialog 
			title="添加/修改" 
			:visible.sync="dialogVisible" 
			width="30%" 
			center 
			:before-close="handleClose">
			<div v-if="dialogVisible">
				<el-form 
					:model="numberValidateForm" 
					ref="numberValidateForm" 
					label-width="100px" 
					class="demo-ruleForm">
					<el-form-item 
						label="名称" 
						prop="title" 
						:rules="[{ required: true, message: '名称不能为空' }]">
						<el-input 
							clearable
							v-model.number="numberValidateForm.title"></el-input>
					</el-form-item>
					<el-form-item
						label="排序" 
						prop="sortNum"
						:rules="[{ required: true, message: '排序不能为空' }]">
						<el-input
							v-model.number="numberValidateForm.sortNum" clearable></el-input>
					</el-form-item>
					<el-form-item
						label="图片" 
						prop="image"
						:rules="[{ required: true, message: '图片不能为空' }]">
						<UploadImg @getImgUrl="getImgUrl"></UploadImg>
<!-- 						<div class="showImg" v-show="numberValidateForm.imagePath">
							<el-image
								:src="url"></el-image>
							<i class="el-icon-delete" @click="onHandleDelImg"></i>
						</div> -->
					</el-form-item>
					<el-form-item
						label="全景链接" 
						prop="vrImage"
						:rules="[{ required: true, message: '全景链接不能为空' }]">
						<el-input
							clearable
							v-model.number="numberValidateForm.vrImage"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('numberValidateForm')">确 定</el-button>
				<el-button @click="resetForm('numberValidateForm')">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import UploadImg from '../../components/uploadImg.vue'
	import {getPreviews,savePreviews,getPreviewsDetail,deletePreviewById}  from '../../api/floor.js'
export default {
	components:{
		UploadImg
	},
	data() {
		return {
			current:'',
			orgid:'',
			pageSize:10,
			pageNumber:1,
			url: require('../../assets/floor_1.png'),
			srcList:[],
			numberValidateForm: {
				id:'',
				title: '',
				sortNum:'',
				image:'',
				communityId:'',
				vrImage:''
			},
			dialogVisible: false,
			tableData: []
		};
	},
	methods: {
		onHandlePreview(url){
			if(this.srcList.includes(url)){
				return
			}
			this.srcList.push(url)
		},
		onHandleDelImg(){
			this.numberValidateForm.imagePath=''
		},
		getImgUrl(url){
			console.log(url);
			this.numberValidateForm.image=url
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.numberValidateForm['communityId']=this.orgid
					console.log(this.numberValidateForm);
					savePreviews(this.numberValidateForm).then(res=>{
						this.$message({
							type:'success',
							message:res.msg
						})
						this.getPreviewsList({communityId:this.orgid,pageSize:this.pageSize,pageNumber:this.pageNumber})
						this.dialogVisible=false
					})
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.dialogVisible = false;
		},
		handleClose(done) {
			done();
		},
		onHandleAdd() {
			this.current=null
			this.dialogVisible = true;
		},
		onHandleEdit(row) {
			getPreviewsDetail({id:row.id}).then(res=>{
				console.log(2222222,res);
				this.current=res
				this.numberValidateForm.id=res.id
				this.numberValidateForm.sortNum=res.sortNum
				this.numberValidateForm.title=res.title
				this.numberValidateForm.image=res.image
				this.numberValidateForm.vrImage=res.vrImage
				this.numberValidateForm.communityId=res.communityId
			})
			this.dialogVisible = true;
		},
		onHandleDel(row) {
			this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
				deletePreviewById({id:row.id}).then(res=>{
					this.getPreviewsList({communityId:this.orgid,pageSize:this.pageSize,pageNumber:this.pageNumber})
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
		},
		getPreviewsList(params){
			getPreviews(params).then(res=>{
				this.tableData=res.list
			})
		}
	},
	created() {
		this.orgid=this.$route.query.id
		this.getPreviewsList({communityId:this.orgid,pageSize:this.pageSize,pageNumber:this.pageNumber})
	},
	filters: {
		timeFormate(time) {
			let timer = new Date(time*1000);
			let y = timer.getFullYear();
			let m = timer.getMonth() + 1 < 10 ? '0' + (timer.getMonth() + 1) : timer.getMonth() + 1;
			let d = timer.getDate() > 10 ? timer.getDate() : '0' + timer.getDate();
			let h = timer.getHours() < 10 ? '0' + timer.getHours() : timer.getHours();
			let mint = timer.getMinutes() < 10 ? '0' + timer.getMinutes() : timer.getMinutes();
			return y + '-' + m + '-' + d + ' ' + h + ':' + mint;
		}
	},
};
</script>

<style lang="less" scoped>
.box-card {
	margin-top: 30px;
	min-height: 750px;
	max-height: 750px;
}
.showImg{
	position: relative;
	height: 76px;
	width:94px;
	i{
		position: absolute;
		top: 0px;
		right: -15px;
		cursor: pointer;
		font-weight: 700;
	}
}
</style>
