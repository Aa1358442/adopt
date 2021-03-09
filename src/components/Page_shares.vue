<template>
    <div>
      <el-row>
        <el-col :span="18" :offset="3">
          <div>
            <el-table
              :data="shares.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
              style="width: 100%"
              :row-class-name="tableRowClassName">
              <el-table-column prop="id" label="编号"></el-table-column>
              <el-table-column prop="title" label="标题"></el-table-column>
              <el-table-column prop="name" label="发布者姓名"></el-table-column>
              <el-table-column prop="date" label="发布日期"></el-table-column>
              <el-table-column align="right" width="180">
                <template slot="header" slot-scope="scope">
                  <el-input
                    v-model="search"
                    size="medium"
                    placeholder="输入姓名关键字搜索"/>
                </template>
                <template slot-scope="scope">
                  <el-button
                    type="info"
                    size="small"
                    @click="getInfo(scope.$index, scope.row)">详细信息</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination style="margin: 15px 0px"
                           layout="prev, pager, next,jumper,total,sizes"
                           :page-size="pageSize"
                           :total="total"
                           :current-page="pageNow"
                           :page-sizes="[2,4,6,8,10]"
                           prev-text="上一页"
                           next-text="下一页"
                           background
                           small
                           @current-change="findPage"
                           @size-change="findSize">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>

    export default {
      name: "Page_shares",
      data(){
        return{
          shares: [{
            id: '1',
            title: '养宠物狗的第一步',
            name: 'root',
            date: '2016-05-02',
          }],
          search:'',
          total:0,
          pageSize:4,
          pageNow:1,
        }
      },
      methods:{
        tableRowClassName({row, rowIndex}) {
          if (rowIndex%2 === 1) {
            return 'warning-row';
          } else if (rowIndex%2 === 0) {
            return 'success-row';
          }
          return '';
        },
        getInfo(index,row){
          console.log(row.id);
          this.$cookies.set("sharesId",row.id);
          this.$router.push('/page_shares_desc');
        },
        findPage(page){
          this.pageNow=page;
          this.findSharesList(page,this.pageSize);
        },
        findSize(size){
          this.pageSize=size;
          this.findSharesList(this.pageNow,size);
        },
        findSharesList(page,size){
          page=page?page:this.pageNow;
          size=size?size:this.pageSize;
          let _this=this;
          this.$http.get("http://localhost:9150/shares/findSharesList?pageNow="+page+"&pageSize="+size).then(function (result) {
            _this.shares=result.data.shares;
            _this.total=result.data.total;
          })
        },
      },
      created() {
        this.findSharesList();
      }
    }
</script>

<style scoped>

</style>
