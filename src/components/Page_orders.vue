<template>
  <div>
    <el-row>
      <el-col :span="15">
        <el-divider content-position="right"><span style="font-width: bold;color: #cf9236">审核领养请求</span></el-divider>
        <div>
          <el-table
            :data="raises.filter(data => !searchRaises || data.name.toLowerCase().includes(searchRaises.toLowerCase()))"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            <el-table-column prop="name" label="请求者姓名"></el-table-column>
            <el-table-column prop="phone" label="请求者联系方式"></el-table-column>
            <el-table-column prop="address" label="请求者地址"></el-table-column>
            <el-table-column prop="date" label="发起请求日期"></el-table-column>
            <el-table-column prop="status" label="领养状态"></el-table-column>
            <el-table-column align="right" width="350">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="searchRaises"
                  size="medium"
                  clearable
                  placeholder="输入姓名关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="success"
                  @click="getRaisesInfo(scope.$index, scope.row)">领养宠物信息</el-button>
                <el-button
                  size="small"
                  type="info"
                  @click="agreeRaises(scope.$index, scope.row)">同意请求</el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="disAgreeRaises(scope.$index, scope.row)">驳回请求</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin: 15px 0px"
                         layout="prev, pager, next,jumper,total,sizes"
                         :page-size="pageSizeRaises"
                         :total="totalRaises"
                         :current-page="pageNowRaises"
                         :page-sizes="[2,4,6,8,10]"
                         prev-text="上一页"
                         next-text="下一页"
                         background
                         small
                         @current-change="findRaisesPage"
                         @size-change="findRaisesSize">
          </el-pagination>
        </div>
        <el-divider content-position="right"><span style="font-width: bold;color: #cf9236">被审核领养请求</span></el-divider>
        <div>
          <el-table
            :data="raises2.filter(data => !searchRaises2 || data.phones.toLowerCase().includes(searchRaises2.toLowerCase()))"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            <el-table-column prop="number" label="编号" width="300"></el-table-column>
            <el-table-column prop="phones" label="发布者联系方式" width="180"></el-table-column>
            <el-table-column prop="date" label="发起请求日期"></el-table-column>
            <el-table-column prop="status" label="审核状态"></el-table-column>
            <el-table-column align="right" width="180">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="searchRaises2"
                  size="medium"
                  clearable
                  placeholder="输入手机号码字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="success"
                  @click="getRaisesInfo(scope.$index, scope.row)">领养宠物信息</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin: 15px 0px"
                         layout="prev, pager, next,jumper,total,sizes"
                         :page-size="pageSizeRaises2"
                         :total="totalRaises2"
                         :current-page="pageNowRaises2"
                         :page-sizes="[2,4,6,8,10]"
                         prev-text="上一页"
                         next-text="下一页"
                         background
                         small
                         @current-change="findRaisesPage2"
                         @size-change="findRaisesSize2">
          </el-pagination>
        </div>
      </el-col>
      <el-col :span="9">
        <h2>宠物的描述信息</h2>
        <div style="background-color: #C3ECFF;padding: 20px">
          <el-form :label-position="labelPosition">
            <el-form-item label="" prop="content">
              <quill-editor v-model="raise.content"
                            disabled
                            ref="myQuillEditor"
                            style="background-color: #d9ecff;">
              </quill-editor>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
      name: "Page_orders",
      data(){
        return{
          labelPosition: 'right',
          raises:[{
            number:'',
            content: '',
            address:'',
            phone:'',  //发起领养者联系方式
            name:'',
            phones:'', //发布者联系方式
            status:'',
            date:'',
          }],
          raises2:[{
            number:'',
            content: '',
            address:'',
            phone:'',  //发起领养者联系方式
            name:'',
            phones:'', //发布者联系方式
            status:'',
            date:'',
          }],
          raise: {
            content: '',
          },
          searchRaises:'',
          totalRaises:0,
          pageSizeRaises:4,
          pageNowRaises:1,
          searchRaises2:'',
          totalRaises2:0,
          pageSizeRaises2:4,
          pageNowRaises2:1,
        }
      },
      methods:{
        /*同意领养*/
        agreeRaises(index,row){
          let _this=this;
          this.$http.post("http://localhost:9150/raises/agreeRaise?number="+row.number).then(function (result) {
            if (result.data.status==200){
              _this.$message({
                showClose: true,
                message: '恭喜你:'+result.data.msg,
                type: 'success'
              });
              _this.findRaisesList();
            }
          });
        },

        /*领养驳回*/
        disAgreeRaises(index,row){
          let _this=this;
          this.$http.post("http://localhost:9150/raises/disagreeRaise?number="+row.number).then(function (result) {
            if (result.data.status==200){
              _this.$message({
                showClose: true,
                message: '恭喜你:'+result.data.msg,
                type: 'success'
              });
              _this.findRaisesList();
            }
          });
        },

        /*宠物收养模块函数*/
        getRaisesInfo(index,row){
          this.raise.content=row.content;
        },
        //跳转到第几页
        findRaisesPage(page){
          this.pageNowRaises=page;
          this.findRaisesList(page,this.pageSizeRaises);
        },
        //改变没有显示条数
        findRaisesSize(size){
          this.pageSizeRaises=size;
          this.findRaisesList(this.pageNowRaises,size);
        },
        //所有领养请求宠物信息记录
        findRaisesList(page,size){
          page=page?page:this.pageNowRaises;
          size=size?size:this.pageSizeRaises;
          let phone=this.$cookies.get("loginPhone");
          let _this=this;
          this.$http.get("http://localhost:9150/raises/findRaisesList?pageNow="+page+"&pageSize="+size+"&phone="+phone).then(function (result) {
            _this.raises=result.data.raises;
            let list=result.data.raises;
            for (let i=0;i<list.length;i++){
              if (list[i].status=='待审核'){
                _this.raises[i].status='领养中';
              }
              if (list[i].status=='审核通过'){
                _this.raises[i].status='已被领养';
              }
              if (list[i].status=='审核驳回'){
                _this.raises[i].status='未被领养';
              }
            }
            _this.totalRaises=result.data.total;
          })
        },
        //跳转到第几页
        findRaisesPage2(page){
          this.pageNowRaises2=page;
          this.findRaisesList2(page,this.pageSizeRaises2);
        },
        //改变没有显示条数
        findRaisesSize2(size){
          this.pageSizeRaises2=size;
          this.findRaisesList2(this.pageNowRaises2,size);
        },
        //所有领养请求宠物信息记录
        findRaisesList2(page,size){
          page=page?page:this.pageNowRaises2;
          size=size?size:this.pageSizeRaises2;
          let phone=this.$cookies.get("loginPhone");
          let _this=this;
          this.$http.get("http://localhost:9150/raises/findRaisesList2?pageNow="+page+"&pageSize="+size+"&phone="+phone).then(function (result) {
            _this.raises2=result.data.raises;
            _this.totalRaises2=result.data.total;
          })
        },
        tableRowClassName({row, rowIndex}) {
          if (rowIndex%2 === 1) {
            return 'warning-row';
          } else if (rowIndex%2 === 0) {
            return 'success-row';
          }
          return '';
        },
      },
      created() {
        this.findRaisesList();
        this.findRaisesList2();
      }
    }
</script>

<style>
  .el-divider__text.is-center{
    /*height: 20px;*/
  }
  .el-divider--horizontal{
    margin: 12px 0px;
  }
</style>
