<template>
  <el-table
    :data="list"
    stripe
		height="500"
    style="width: 100%">
    <el-table-column
      label="编号"
			align="center"
      width="180">
			<template slot-scope="scope">
				<span>{{scope.$index+1}}</span>
			</template>
    </el-table-column>
    <el-table-column
      prop="name"
			align="center"
      label="投票项">
			<template slot-scope="scope">
				<div class="voting">
					<el-image
						style="width: 76px; height: 76px"
						:src="scope.row.coverImg"
						fit="cover"></el-image>
					<!-- <img :src="scope.row.coverImg" alt="" style="width: 76px; height: 76px;"> -->
					<p>{{scope.row.title}}</p>
				</div>
			</template>
    </el-table-column>
    <el-table-column
      prop="readNumber"
			align="center"
      label="浏览量">
			<!-- <template slot-scope="scope">
				<span>123</span>
			</template> -->
    </el-table-column>
		<el-table-column
		  prop="ticket"
			align="center"
		  label="票数">
<!-- 			<template slot-scope="scope">
				<span>11</span>
			</template> -->
		</el-table-column>
  </el-table>
</template>

<script>
  export default {
		props:{
			list:{
				type:Array,
				default:()=>[]
			}
		},
    data() {
      return {
        tableData: []
      }
    }
  }
</script>

<style lang="less" scoped>
	.voting{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
